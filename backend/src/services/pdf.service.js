import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const processPDF = async (filePath) => {
  const loader = new PDFLoader(filePath, {
    splitPages: false,
  });

  const docs = await loader.load();

  return docs.map((doc) => doc.pageContent).join("\n\n").trim();
};
