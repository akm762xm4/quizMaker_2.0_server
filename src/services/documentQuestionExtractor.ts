import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import mammoth from "mammoth";
import createHttpError from "http-errors";

const MAX_TEXT_LENGTH = 80_000;

export type ExtractedQuestion = {
  text: string;
  options: string[];
  correctOption: number;
  category: string;
};

export async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
  filename: string
) {
  const extension = filename.toLowerCase().split(".").pop();
  let text = "";

  if (mimeType === "application/pdf" || extension === "pdf") {
    try {
      const { PDFParse } = await import("pdf-parse/node");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } catch (error) {
      throw createHttpError(422, "This PDF could not be read. It may be scanned, encrypted, or malformed.", { cause: error });
    }
  } else if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } catch (error) {
      throw createHttpError(422, "This Word document could not be read.", { cause: error });
    }
  } else if (mimeType === "text/plain" || extension === "txt") {
    text = buffer.toString("utf8");
  } else {
    throw createHttpError(400, "Only PDF, DOCX, and TXT files are supported.");
  }

  const normalized = text.replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n").trim();
  if (!normalized) {
    throw createHttpError(422, "No readable text was found in this document.");
  }
  return normalized.slice(0, MAX_TEXT_LENGTH);
}

export async function extractMcqsFromText(text: string): Promise<ExtractedQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw createHttpError(503, "Document extraction is not configured yet. Add GEMINI_API_KEY to the server environment.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          questions: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                text: { type: SchemaType.STRING },
                options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                correctOption: { type: SchemaType.INTEGER },
                category: { type: SchemaType.STRING },
              },
              required: ["text", "options", "correctOption", "category"],
            },
          },
        },
        required: ["questions"],
      },
    },
  });

  const result = await model.generateContent([
    {
      text: `You extract existing multiple-choice questions from educational documents. Do not invent questions and do not convert descriptive text into questions. Return only questions that are explicitly present and have a clear set of answer choices. Normalize choices into an array, use zero-based correctOption, and use a short topic as category. If the correct answer is not explicitly identifiable, omit that question. Return an empty questions array when no MCQs are present.\n\nDOCUMENT TEXT:\n${text}`,
    },
  ]);

  const raw = result.response.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw createHttpError(502, "The AI returned an invalid question format. Please try the document again.");
  }

  const questions = (parsed as { questions?: unknown })?.questions;
  if (!Array.isArray(questions)) return [];

  return questions.filter((item): item is ExtractedQuestion => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<ExtractedQuestion>;
    return (
      typeof candidate.text === "string" &&
      candidate.text.trim().length > 0 &&
      Array.isArray(candidate.options) &&
      candidate.options.length >= 2 &&
      candidate.options.every((option) => typeof option === "string" && option.trim()) &&
      Number.isInteger(candidate.correctOption) &&
      typeof candidate.correctOption === "number" &&
      candidate.correctOption >= 0 &&
      candidate.correctOption < candidate.options.length
    );
  });
}
