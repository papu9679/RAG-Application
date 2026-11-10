// Important thing to verify before installing or moving on
// npm install @langchain/community @langchain/classic pdf-parse

// to by pass the strict check
// npm install langchain @langchain/community pdf-parse --legacy-peer-deps

// Refer this 
// https://share.google/aimode/BZwVdFKhhncyzDDCn

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const processPDF = async (filePath) => {
  const loader = new PDFLoader(filePath, {
    splitPages: false,
  });

  const docs = await loader.load();

  return docs[0]?.pageContent?.trim() || "";
};
