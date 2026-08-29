"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGetAllGroup = void 0;
var _index = _interopRequireDefault(require("../../../models/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const handleGetAllGroup = async (res, req) => {
  let groups = [];
  try {
    groups = await _index.default.Group.findAll();
    return {
      EM: "Get all group successfully",
      //error message
      EC: 0,
      //error code
      DT: groups //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      //error message
      EC: -2,
      //error code
      DT: "" //data
    };
  }
};
exports.handleGetAllGroup = handleGetAllGroup;