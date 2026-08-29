import db from "../../../models/index";
import { Op, where, literal } from "sequelize";
import { sendArtistVerifyNotification } from "../../../utils/notificationHelper";

const handleGetArtistWithId = async (userId) => {
  try {
    let artist = await db.ArtistProfile.findOne({
      where: {
        userId,
      },
      attributes: { exclude: ["id", "userId", "createdAt", "updatedAt"] },
    });
    return artist;
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const getAllArtistOption = async () => {
  try {
    const artists = await db.User.findAndCountAll({
      where: {
        groupId: 2,
      },

      attributes: [
        "id",
        [
          literal(
            `COALESCE(\`artistProfile\`.\`stageName\`,
          \`user\`.\`displayName\`)`,
          ),
          "artistName",
        ],
      ],

      order: [["artistName", "ASC"]],
      include: [
        {
          model: db.ArtistProfile,
          as: "artistProfile",
          where: {
            verified: 1,
          },
          attributes: [],
        },
      ],
    });

    return {
      EM: "Fetch artists successfully",
      EC: 0,
      DT: artists,
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: [],
    };
  }
};

export const deleteArtistProfile = async (userId) => {
  try {
    const user = await db.User.findByPk(userId);

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    const artistProfile = await db.ArtistProfile.findOne({ where: { userId } });

    if (!artistProfile) {
      return {
        EM: "Can't find this artist profile",
        EC: -1,
      };
    }

    if (Number(artistProfile.verified) !== 2) {
      return {
        EM: "Can't delete this artist profile because this artist is not approved",
        EC: -1,
      };
    }

    await artistProfile.destroy();

    return {
      EM: "Delete artist profile successfully",
      EC: 0,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
    };
  }
};

const updateRequest = async (userId, statusVerify) => {
  try {
    let user = await db.User.findByPk(userId);

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    let artistProfile = await db.ArtistProfile.findOne({ where: { userId } });
    if (!artistProfile) {
      return {
        EM: "Can't find this artist profile",
        EC: -1,
      };
    }

    await artistProfile.update({ verified: statusVerify });

    const isApproved = Number(statusVerify) === 1;
    if (isApproved) {
      await user.update({ groupId: 2 });
    }

    await sendArtistVerifyNotification(userId, isApproved);

    return {
      EM: "Edit artist profile & sent notification successfully",
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

export { handleGetArtistWithId, getAllArtistOption, updateRequest };
