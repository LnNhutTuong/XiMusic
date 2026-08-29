"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGetArtistProfile = void 0;
var _artistService = require("../../../service/user/artist/artistService");
const handleGetArtistProfile = async (req, res) => {
  try {
    let userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        EM: "Missing userId",
        EC: -1,
        DT: ""
      });
    }
    let data = await (0, _artistService.getArtistProfile)(userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from controller..." + error,
      EC: -1,
      DT: error
    });
  }
};
exports.handleGetArtistProfile = handleGetArtistProfile;