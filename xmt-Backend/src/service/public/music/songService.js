import db from "../../../models/index";
import { Op, where, findOrCreate, literal } from "sequelize";

const getAllSongsPublic = async (page, limit, genreId, keySearch) => {
  try {
    const options = {
      offset: (page - 1) * limit,
      limit,
      order: [["id", "ASC"]],
      where: { status: 1 },
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
            [literal("`owner->artistProfile`.`bio`"), "bio"],
            [
              literal("`owner->artistProfile`.`monthlyListeners`"),
              "monthlyListeners",
            ],
            "avatar",
          ],
          include: [
            {
              model: db.ArtistProfile,
              as: "artistProfile",
              attributes: [],
            },
          ],
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

const incrementPlays = async (songId) => {
  try {
    let song = await db.Song.findByPk(songId, {
      include: [
        {
          model: db.User,
          as: "owner",
          include: [
            {
              model: db.ArtistProfile,
              as: "artistProfile",
            },
          ],
        },
        {
          model: db.User,
          as: "features",
          through: {
            attributes: [],
          },
          include: [
            {
              model: db.ArtistProfile,
              as: "artistProfile",
            },
          ],
        },
      ],
    });

    if (!song) {
      return {
        EM: "Can't find this song increment Plays",
        EC: -1,
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
      EC: 0,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

export { getAllSongsPublic, incrementPlays };
