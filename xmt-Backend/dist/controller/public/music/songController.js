"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleIncrementPlays = exports.handleGetAllSongsPublic = void 0;
var _songService = require("../../../service/public/music/songService");
const handleGetAllSongsPublic = async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const genreId = req.query.genreId || null;
    const keySearch = req.query.keySearch || "";
    if (!page || !limit) {
      return {
        EM: "Missing required parameters",
        //error message
        EC: 0 //error code
      };
    }
    let data = await (0, _songService.getAllSongsPublic)(page, limit, genreId, keySearch);
    return await res.status(200).json({
      EM: data.EM,
      //error message
      EC: data.EC,
      //error code
      DT: data.DT //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      //error message
      EC: -1,
      //error code
      DT: "" //data
    });
  }
};
exports.handleGetAllSongsPublic = handleGetAllSongsPublic;
const handleIncrementPlays = async (req, res) => {
  try {
    let songId = req.params.id;
    if (!songId) {
      return res.status(400).json({
        EM: "Can't find song ID to increment plays",
        EC: -2
      });
    }
    let data = await (0, _songService.incrementPlays)(songId);
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
exports.handleIncrementPlays = handleIncrementPlays;