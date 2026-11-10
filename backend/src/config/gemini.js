import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

// For docs
export const embeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-embedding-001",
  outputDimensionality: 768,
  taskType: "RETRIEVAL_DOCUMENT",
});

// For user questions (new)
export const queryEmbeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-embedding-001",
  outputDimensionality: 768,
  taskType: "RETRIEVAL_QUERY",
});

// For generating chat responses
export const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});