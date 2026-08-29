"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllTotal = void 0;
var _index = _interopRequireDefault(require("../../models/index"));
var _sequelize = require("sequelize");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getAllTotal = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    //user
    let totalUser = await _index.default.User.count();
    let newUserInThisMonth = await _index.default.User.count({
      where: {
        createdAt: {
          [_sequelize.Op.gte]: startOfMonth
        }
      }
    });

    //artist
    let totalArtist = await _index.default.User.count({
      where: {
        groupId: 2
      },
      include: {
        model: _index.default.ArtistProfile,
        as: "artistProfile",
        where: {
          verified: 1
        }
      }
    });
    let newArtistInThisMonth = await _index.default.User.count({
      where: [{
        groupId: 2
      }, {
        createdAt: {
          [_sequelize.Op.gte]: startOfMonth
        }
      }],
      include: {
        model: _index.default.ArtistProfile,
        as: "artistProfile",
        where: {
          verified: 1
        }
      }
    });

    //listener
    let totalListener = await _index.default.User.count({
      where: {
        groupId: 3
      }
    });
    let newListenerInThisMonth = await _index.default.User.count({
      where: [{
        groupId: 3
      }, {
        createdAt: {
          [_sequelize.Op.gte]: startOfMonth
        }
      }]
    });

    //Song
    let totalSong = await _index.default.Song.count();
    let newSongsThisMonth = await _index.default.Song.count({
      where: {
        createdAt: {
          [_sequelize.Op.gte]: startOfMonth
        }
      }
    });

    //album
    let totalAlbum = await _index.default.Album.count();
    let newAlbumInThisMonth = await _index.default.Album.count({
      where: {
        createdAt: {
          [_sequelize.Op.gte]: startOfMonth
        }
      }
    });

    //genre
    let totalGenre = await _index.default.Genre.count();

    //charts
    const songChart = await _index.default.Song.findAll({
      attributes: [[(0, _sequelize.fn)("MONTH", (0, _sequelize.col)("createdAt")), "month"], [(0, _sequelize.fn)("COUNT", (0, _sequelize.col)("id")), "songs"]],
      group: [(0, _sequelize.fn)("MONTH", (0, _sequelize.col)("createdAt"))],
      order: [[(0, _sequelize.fn)("MONTH", (0, _sequelize.col)("createdAt")), "ASC"]]
    });
    return {
      EM: "get total for Dashboard Successfully",
      EC: 0,
      DT: {
        statics: {
          users: {
            total: totalUser,
            newThisMonth: newUserInThisMonth
          },
          listeners: {
            total: totalListener,
            newThisMonth: newListenerInThisMonth
          },
          artists: {
            total: totalArtist,
            newThisMonth: newArtistInThisMonth
          },
          genres: {
            total: totalGenre
          },
          albums: {
            total: totalAlbum,
            newThisMonth: newAlbumInThisMonth
          },
          songs: {
            total: totalSong,
            newThisMonth: newSongsThisMonth
          }
        },
        songChart
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2
    };
  }
};
exports.getAllTotal = getAllTotal;