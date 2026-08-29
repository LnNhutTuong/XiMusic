"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const createUploadMiddleware = folderPath => {
  const storage = _multer.default.diskStorage({
    destination: (req, file, cb) => {
      // folderPath truyền vào có thể là 'genre' hoặc 'song/thumb'
      const dir = _path.default.join("uploads", folderPath, file.fieldname);

      // fs.mkdirSync với { recursive: true } sẽ tự động tạo toàn bộ các thư mục con
      // Ví dụ: tự tạo 'uploads', sau đó tạo 'song', rồi tạo 'thumb' nếu chúng chưa tồn tại
      if (!_fs.default.existsSync(dir)) {
        _fs.default.mkdirSync(dir, {
          recursive: true
        });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = _path.default.extname(file.originalname);
      const title = req.body.title ? req.body.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "") : file.fieldname;
      cb(null, `${title}-${Date.now()}${ext}`);
    }
  });
  return (0, _multer.default)({
    storage: storage
  });
};
var _default = exports.default = createUploadMiddleware;