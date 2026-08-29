"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.hashPassword = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.createNewUser = void 0;
var _bcryptjs = _interopRequireWildcard(require("bcryptjs"));
var _index = _interopRequireDefault(require("../../../models/index"));
var _sequelize = require("sequelize");
var _artistService = require("../artist/artistService");
var _songService = require("../music/song/songService");
var _albumService = require("../music/album/albumService");
var _jsonwebtoken = require("jsonwebtoken");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const salt = _bcryptjs.default.genSaltSync(10);
const hashPassword = async password => {
  return await _bcryptjs.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const getAllUsers = async (page, limit, group, sort, keySearch) => {
  try {
    let options = {
      offset: (page - 1) * limit,
      limit: limit,
      attributes: ["id", "email", "displayName", "groupId", "createdAt", "updatedAt"],
      include: [{
        model: _index.default.Group,
        as: "group",
        attributes: ["name"]
      }, {
        model: _index.default.ArtistProfile,
        as: "artistProfile",
        attributes: ["verified"]
      }],
      order: [["createdAt", "ASC"]],
      where: {}
    };
    switch (sort) {
      case "newest":
        options.order = [["createdAt", "DESC"]];
        break;
      case "oldest":
        options.order = [["createdAt", "ASC"]];
        break;
      case "name_asc":
        options.order = [["displayName", "ASC"]];
        break;
      case "name_desc":
        options.order = [["displayName", "DESC"]];
        break;
      default:
        options.oder = [["createAt", "DESC"]];
    }
    switch (group) {
      case "listener":
        options.where = {
          groupId: 3
        };
        break;
      case "artist":
        options.where = {
          groupId: 2
        };
        break;
      default:
        options.where.groupId = {
          [_sequelize.Op.ne]: 1
        };
        break;
    }
    if (keySearch) {
      options.include.push({
        model: _index.default.ArtistProfile,
        attributes: ["stageName", "verified"],
        as: "artistProfile"
      });
      options.where = {
        [_sequelize.Op.or]: [{
          displayName: {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }, {
          "$artistProfile.stageName$": {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }]
      };
    }
    let users = await _index.default.User.findAll(options);
    let count = await _index.default.User.count();
    return {
      EM: "Fetch user successfully",
      //error message
      EC: 0,
      //error code
      DT: {
        users,
        count
      } //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      //error message
      EC: -2,
      //error code
      DT: "" //data
    };
  }
};
exports.getAllUsers = getAllUsers;
const checkEmail = async (userEmail, userId = null) => {
  //điều kiện là cái mail
  let whereCondition = {
    email: userEmail
  };

  //nếu có userId thì chạy vào đây
  if (userId) {
    whereCondition.id = {
      // lấy id của cái mail đang tìm
      [_sequelize.Op.ne]: userId //loại trừ cái id này ra
    };
  }
  let user = await _index.default.User.findOne({
    where: whereCondition
  });
  if (user) {
    return true;
  }
  return false;
};
const createNewUser = async rawData => {
  try {
    let userHashPassword = await hashPassword(rawData.password);
    let emailExist = await checkEmail(rawData.email);
    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData
      };
    }
    let newUser = await _index.default.User.create({
      email: rawData.email,
      password: userHashPassword,
      displayName: rawData.displayName,
      groupId: rawData.groupId
    });
    let artist = null;
    if (+rawData.groupId === 2) {
      artist = await _index.default.ArtistProfile.create({
        userId: newUser.id,
        verified: rawData.statusVerify,
        monthlyListeners: 0
      });
    }
    return {
      EM: "Create new user successfully",
      EC: 0,
      DT: {
        information: newUser,
        artist
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: ""
    };
  }
};
exports.createNewUser = createNewUser;
const getUserById = async id => {
  try {
    const user = await _index.default.User.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ["password"]
      }
    });
    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1
      };
    }
    let artistProfile = await (0, _artistService.handleGetArtistWithId)(user.id);
    if (artistProfile) {
      artistProfile = artistProfile.dataValues;
    }
    return {
      EM: "Get user by Id successfully",
      EC: 0,
      DT: {
        information: user,
        artistProfile
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: ""
    };
  }
};
exports.getUserById = getUserById;
const updateUser = async (id, rawData) => {
  try {
    let emailExist = await checkEmail(rawData.email, id);
    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData.email
      };
    }
    let finalGroupId = rawData.groupId;
    if (Number(rawData.statusVerify) === 2) {
      finalGroupId = 3;
    }
    let userAfterUpdate = await _index.default.User.update({
      email: rawData.email,
      displayName: rawData.displayName,
      groupId: finalGroupId
    }, {
      where: {
        id: id
      }
    });
    let artistProfile = await _index.default.ArtistProfile.findOne({
      where: {
        userId: id
      }
    });
    if (artistProfile) {
      await artistProfile.update({
        verified: rawData.statusVerify
      });
    }
    return {
      EM: "Update successfully",
      EC: 0,
      DT: {
        information: userAfterUpdate,
        artist: artistProfile
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: ""
    };
  }
};
exports.updateUser = updateUser;
const deleteUser = async id => {
  try {
    let isArtist = await (0, _artistService.handleGetArtistWithId)(id);
    if (isArtist) {
      let songs = await (0, _songService.songCount)(id);
      let albums = await (0, _albumService.albumCount)(id);
      if (songs > 0 || albums > 0) {
        return {
          EM: "Artist still has some songs and albums.",
          EC: -1,
          DT: {
            songCount: songs,
            albumCount: albums
          }
        };
      } else {
        await _index.default.ArtistProfile.destroy({
          where: {
            userId: id
          }
        });
      }
    }
    await _index.default.UserNotification.destroy({
      where: {
        userId: id
      }
    });
    await _index.default.User.destroy({
      where: {
        id: id
      }
    });
    return {
      EM: "Delete successfully",
      EC: 0,
      DT: ""
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: ""
    };
  }
};
exports.deleteUser = deleteUser;