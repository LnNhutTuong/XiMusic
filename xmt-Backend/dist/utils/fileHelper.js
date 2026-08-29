"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const deleteFile = filePath => {
  try {
    if (!filePath) return false;
    const normalizedPath = filePath.startsWith("public/") ? filePath.replace("public/", "") : filePath;
    const fullPath = _path.default.join(process.cwd(), normalizedPath);
    if (_fs.default.existsSync(fullPath)) {
      _fs.default.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.log("Delete file error:", error);
    return false;
  }
};
exports.deleteFile = deleteFile;