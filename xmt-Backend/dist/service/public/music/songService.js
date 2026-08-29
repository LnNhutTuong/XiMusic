"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementPlays = exports.getAllSongsPublic = void 0;
var _index = _interopRequireDefault(require("../../../models/index"));
var _sequelize = require("sequelize");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getAllSongsPublic = async (page, limit, genreId, keySearch) => {
  try {
    const options = {
      offset: (page - 1) * limit,
      limit,
      order: [["id", "ASC"]],
      where: {
        status: 1
      },
      include: [{
        model: _index.default.User,
        as: "owner",
        attributes: ["id", [(0, _sequelize.literal)("COALESCE(`owner->artistProfile`.`stageName`, `owner`.`displayName`)"), "artistName"], [(0, _sequelize.literal)("`owner->artistProfile`.`bio`"), "bio"], [(0, _sequelize.literal)("`owner->artistProfile`.`monthlyListeners`"), "monthlyListeners"], "avatar"],
        include: [{
          model: _index.default.ArtistProfile,
          as: "artistProfile",
          attributes: []
        }]
      }, {
        model: _index.default.User,
        as: "features",
        attributes: ["id", [(0, _sequelize.literal)("COALESCE(`features->artistProfile`.`stageName`, `features`.`displayName`)"), "artistName"]],
        through: {
          attributes: []
        },
        include: [{
          model: _index.default.ArtistProfile,
          as: "artistProfile",
          attributes: []
        }]
      }]
    };
    if (genreId) {
      options.include.push({
        model: _index.default.Genre,
        as: "genres",
        attributes: ["id", "name"],
        through: {
          attributes: []
        },
        required: true
      });
    }
    if (keySearch) {
      options.include.push({
        model: _index.default.User,
        as: "owner",
        attributes: ["id", "displayName"],
        required: true,
        include: [{
          model: _index.default.ArtistProfile,
          as: "artistProfile",
          attributes: ["stageName"]
        }]
      });
      options.where = {
        [_sequelize.Op.or]: [{
          title: {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }, {
          "$owner.displayName$": {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }, {
          "$owner.artistProfile.stageName$": {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }]
      };
    }
    const songs = await _index.default.Song.findAndCountAll(options);
    return {
      EM: "Get all songs Successfully",
      EC: 0,
      DT: songs
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.getAllSongsPublic = getAllSongsPublic;
const incrementPlays = async songId => {
  try {
    let song = await _index.default.Song.findByPk(songId, {
      include: [{
        model: _index.default.User,
        as: "owner",
        include: [{
          model: _index.default.ArtistProfile,
          as: "artistProfile"
        }]
      }, {
        model: _index.default.User,
        as: "features",
        through: {
          attributes: []
        },
        include: [{
          model: _index.default.ArtistProfile,
          as: "artistProfile"
        }]
      }]
    });
    if (!song) {
      return {
        EM: "Can't find this song increment Plays",
        EC: -1
      };
    }
    await song.increment("plays");
    if (song.owner?.artistProfile) {
      await song.owner.artistProfile.increment("monthlyListeners");
    }
    for (const artist of song.features) {
      if (artist.artistProfile) {
        await artist.artistProfile.increment("monthlyListeners");
      }
    }
    return {
      EM: "increment Plays Song and Artist Monthly Listener Successfully",
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
exports.incrementPlays = incrementPlays;