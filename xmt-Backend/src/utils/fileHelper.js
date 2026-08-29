import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
  try {
    if (!filePath) return false;

    const normalizedPath = filePath.startsWith("public/")
      ? filePath.replace("public/", "")
      : filePath;

    const fullPath = path.join(process.cwd(), normalizedPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }

    return false;
  } catch (error) {
    console.log("Delete file error:", error);
    return false;
  }
};
