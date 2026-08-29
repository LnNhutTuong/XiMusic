"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSong = exports.songCount = exports.getSongWithId = exports.getSongOptionWithIdOrNot = exports.getAllSongs = exports.deleteSong = exports.createNewSong = void 0;
var _index = _interopRequireDefault(require("../../../../models/index"));
var _sequelize = require("sequelize");
var _fileHelper = require("../../../../utils/fileHelper");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const songCount = async ownerId => {
  let song = await _index.default.Song.count({
    where: {
      ownerId: ownerId
    }
  });
  return song;
};
exports.songCount = songCount;
const getAllSongs = async (page, limit, genreId, keySearch) => {
  try {
    const options = {
      offset: (page - 1) * limit,
      limit,
      order: [["id", "ASC"]],
      where: {},
      include: [{
        model: _index.default.User,
        as: "owner",
        attributes: ["id", [(0, _sequelize.literal)("COALESCE(`owner->artistProfile`.`stageName`, `owner`.`displayName`)"), "artistName"]],
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
exports.getAllSongs = getAllSongs;
const getSongOptionWithIdOrNot = async ownerId => {
  try {
    let songs;
    let EM;
    if (!ownerId) {
      songs = await _index.default.Song.findAndCountAll({
        attributes: ["id", "title"],
        order: [["title", "ASC"]]
      });
      EM = "Get Song Option Successfully";
    } else {
      songs = await _index.default.Song.findAndCountAll({
        where: {
          ownerId
        },
        attributes: ["id", "title"],
        order: [["title", "ASC"]]
      });
      EM = "Get Song Option With ID Successfully";
    }
    return {
      EM: EM,
      //error message
      EC: 0,
      //error code
      DT: songs //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.getSongOptionWithIdOrNot = getSongOptionWithIdOrNot;
const createNewSong = async rawData => {
  try {
    let newSong;
    let songGenre;
    let features;
    newSong = await _index.default.Song.create({
      title: rawData.title,
      audioUrl: rawData.audioUrl,
      cover: rawData.cover,
      duration: rawData.duration,
      lyrics: rawData.lyrics,
      status: rawData.status,
      ownerId: rawData.ownerId,
      albumId: rawData.albumId || null
    });
    await newSong.setGenres(rawData.genreId || []);
    await newSong.setFeatures(rawData.featureId || []);
    return {
      EM: "Create new Song Successfully",
      //error message
      EC: 0,
      //error code
      DT: {
        Genre: songGenre,
        Song: newSong,
        feature: features
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
exports.createNewSong = createNewSong;
const getSongWithId = async songId => {
  try {
    //song info
    let song = await _index.default.Song.findOne({
      where: {
        id: songId
      },
      include: [{
        model: _index.default.Genre,
        as: "genres",
        attributes: ["id", "name"],
        through: {
          attributes: []
        }
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
    });
    return {
      EM: "Get Song with Id Successfully",
      EC: 0,
      DT: song
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
exports.getSongWithId = getSongWithId;
const updateSong = async (id, rawData) => {
  const song = await _index.default.Song.findOne({
    where: {
      id: id
    }
  });
  if (!song) {
    return {
      EC: -1,
      EM: "Song not found"
    };
  }
  if (rawData.hasNewCover && song.cover) {
    (0, _fileHelper.deleteFile)(song.cover);
  }
  if (rawData.hasNewAudioUrl && song.audioUrl) {
    (0, _fileHelper.deleteFile)(song.audioUrl);
  }
  const nextCover = rawData.hasNewCover ? rawData.cover : song.cover;
  const nextAudioUrl = rawData.hasNewAudioUrl ? rawData.audioUrl : song.audioUrl;
  await song.update({
    title: rawData.title,
    audioUrl: nextAudioUrl,
    cover: nextCover,
    duration: rawData.duration,
    lyrics: rawData.lyrics,
    status: rawData.status,
    ownerId: rawData.ownerId,
    albumId: rawData.albumId || null
  });
  await song.setGenres(rawData.genreId || []);
  await song.setFeatures(rawData.featureId || []);
  return {
    EC: 0,
    EM: "Update song successfully"
  };
};
exports.updateSong = updateSong;
const deleteSong = async songId => {
  try {
    const song = await _index.default.Song.findOne({
      where: {
        id: songId
      }
    });
    if (!song) {
      return {
        EM: "Can not find this song",
        EC: -2
      };
    }
    if (song.cover) {
      (0, _fileHelper.deleteFile)(song.cover);
    }
    if (song.audioUrl) {
      (0, _fileHelper.deleteFile)(song.audioUrl);
    }
    await song.setGenres([]);
    await song.setFeatures([]);
    await song.destroy({
      where: {
        id: songId
      }
    });
    return {
      EM: "Delete Song Successfully",
      EC: 0
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: ""
    };
  }
};
exports.deleteSong = deleteSong;