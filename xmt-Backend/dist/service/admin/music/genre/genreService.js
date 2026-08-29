"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGenre = exports.getGenreWithId = exports.getGenreOption = exports.getAllGenre = exports.deleteGenre = exports.createNewGenre = void 0;
var _sequelize = require("sequelize");
var _index = _interopRequireDefault(require("../../../../models/index"));
var _fileHelper = require("../../../../utils/fileHelper");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getAllGenre = async (page, limit, sort, keySearch) => {
  try {
    const options = {
      offset: (page - 1) * limit,
      limit,
      subQuery: false,
      order: [["createdAt", "DESC"]],
      where: {},
      include: [{
        model: _index.default.SongGenre,
        as: "songGenres",
        attributes: [],
        required: false
      }],
      attributes: {
        include: [[(0, _sequelize.fn)("COUNT", (0, _sequelize.col)("songGenres.songId")), "songCount"]]
      },
      group: ["Genre.id"]
    };
    switch (sort) {
      case "newest":
        options.order = [["createdAt", "DESC"]];
        break;
      case "oldest":
        options.order = [["createdAt", "ASC"]];
        break;
      case "name_asc":
        options.order = [["name", "ASC"]];
        break;
      case "name_desc":
        options.order = [["name", "DESC"]];
        break;
      case "song_desc":
        options.order = [[(0, _sequelize.literal)("songCount"), "DESC"]];
        break;
      case "song_asc":
        options.order = [[(0, _sequelize.literal)("songCount"), "ASC"]];
        break;
      default:
        options.oder = [["createAt", "DESC"]];
    }
    if (keySearch) {
      options.where = {
        name: {
          [Op.like]: `%${keySearch}%`
        }
      };
    }
    const genres = await _index.default.Genre.findAll({
      ...options,
      logging: console.log
    });
    const count = await _index.default.Genre.count();
    return {
      EM: "Get all genres Successfully",
      EC: 0,
      DT: {
        genres,
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
exports.getAllGenre = getAllGenre;
const getGenreOption = async () => {
  let genres = await _index.default.Genre.findAndCountAll({
    attributes: ["id", "name"],
    order: [["name", "ASC"]]
  });
  return {
    EM: "Get Genre Option Successfully",
    //error message
    EC: 0,
    //error code
    DT: genres //data
  };
};
exports.getGenreOption = getGenreOption;
const createNewGenre = async rawData => {
  try {
    let newGenre = await _index.default.Genre.create({
      name: rawData.name,
      description: rawData.description,
      icon: rawData.icon
    });
    return {
      EM: "Create new Genre Successfully",
      //error message
      EC: 0,
      //error code
      DT: rawData //data
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
exports.createNewGenre = createNewGenre;
const getGenreWithId = async id => {
  try {
    let genreWithID = await _index.default.Genre.findOne({
      where: {
        id
      }
    });
    return {
      EM: "Get Genre with Id Successfully",
      //error message
      EC: 0,
      //error code
      DT: genreWithID //data
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
exports.getGenreWithId = getGenreWithId;
const updateGenre = async (id, rawData) => {
  const genre = await _index.default.Genre.findOne({
    where: {
      id
    }
  });
  if (!genre) {
    return {
      EC: -1,
      EM: "Genre not found"
    };
  }
  if (rawData.hasNewIcon && genre.icon) {
    (0, _fileHelper.deleteFile)(genre.icon);
  }
  const nextIcon = rawData.hasNewIcon ? rawData.icon : genre.icon;
  await genre.update({
    name: rawData.name,
    description: rawData.description,
    icon: nextIcon
  });
  return {
    EC: 0,
    EM: "Update genre successfully"
  };
};
exports.updateGenre = updateGenre;
const hasSongInGenre = async genreId => {
  const songUsed = await _index.default.SongGenre.findOne({
    where: {
      genreId
    }
  });
  return songUsed;
};
const deleteGenre = async genreId => {
  try {
    const isUsed = await hasSongInGenre(genreId);
    if (isUsed) {
      return {
        EM: "Cannot delete Genre because it contains songs",
        EC: -1,
        DT: isUsed
      };
    }
    const genre = await _index.default.Genre.findOne({
      where: {
        id: genreId
      }
    });
    if (genre.icon) {
      (0, _fileHelper.deleteFile)(genre.icon);
    }
    await _index.default.Genre.destroy({
      where: {
        id: genreId
      }
    });
    return {
      EM: "Delete Genre Successfully",
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
exports.deleteGenre = deleteGenre;