import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

export async function parsePdf(file: File): Promise<string> {
  const fileData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n";
  }

  return text;
}

// -------------------------
// Resume Parsing Logic
// -------------------------
export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
}

export function parseResume(text: string): ResumeData {
  const data: ResumeData = {};

  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  if (emailMatch) data.email = emailMatch[0];

  const phoneMatch = text.match(
    /(\+?\d{1,3})?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{4}/
  );
  if (phoneMatch) data.phone = phoneMatch[0];

  const firstLine = text.split("\n")[0].trim();
  if (firstLine && firstLine.split(" ").length <= 4) {
    data.name = firstLine;
  }

  const skillsMatch = text.match(/Skills\s*[:\-]?\s*(.+)/i);
  if (skillsMatch) {
    data.skills = skillsMatch[1]
      .split(/[,•;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  const educationMatches = text.match(/(B\.?Sc\.?|M\.?Sc\.?|B\.?Tech|M\.?Tech|MBA|Ph\.?D)[^,\n]*/gi);
  if (educationMatches) data.education = educationMatches;

  const expMatches = text.match(/(?:Worked|Intern|Engineer|Manager|Developer)[^.\n]*/gi);
  if (expMatches) data.experience = expMatches;

  return data;
}
