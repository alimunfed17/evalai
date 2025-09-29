import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

interface ConversationMessage {
  role: 'user' | 'model';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ConversationMessage[];
}

interface APIError {
  message: string;
  [key: string]: unknown;
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

function isAPIError(error: unknown): error is APIError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an AI interview assistant designed to help users prepare for job interviews. 
    You should:
    - Ask relevant interview questions based on the user's field/role
    - Provide constructive feedback on answers
    - Offer tips for improving interview performance
    - Maintain a professional yet encouraging tone
    - Help users practice common interview scenarios
    
    Keep responses concise but helpful, and always be supportive in your feedback.`;

    const contents = [
      {
        role: 'user' as const,
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model' as const,
        parts: [{ text: 'Hello! I\'m your AI interview coach. I\'m here to help you prepare for your upcoming interviews. What role or field are you preparing for?' }]
      },
      ...conversationHistory.map((msg: ConversationMessage) => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user' as const,
        parts: [{ text: message }]
      }
    ];

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: contents.slice(1), 
      config: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const aiResponse = response.text;

    return NextResponse.json({
      response: aiResponse,
      success: true
    });

  } catch (error: unknown) {
    console.error('Error in interview chatbot API:', error);
    
    let errorMessage = 'Failed to generate response';
    let errorDetails = 'Unknown error occurred';

    if (isAPIError(error)) {
      errorDetails = error.message;
    } else if (error instanceof Error) {
      errorDetails = error.message;
    } else if (typeof error === 'string') {
      errorDetails = error;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Interview Chatbot API is running',
    endpoints: {
      POST: '/api/interview - Send a message to the chatbot'
    }
  });
}
