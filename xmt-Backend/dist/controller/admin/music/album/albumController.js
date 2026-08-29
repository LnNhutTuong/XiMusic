"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateAlbum = exports.handleGetListAlbums = exports.handleGetAlbumWithId = exports.handleDeleteAlbum = exports.handleCreateNewAlbum = exports.handleAlbumOptionWithIdOrNot = void 0;
var _albumService = require("../../../../service/admin/music/album/albumService");
const handleAlbumOptionWithIdOrNot = async (req, res) => {
  try {
    let id = req.query.id || null;
    let data = await (0, _albumService.getAlbumOptionWithIdOrNot)(id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -1,
      DT: ""
    });
  }
};
exports.handleAlbumOptionWithIdOrNot = handleAlbumOptionWithIdOrNot;
const handleGetListAlbums = async (req, res) => {
  try {
    const sort = req.query.sort || "";
    const keySearch = req.query.keySearch || null;
    let data = await (0, _albumService.getListAlbum)(sort, keySearch);
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
exports.handleGetListAlbums = handleGetListAlbums;
const handleGetAlbumWithId = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.status(400).json({
        EM: "Missing required data...",
        EC: -1,
        DT: req.query
      });
    }
    let data = await (0, _albumService.getAlbumWithId)(id);
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
exports.handleGetAlbumWithId = handleGetAlbumWithId;
const handleCreateNewAlbum = async (req, res) => {
  try {
    const {
      title,
      cover,
      ownerId,
      songId,
      releaseDate
    } = req.body;
    if (!title || !ownerId || releaseDate && !songId) {
      return res.status(400).json({
        EM: "Missing required parameters controller",
        //error message
        EC: 0,
        //error code
        DT: req.body
      });
    }
    const coverFile = req.file;
    const coverPath = coverFile ? `uploads/album/cover/${coverFile.filename}` : null;
    let data = await (0, _albumService.createNewAlbum)({
      title,
      cover: coverPath,
      ownerId,
      songId,
      releaseDate
    });
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2
    });
  }
};
exports.handleCreateNewAlbum = handleCreateNewAlbum;
const handleUpdateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const {
      title,
      cover,
      ownerId,
      songId,
      releaseDate
    } = req.body;
    let coverFile = null;
    let coverPath = null;
    if (req.file) {
      coverFile = req.file;
    }
    if (coverFile) {
      coverPath = `uploads/album/cover/${coverFile.filename}`;
    }
    if (!title || !ownerId || releaseDate && !songId) {
      return res.status(400).json({
        EM: "Missing required parameters controller",
        //error message
        EC: 0,
        //error code
        DT: req.body
      });
    }
    let data = await (0, _albumService.updateAlbum)(albumId, {
      title,
      hasNewCover: !!coverFile,
      cover: coverPath,
      ownerId,
      songId,
      releaseDate
    });
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
exports.handleUpdateAlbum = handleUpdateAlbum;
const handleDeleteAlbum = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await (0, _albumService.deleteAlbum)(id);
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
exports.handleDeleteAlbum = handleDeleteAlbum;