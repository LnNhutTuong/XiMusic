"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRequest = exports.handleGetArtistWithId = exports.getAllArtistOption = exports.deleteArtistProfile = void 0;
var _index = _interopRequireDefault(require("../../../models/index"));
var _sequelize = require("sequelize");
var _notificationHelper = require("../../../utils/notificationHelper");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const handleGetArtistWithId = async userId => {
  try {
    let artist = await _index.default.ArtistProfile.findOne({
      where: {
        userId
      },
      attributes: {
        exclude: ["id", "userId", "createdAt", "updatedAt"]
      }
    });
    return artist;
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: ""
    };
  }
};
exports.handleGetArtistWithId = handleGetArtistWithId;
const getAllArtistOption = async () => {
  try {
    const artists = await _index.default.User.findAndCountAll({
      where: {
        groupId: 2
      },
      attributes: ["id", [(0, _sequelize.literal)(`COALESCE(\`artistProfile\`.\`stageName\`,
          \`user\`.\`displayName\`)`), "artistName"]],
      order: [["artistName", "ASC"]],
      include: [{
        model: _index.default.ArtistProfile,
        as: "artistProfile",
        where: {
          verified: 1
        },
        attributes: []
      }]
    });
    return {
      EM: "Fetch artists successfully",
      EC: 0,
      DT: artists
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.getAllArtistOption = getAllArtistOption;
const deleteArtistProfile = async userId => {
  try {
    const user = await _index.default.User.findByPk(userId);
    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1
      };
    }
    const artistProfile = await _index.default.ArtistProfile.findOne({
      where: {
        userId
      }
    });
    if (!artistProfile) {
      return {
        EM: "Can't find this artist profile",
        EC: -1
      };
    }
    if (Number(artistProfile.verified) !== 2) {
      return {
        EM: "Can't delete this artist profile because this artist is not approved",
        EC: -1
      };
    }
    await artistProfile.destroy();
    return {
      EM: "Delete artist profile successfully",
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
const updateRequest = async (userId, statusVerify) => {
  try {
    let user = await _index.default.User.findByPk(userId);
    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1
      };
    }
    let artistProfile = await _index.default.ArtistProfile.findOne({
      where: {
        userId
      }
    });
    if (!artistProfile) {
      return {
        EM: "Can't find this artist profile",
        EC: -1
      };
    }
    await artistProfile.update({
      verified: statusVerify
    });
    const isApproved = Number(statusVerify) === 1;
    if (isApproved) {
      await user.update({
        groupId: 2
      });
    }
    await (0, _notificationHelper.sendArtistVerifyNotification)(userId, isApproved);
    return {
      EM: "Edit artist profile & sent notification successfully",
      EC: 0
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.updateRequest = updateRequest;