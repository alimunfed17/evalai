import mammoth from "mammoth";

/**
 * Parse a DOCX file into plain text
 * @param file - Word document (DOCX) uploaded by the user
 * @returns Extracted raw text
 */
export async function parseDocx(file: File): Promise<string> {
  const fileData = await file.arrayBuffer();

  const { value, messages } = await mammoth.extractRawText({
    arrayBuffer: fileData,
  });

  if (messages && messages.length > 0) {
    console.warn("Mammoth messages:", messages);
  }

  return value.trim();
}
