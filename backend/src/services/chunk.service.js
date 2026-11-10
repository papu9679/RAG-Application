// 1.
// npm install @langchain/textsplitters @langchain/core

// 2.
// npm install @langchain/textsplitters @langchain/core --legacy-peer-deps

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const chunkText = async (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitText(text);

  return chunks;
};