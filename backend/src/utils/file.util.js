import { unlink } from "node:fs/promises";

export const deleteFile = async (filePath) => {
  if (!filePath) return;

  try {
    await unlink(filePath);
  }
  catch (error) {
    console.error("File cleanup failed:", error);
  }
};