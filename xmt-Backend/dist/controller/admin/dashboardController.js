"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGetAllTotal = void 0;
var _dashboardService = require("../../service/admin/dashboardService");
const handleGetAllTotal = async (req, res) => {
  try {
    let data = await (0, _dashboardService.getAllTotal)();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: ""
    });
  }
};
exports.handleGetAllTotal = handleGetAllTotal;