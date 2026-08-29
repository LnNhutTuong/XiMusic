"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getArtistProfile = exports.deleteArtistProfile = void 0;
var _models = _interopRequireDefault(require("../../../models"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getArtistProfile = async userId => {
  try {
    let user = await _models.default.User.findByPk(userId);
    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1
      };
    }
    let artistProfile = await _models.default.ArtistProfile.findOne({
      where: {
        userId
      }
    });
    if (!artistProfile) {
      return {
        EM: "Can't find artist profile",
        EC: -1
      };
    }
    return {
      EM: "Get Artist Profile Successfully",
      EC: 0,
      DT: artistProfile
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2
    };
  }
};
exports.getArtistProfile = getArtistProfile;
const deleteArtistProfile = async userId => {
  try {
    let user = await _models.default.User.findByPk(userId);
    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1
      };
    }
    let artistProfile = await _models.default.ArtistProfile.findOne({
      where: {
        userId
      }
    });
    if (!artistProfile) {
      return {
        EM: "Can't find artist profile",
        EC: -1
      };
    }
    await artistProfile.destroy();
    await user.update({
      groupId: 2
    });
    return {
      EM: "Delete Artist Profile Successfully",
      EC: 0
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2
    };
  }
};
exports.deleteArtistProfile = deleteArtistProfile;