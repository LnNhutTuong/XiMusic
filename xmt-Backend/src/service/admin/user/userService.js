import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../../../models/index";
import { Op, where, findOrCreate } from "sequelize";
import { handleGetArtistWithId } from "../artist/artistService";
import { songCount } from "../music/song/songService";
import { albumCount } from "../music/album/albumService";
import { verify } from "jsonwebtoken";

const hashPassword = async (password) => {
  return await bcrypt.hashSync(password, salt);
};

const getAllUsers = async (page, limit, group, sort, keySearch) => {
  try {
    let options = {
      offset: (page - 1) * limit,
      limit: limit,
      attributes: [
        "id",
        "email",
        "displayName",
        "groupId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: db.Group,
          as: "group",
          attributes: ["name"],
        },
        {
          model: db.ArtistProfile,
          as: "artistProfile",
          attributes: ["verified"],
        },
      ],
      order: [["createdAt", "ASC"]],
      where: {},
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
        options.where = { groupId: 3 };
        break;

      case "artist":
        options.where = { groupId: 2 };
        break;

      default:
        options.where.groupId = {
          [Op.ne]: 1,
        };
        break;
    }

    if (keySearch) {
      options.include.push({
        model: db.ArtistProfile,
        attributes: ["stageName", "verified"],
        as: "artistProfile",
      });

      options.where = {
        [Op.or]: [
          {
            displayName: {
              [Op.like]: `%${keySearch}%`,
            },
          },
          {
            "$artistProfile.stageName$": {
              [Op.like]: `%${keySearch}%`,
            },
          },
        ],
      };
    }

    let users = await db.User.findAll(options);
    let count = await db.User.count();

    return {
      EM: "Fetch user successfully", //error message
      EC: 0, //error code
      DT: { users, count }, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const checkEmail = async (userEmail, userId = null) => {
  //điều kiện là cái mail
  let whereCondition = {
    email: userEmail,
  };

  //nếu có userId thì chạy vào đây
  if (userId) {
    whereCondition.id = {
      // lấy id của cái mail đang tìm
      [Op.ne]: userId, //loại trừ cái id này ra
    };
  }

  let user = await db.User.findOne({
    where: whereCondition,
  });

  if (user) {
    return true;
  }

  return false;
};

const createNewUser = async (rawData) => {
  try {
    let userHashPassword = await hashPassword(rawData.password);

    let emailExist = await checkEmail(rawData.email);

    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData,
      };
    }

    let newUser = await db.User.create({
      email: rawData.email,
      password: userHashPassword,
      displayName: rawData.displayName,
      groupId: rawData.groupId,
    });

    let artist = null;
    if (+rawData.groupId === 2) {
      artist = await db.ArtistProfile.create({
        userId: newUser.id,
        verified: rawData.statusVerify,
        monthlyListeners: 0,
      });
    }

    return {
      EM: "Create new user successfully",
      EC: 0,
      DT: { information: newUser, artist },
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const getUserById = async (id) => {
  try {
    const user = await db.User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    let artistProfile = await handleGetArtistWithId(user.id);

    if (artistProfile) {
      artistProfile = artistProfile.dataValues;
    }

    return {
      EM: "Get user by Id successfully",
      EC: 0,
      DT: { information: user, artistProfile },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const updateUser = async (id, rawData) => {
  try {
    let emailExist = await checkEmail(rawData.email, id);

    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData.email,
      };
    }

    let finalGroupId = rawData.groupId;
    if (Number(rawData.statusVerify) === 2) {
      finalGroupId = 3;
    }

    let userAfterUpdate = await db.User.update(
      {
        email: rawData.email,
        displayName: rawData.displayName,
        groupId: finalGroupId,
      },
      {
        where: {
          id: id,
        },
      },
    );

    let artistProfile = await db.ArtistProfile.findOne({
      where: { userId: id },
    });

    if (artistProfile) {
      await artistProfile.update({
        verified: rawData.statusVerify,
      });
    }

    return {
      EM: "Update successfully",
      EC: 0,
      DT: { information: userAfterUpdate, artist: artistProfile },
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const deleteUser = async (id) => {
  try {
    let isArtist = await handleGetArtistWithId(id);

    if (isArtist) {
      let songs = await songCount(id);
      let albums = await albumCount(id);

      if (songs > 0 || albums > 0) {
        return {
          EM: "Artist still has some songs and albums.",
          EC: -1,
          DT: { songCount: songs, albumCount: albums },
        };
      } else {
        await db.ArtistProfile.destroy({
          where: {
            userId: id,
          },
        });
      }
    }

    await db.UserNotification.destroy({
      where: {
        userId: id,
      },
    });

    await db.User.destroy({
      where: {
        id: id,
      },
    });

    return {
      EM: "Delete successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
  }
};

export {
  hashPassword,
  getAllUsers,
  createNewUser,
  getUserById,
  updateUser,
  deleteUser,
};
