import { where, fn, col, literal } from "sequelize";
import db from "../../../../models/index";
import { deleteFile } from "../../../../utils/fileHelper";

const getAllGenre = async (page, limit, sort, keySearch) => {
  try {
    const options = {
      offset: (page - 1) * limit,
      limit,
      subQuery: false,
      order: [["createdAt", "DESC"]],
      where: {},
      include: [
        {
          model: db.SongGenre,
          as: "songGenres",
          attributes: [],
          required: false,
        },
      ],
      attributes: {
        include: [[fn("COUNT", col("songGenres.songId")), "songCount"]],
      },
      group: ["Genre.id"],
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
        options.order = [[literal("songCount"), "DESC"]];
        break;

      case "song_asc":
        options.order = [[literal("songCount"), "ASC"]];
        break;

      default:
        options.oder = [["createAt", "DESC"]];
    }
    if (keySearch) {
      options.where = {
        name: {
          [Op.like]: `%${keySearch}%`,
        },
      };
    }

    const genres = await db.Genre.findAll({
      ...options,
      logging: console.log,
    });
    const count = await db.Genre.count();

    return {
      EM: "Get all genres Successfully",
      EC: 0,
      DT: { genres, count },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const getGenreOption = async () => {
  let genres = await db.Genre.findAndCountAll({
    attributes: ["id", "name"],
    order: [["name", "ASC"]],
  });
  return {
    EM: "Get Genre Option Successfully", //error message
    EC: 0, //error code
    DT: genres, //data
  };
};

const createNewGenre = async (rawData) => {
  try {
    let newGenre = await db.Genre.create({
      name: rawData.name,
      description: rawData.description,
      icon: rawData.icon,
    });

    return {
      EM: "Create new Genre Successfully", //error message
      EC: 0, //error code
      DT: rawData, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const getGenreWithId = async (id) => {
  try {
    let genreWithID = await db.Genre.findOne({
      where: { id },
    });

    return {
      EM: "Get Genre with Id Successfully", //error message
      EC: 0, //error code
      DT: genreWithID, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const updateGenre = async (id, rawData) => {
  const genre = await db.Genre.findOne({
    where: {
      id,
    },
  });

  if (!genre) {
    return {
      EC: -1,
      EM: "Genre not found",
    };
  }

  if (rawData.hasNewIcon && genre.icon) {
    deleteFile(genre.icon);
  }

  const nextIcon = rawData.hasNewIcon ? rawData.icon : genre.icon;

  await genre.update({
    name: rawData.name,
    description: rawData.description,
    icon: nextIcon,
  });

  return {
    EC: 0,
    EM: "Update genre successfully",
  };
};

const hasSongInGenre = async (genreId) => {
  const songUsed = await db.SongGenre.findOne({
    where: { genreId },
  });

  return songUsed;
};

const deleteGenre = async (genreId) => {
  try {
    const isUsed = await hasSongInGenre(genreId);

    if (isUsed) {
      return {
        EM: "Cannot delete Genre because it contains songs",
        EC: -1,
        DT: isUsed,
      };
    }

    const genre = await db.Genre.findOne({
      where: { id: genreId },
    });

    if (genre.icon) {
      deleteFile(genre.icon);
    }

    await db.Genre.destroy({
      where: { id: genreId },
    });

    return {
      EM: "Delete Genre Successfully",
      EC: 0,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};

export {
  getAllGenre,
  getGenreOption,
  createNewGenre,
  getGenreWithId,
  updateGenre,
  deleteGenre,
};
