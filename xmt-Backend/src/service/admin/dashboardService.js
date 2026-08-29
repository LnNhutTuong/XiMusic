import db from "../../models/index";
import { Op, fn, col } from "sequelize";

const getAllTotal = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    //user
    let totalUser = await db.User.count();
    let newUserInThisMonth = await db.User.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    //artist
    let totalArtist = await db.User.count({
      where: { groupId: 2 },
      include: {
        model: db.ArtistProfile,
        as: "artistProfile",
        where: { verified: 1 },
      },
    });
    let newArtistInThisMonth = await db.User.count({
      where: [
        { groupId: 2 },
        {
          createdAt: {
            [Op.gte]: startOfMonth,
          },
        },
      ],
      include: {
        model: db.ArtistProfile,
        as: "artistProfile",
        where: { verified: 1 },
      },
    });

    //listener
    let totalListener = await db.User.count({
      where: { groupId: 3 },
    });
    let newListenerInThisMonth = await db.User.count({
      where: [
        { groupId: 3 },
        {
          createdAt: {
            [Op.gte]: startOfMonth,
          },
        },
      ],
    });

    //Song
    let totalSong = await db.Song.count();
    let newSongsThisMonth = await db.Song.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    //album
    let totalAlbum = await db.Album.count();
    let newAlbumInThisMonth = await db.Album.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    //genre
    let totalGenre = await db.Genre.count();

    //charts
    const songChart = await db.Song.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "songs"],
      ],
      group: [fn("MONTH", col("createdAt"))],
      order: [[fn("MONTH", col("createdAt")), "ASC"]],
    });

    return {
      EM: "get total for Dashboard Successfully",
      EC: 0,
      DT: {
        statics: {
          users: { total: totalUser, newThisMonth: newUserInThisMonth },
          listeners: {
            total: totalListener,
            newThisMonth: newListenerInThisMonth,
          },
          artists: { total: totalArtist, newThisMonth: newArtistInThisMonth },
          genres: { total: totalGenre },
          albums: { total: totalAlbum, newThisMonth: newAlbumInThisMonth },
          songs: { total: totalSong, newThisMonth: newSongsThisMonth },
        },
        songChart,
      },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
    };
  }
};

export { getAllTotal };
