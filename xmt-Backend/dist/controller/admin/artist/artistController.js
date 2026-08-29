"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateRequest = exports.handleGetAllArtistOption = exports.handleDeleteArtistProfile = void 0;
var _artistService = require("../../../service/admin/artist/artistService");
const handleGetAllArtistOption = async (req, res) => {
  let data = await (0, _artistService.getAllArtistOption)();
  return await res.status(200).json({
    EM: data.EM,
    //error message
    EC: data.EC,
    //error code
    DT: data.DT //data
  });
};
exports.handleGetAllArtistOption = handleGetAllArtistOption;
const handleDeleteArtistProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return await res.status(400).json({
      EM: "Missing userId or statusVerify",
      //error message
      EC: -1 //error code
    });
    let data = await (0, _artistService.deleteArtistProfile)(userId);
    return await res.status(200).json({
      EM: data.EM,
      //error message
      EC: data.EC,
      //error code
      DT: data.DT //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Error from controller..." + error,
      //error message
      EC: -1,
      //error code
      DT: "" //data
    });
  }
};
exports.handleDeleteArtistProfile = handleDeleteArtistProfile;
const handleUpdateRequest = async (req, res) => {
  try {
    const userId = req.params.id;
    const statusVerify = req.body.statusVerify;
    if (!userId || !statusVerify) return await res.status(400).json({
      EM: "Missing userId or statusVerify",
      //error message
      EC: -1 //error code
    });
    let data = await (0, _artistService.updateRequest)(userId, statusVerify);
    return await res.status(200).json({
      EM: data.EM,
      //error message
      EC: data.EC,
      //error code
      DT: data.DT //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Error from server..." + error,
      //error message
      EC: -1,
      //error code
      DT: "" //data
    });
  }
};
exports.handleUpdateRequest = handleUpdateRequest;