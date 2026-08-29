import db from "../../../../models/index";
import { Op, where, findOrCreate, literal } from "sequelize";
import { deleteFile } from "../../../../utils/fileHelper";

const songCount = async (ownerId) => {
  let song = await db.Song.count({
    where: {
      ownerId: ownerId,
    },
  });
  return song;
};

const getAllSongs = async (page, limit, genreId, keySearch) => {
  try {
    const options = {
      offset: (page - 1) * limit,
      limit,
      order: [["id", "ASC"]],
      where: {},
      include: [
        {
          model: db.User,
          as: "owner",
          attributes: [
            "id",
            [
              literal(
                "COALESCE(`owner->artistProfile`.`stageName`, `owner`.`displayName`)",
              ),
              "artistName",
            ],
          ],
          include: [
            {
              model: db.ArtistProfile,
              as: "artistProfile",
              attributes: [],
            },
          ],
        },
      ],
    };

    if (genreId) {
      options.include.push({
        model: db.Genre,
        as: "genres",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
        required: true,
      });
    }

    if (keySearch) {
      options.include.push({
        model: db.User,
        as: "owner",
        attributes: ["id", "displayName"],
        required: true,
        include: [
          {
            model: db.ArtistProfile,
            as: "artistProfile",
            attributes: ["stageName"],
          },
        ],
      });
      options.where = {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${keySearch}%`,
            },
          },
          {
            "$owner.displayName$": {
              [Op.like]: `%${keySearch}%`,
            },
          },
          {
            "$owner.artistProfile.stageName$": {
              [Op.like]: `%${keySearch}%`,
            },
          },
        ],
      };
    }

    const songs = await db.Song.findAndCountAll(options);

    return {
      EM: "Get all songs Successfully",
      EC: 0,
      DT: songs,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const getSongOptionWithIdOrNot = async (ownerId) => {
  try {
    let songs;
    let EM;
    if (!ownerId) {
      songs = await db.Song.findAndCountAll({
        attributes: ["id", "title"],
        order: [["title", "ASC"]],
      });
      EM = "Get Song Option Successfully";
    } else {
      songs = await db.Song.findAndCountAll({
        where: { ownerId },
        attributes: ["id", "title"],
        order: [["title", "ASC"]],
      });
      EM = "Get Song Option With ID Successfully";
    }

    return {
      EM: EM, //error message
      EC: 0, //error code
      DT: songs, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const createNewSong = async (rawData) => {
  try {
    let newSong;
    let songGenre;
    let features;

    newSong = await db.Song.create({
      title: rawData.title,
      audioUrl: rawData.audioUrl,
      cover: rawData.cover,
      duration: rawData.duration,
      lyrics: rawData.lyrics,
      status: rawData.status,
      ownerId: rawData.ownerId,
      albumId: rawData.albumId || null,
    });

    await newSong.setGenres(rawData.genreId || []);

    await newSong.setFeatures(rawData.featureId || []);

    return {
      EM: "Create new Song Successfully", //error message
      EC: 0, //error code
      DT: { Genre: songGenre, Song: newSong, feature: features }, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const getSongWithId = async (songId) => {
  try {
    //song info
    let song = await db.Song.findOne({
      where: { id: songId },
      include: [
        {
          model: db.Genre,
          as: "genres",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
        {
          model: db.User,
          as: "features",
          attributes: [
            "id",
            [
              literal(
                "COALESCE(`features->artistProfile`.`stageName`, `features`.`displayName`)",
              ),
              "artistName",
            ],
          ],
          through: {
            attributes: [],
          },
          include: [
            {
              model: db.ArtistProfile,
              as: "artistProfile",
              attributes: [],
            },
          ],
        },
      ],
    });

    return {
      EM: "Get Song with Id Successfully",
      EC: 0,
      DT: song,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const updateSong = async (id, rawData) => {
  const song = await db.Song.findOne({
    where: { id: id },
  });

  if (!song) {
    return {
      EC: -1,
      EM: "Song not found",
    };
  }

  if (rawData.hasNewCover && song.cover) {
    deleteFile(song.cover);
  }

  if (rawData.hasNewAudioUrl && song.audioUrl) {
    deleteFile(song.audioUrl);
  }

  const nextCover = rawData.hasNewCover ? rawData.cover : song.cover;
  const nextAudioUrl = rawData.hasNewAudioUrl
    ? rawData.audioUrl
    : song.audioUrl;

  await song.update({
    title: rawData.title,
    audioUrl: nextAudioUrl,
    cover: nextCover,
    duration: rawData.duration,
    lyrics: rawData.lyrics,
    status: rawData.status,
    ownerId: rawData.ownerId,
    albumId: rawData.albumId || null,
  });

  await song.setGenres(rawData.genreId || []);

  await song.setFeatures(rawData.featureId || []);

  return {
    EC: 0,
    EM: "Update song successfully",
  };
};

const deleteSong = async (songId) => {
  try {
    const song = await db.Song.findOne({
      where: { id: songId },
    });

    if (!song) {
      return {
        EM: "Can not find this song",
        EC: -2,
      };
    }

    if (song.cover) {
      deleteFile(song.cover);
    }

    if (song.audioUrl) {
      deleteFile(song.audioUrl);
    }
    await song.setGenres([]);

    await song.setFeatures([]);

    await song.destroy({
      where: { id: songId },
    });

    return {
      EM: "Delete Song Successfully",
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
  songCount,
  getAllSongs,
  getSongOptionWithIdOrNot,
  createNewSong,
  getSongWithId,
  updateSong,
  deleteSong,
};
