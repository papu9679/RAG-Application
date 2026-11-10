import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.index({
  host: process.env.PINECONE_INDEX_HOST,
  namespace: "documents",
});