"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAlbum = exports.getListAlbum = exports.getAlbumWithId = exports.getAlbumOptionWithIdOrNot = exports.deleteAlbum = exports.createNewAlbum = exports.albumCount = void 0;
var _index = _interopRequireDefault(require("../../../../models/index"));
var _sequelize = require("sequelize");
var _fileHelper = require("../../../../utils/fileHelper");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const albumCount = async ownerId => {
  const album = await _index.default.Album.count({
    where: {
      ownerId: ownerId
    }
  });
  return album;
};
exports.albumCount = albumCount;
const getAlbumOptionWithIdOrNot = async ownerId => {
  let albums;
  let EM;
  if (ownerId === null) {
    albums = await _index.default.Album.findAndCountAll();
    EM = "Get Album Option Successfully";
  } else {
    albums = await _index.default.Album.findAndCountAll({
      where: {
        ownerId
      },
      attributes: ["id", "title"],
      order: [["title", "ASC"]]
    });
    if (albums.count === 0) {
      EM = "This artist doesn't have any album";
    } else {
      EM = "Get Album Option With ID Successfully";
    }
  }
  return {
    EM: EM,
    //error message
    EC: 0,
    //error code
    DT: albums //data
  };
};
exports.getAlbumOptionWithIdOrNot = getAlbumOptionWithIdOrNot;
const getListAlbum = async (sort, keySearch) => {
  try {
    let options = {
      include: [{
        model: _index.default.User,
        as: "artist",
        attributes: [],
        order: [["createdAt", "DESC"]],
        include: [{
          model: _index.default.ArtistProfile,
          as: "artistProfile",
          attributes: []
        }]
      }, {
        model: _index.default.Song,
        as: "songs"
      }],
      attributes: {
        include: [[(0, _sequelize.literal)(`COALESCE(\`artist->artistProfile\`.\`stageName\`,
          \`artist\`.\`displayName\`)`), "artistName"], [(0, _sequelize.fn)("COUNT", (0, _sequelize.col)("songs.Id")), "songCount"]]
      },
      group: ["Album.id"],
      where: {}
    };
    switch (sort) {
      case "newest":
        options.order = [["createdAt", "DESC"]];
        break;
      case "oldest":
        options.order = [["createdAt", "ASC"]];
        break;
      case "title_asc":
        options.order = [["title", "ASC"]];
        break;
      case "title_desc":
        options.order = [["title", "DESC"]];
        break;
      case "song_desc":
        options.order = [[(0, _sequelize.literal)("songCount"), "DESC"]];
        break;
      case "song_asc":
        options.order = [[(0, _sequelize.literal)("songCount"), "ASC"]];
        break;
      case "releaseDate_asc":
        options.order = [["releaseDate", "ASC"]];
        break;
      case "releaseDate_desc":
        options.order = [["releaseDate", "DESC"]];
        break;
      default:
        options.oder = [["createAt", "DESC"]];
    }
    if (keySearch) {
      options.where = {
        [_sequelize.Op.or]: [{
          title: {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }, {
          "$artist.displayName$": {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }, {
          "$artist.artistProfile.stageName$": {
            [_sequelize.Op.like]: `%${keySearch}%`
          }
        }]
      };
    }
    let albums = await _index.default.Album.findAll(options);
    let count = await _index.default.Album.count();
    return {
      EM: "get list Album Successfully",
      EC: 0,
      DT: {
        albums,
        count
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.getListAlbum = getListAlbum;
const getAlbumWithId = async albumId => {
  try {
    let album = await _index.default.Album.findOne({
      where: {
        id: albumId
      },
      include: {
        model: _index.default.Song,
        as: "songs",
        attributes: ["id", "title"]
      }
    });
    return {
      EM: "Get Album with ID Successfully",
      EC: 0,
      DT: album
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.getAlbumWithId = getAlbumWithId;
const createNewAlbum = async rawData => {
  try {
    let newAlbum;
    let songBelongsTo;
    newAlbum = await _index.default.Album.create({
      title: rawData.title.trim(),
      cover: rawData.cover,
      ownerId: rawData.ownerId,
      releaseDate: rawData.releaseDate || null
    });
    if (rawData.songId) {
      await _index.default.Song.update({
        albumId: newAlbum.id
      }, {
        where: {
          id: rawData.songId
        }
      });
    }
    return {
      EM: "Successfully",
      EC: 0,
      DT: {
        "New Album": newAlbum,
        "Song belongs": songBelongsTo
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.createNewAlbum = createNewAlbum;
const updateAlbum = async (albumId, rawData) => {
  try {
    let albumUpdate = await _index.default.Album.findOne({
      where: {
        id: albumId
      }
    });
    if (!albumUpdate) {
      return {
        EM: "Can't find this album in db to update",
        EC: -1
      };
    }
    if (rawData.hasNewCover && albumUpdate.cover) {
      (0, _fileHelper.deleteFile)(albumUpdate.cover);
    }
    const nextCover = rawData.hasNewCover ? rawData.cover : albumUpdate.cover;
    await albumUpdate.update({
      title: rawData.title.trim(),
      cover: nextCover,
      ownerId: rawData.ownerId,
      releaseDate: new Date(rawData.releaseDate) || null
    });
    if (rawData.songId) {
      await _index.default.Song.update({
        albumId: updateAlbum.id
      }, {
        where: {
          id: rawData.songId
        }
      });
    }
    let albumAfterUpdate = await _index.default.Album.findByPk(albumId);
    return {
      EM: "Update Album Successfully",
      EC: 0,
      DT: albumAfterUpdate
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: []
    };
  }
};
exports.updateAlbum = updateAlbum;
const deleteAlbum = async albumId => {
  try {
    const albumDelete = await _index.default.Album.findOne({
      where: {
        id: albumId
      }
    });
    if (!albumDelete) {
      return {
        EM: "Can't find this album in db to delete",
        EC: -1,
        DT: []
      };
    }
    if (albumDelete.cover) {
      (0, _fileHelper.deleteFile)(albumDelete.cover);
    }
    await _index.default.Song.update({
      albumId: null
    }, {
      where: {
        albumId
      }
    });
    await albumDelete.destroy();
    return {
      EM: "Delete Album Successfully",
      EC: 0
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: []
    };
  }
};
exports.deleteAlbum = deleteAlbum;