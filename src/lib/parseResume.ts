import { parsePdf } from "./parsePdf";
import { parseDocx } from "./parseDocx";

/**
 * Universal resume parser
 * Supports PDF and DOCX
 */
export async function parseResume(file: File): Promise<string> {
  const mimeType = file.type;

  if (mimeType === "application/pdf") {
    return await parsePdf(file);
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await parseDocx(file);
  }

  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".pdf")) {
    return await parsePdf(file);
  }
  if (fileName.endsWith(".docx")) {
    return await parseDocx(file);
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
}
