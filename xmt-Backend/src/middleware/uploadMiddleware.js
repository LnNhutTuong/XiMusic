import multer from "multer";
import path from "path";
import fs from "fs";

const createUploadMiddleware = (folderPath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // folderPath truyền vào có thể là 'genre' hoặc 'song/thumb'
      const dir = path.join("uploads", folderPath, file.fieldname);

      // fs.mkdirSync với { recursive: true } sẽ tự động tạo toàn bộ các thư mục con
      // Ví dụ: tự tạo 'uploads', sau đó tạo 'song', rồi tạo 'thumb' nếu chúng chưa tồn tại
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);

      const title = req.body.title
        ? req.body.title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\p{L}\p{N}-]/gu, "")
        : file.fieldname;

      cb(null, `${title}-${Date.now()}${ext}`);
    },
  });

  return multer({ storage: storage });
};

export default createUploadMiddleware;
