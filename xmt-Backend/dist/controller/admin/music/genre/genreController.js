"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateGenre = exports.handleGetGenreWithId = exports.handleGetGenreOption = exports.handleGetAllGenre = exports.handleDeleteGenre = exports.handleCreateNewGenre = void 0;
var _genreService = require("../../../../service/admin/music/genre/genreService");
const handleGetAllGenre = async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const sort = req.query.sort || null;
    const keySearch = req.query.keySearch || "";
    if (!page || !limit) {
      return {
        EM: "Missing required parameters",
        //error message
        EC: 0 //error code
      };
    }
    let data = await (0, _genreService.getAllGenre)(page, limit, sort, keySearch);
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
exports.handleGetAllGenre = handleGetAllGenre;
const handleGetGenreOption = async (req, res) => {
  try {
    let data = await (0, _genreService.getGenreOption)();
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
exports.handleGetGenreOption = handleGetGenreOption;
const handleCreateNewGenre = async (req, res) => {
  try {
    const {
      name,
      description
    } = req.body;
    const iconFile = req.file;
    const iconPath = iconFile ? `uploads/genre/icon/${iconFile.filename}` : null;
    if (!name || !description) {
      return await res.status(400).json({
        EM: "Missing required data",
        //error message
        EC: -1,
        //error code
        DT: req.body //data
      });
    }
    let data = await (0, _genreService.createNewGenre)({
      name,
      description,
      icon: iconPath
    });
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
exports.handleCreateNewGenre = handleCreateNewGenre;
const handleGetGenreWithId = async (req, res) => {
  try {
    const genreId = req.params.id;
    if (!genreId) {
      return await res.status(400).json({
        EM: "Missing required data",
        //error message
        EC: -1,
        //error code
        DT: req.body //data
      });
    }
    let data = await (0, _genreService.getGenreWithId)(genreId);
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
exports.handleGetGenreWithId = handleGetGenreWithId;
const handleUpdateGenre = async (req, res) => {
  try {
    const genreId = req.params.id;
    const {
      name,
      description
    } = req.body;
    const iconFile = req.file;
    let iconPath = null;
    if (iconFile) {
      iconPath = `uploads/genre/icon/${iconFile.filename}`;
    }
    if (!name || !description) {
      return await res.status(400).json({
        EM: "Missing required data",
        //error message
        EC: -1,
        //error code
        DT: req.body //data
      });
    }
    let data = await (0, _genreService.updateGenre)(genreId, {
      name,
      description,
      icon: iconPath,
      hasNewIcon: !!iconFile
    });
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
exports.handleUpdateGenre = handleUpdateGenre;
const handleDeleteGenre = async (req, res) => {
  const genreId = req.params.id;
  let data = await (0, _genreService.deleteGenre)(genreId);
  return await res.status(200).json({
    EM: data.EM,
    //error message
    EC: data.EC,
    //error code
    DT: data.DT //data
  });
};
exports.handleDeleteGenre = handleDeleteGenre;