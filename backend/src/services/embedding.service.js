// 1.
// npm install @langchain/core @langchain/google-genai

// 2.
// npm install @langchain/core @langchain/google-genai --legacy-peer-deps


// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { embeddingModel } from "../config/gemini.js";

// export const generateEmbeddings = async (chunks) => {
  // return await embeddingModel.embedDocuments(chunks);
// };
export const generateEmbeddings = async (chunks) => {
  const BATCH_SIZE = 10;
  const embeddings = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    // checking purpose
    const testEmbedding = await embeddingModel.embedQuery("Hello, this is a test document.");
    
    console.log("Embedding length:", testEmbedding.length);
    console.log("Embedding sample:", testEmbedding.slice(0, 5));
    
    // console.log(`Processing embedding batch: chunks ${i} to ${i + batch.length - 1}`);
    const batchEmbeddings = await embeddingModel.embedDocuments(batch);
    
    // Validate and throw immediately if any embedding has dimension 0
    batchEmbeddings.forEach((emb, batchIdx) => {
      const absoluteIndex = i + batchIdx;
      if (!emb || !Array.isArray(emb) || emb.length === 0) {
        throw new Error(
          `❌ Zero-dimension embedding generated at chunk index ${absoluteIndex}. ` +
          `Problematic text snippet: "${chunks[absoluteIndex]}"`
        );
      }
    });

    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
};