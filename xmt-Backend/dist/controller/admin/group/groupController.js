"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllGroup = void 0;
var _groupService = require("../../../service/admin/group/groupService");
const getAllGroup = async (req, res) => {
  try {
    let data = await (0, _groupService.handleGetAllGroup)();
    return await res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server" + error,
      //error message
      EC: -1,
      //error code
      DT: "" //data
    });
  }
};
exports.getAllGroup = getAllGroup;