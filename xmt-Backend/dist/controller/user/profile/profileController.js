"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateProfile = exports.handleRequestArtistProfile = exports.handleGetProfile = exports.handleEditRequestArtistProfile = exports.handleCancelRequestArtistProfile = void 0;
var _console = _interopRequireDefault(require("console"));
var _profileService = require("../../../service/user/profile/profileService");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const handleGetProfile = async (req, res) => {
  try {
    let {
      email
    } = req.query;
    if (!email) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1
      });
    }
    let data = await (0, _profileService.getProfile)(email);
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
exports.handleGetProfile = handleGetProfile;
const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      displayName
    } = req.body;
    const avatarFile = req.file;
    let avatarPath = null;
    if (avatarFile) {
      avatarPath = `uploads/user/avatar/${avatarFile.filename}`;
    }
    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1
      });
    }
    if (!displayName && !avatarPath) {
      return res.status(400).json({
        EM: "At least one of displayName or avatarPath must be provided",
        EC: -1
      });
    }
    const data = await (0, _profileService.updateProfile)(userId, {
      displayName,
      avatar: avatarPath,
      hasNewAvatar: !!avatarFile
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
exports.handleUpdateProfile = handleUpdateProfile;
const handleRequestArtistProfile = async (req, res) => {
  try {
    const {
      userId,
      stageName,
      bio
    } = req.body;
    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1
      });
    }
    let data = await (0, _profileService.requestArtistProfile)(userId, stageName, bio);
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
exports.handleRequestArtistProfile = handleRequestArtistProfile;
const handleCancelRequestArtistProfile = async (req, res) => {
  try {
    let {
      userId
    } = req.body;
    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1
      });
    }
    let data = await (0, _profileService.cancelRequestArtistProfile)(userId);
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
exports.handleCancelRequestArtistProfile = handleCancelRequestArtistProfile;
const handleEditRequestArtistProfile = async (req, res) => {
  try {
    const {
      userId,
      stageName,
      bio
    } = req.body;
    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1
      });
    }
    let data = await (0, _profileService.editRequestArtistProfile)(userId, stageName, bio);
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
exports.handleEditRequestArtistProfile = handleEditRequestArtistProfile;