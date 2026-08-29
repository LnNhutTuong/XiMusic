import db from "../../../models";

export const getArtistProfile = async (userId) => {
  try {
    let user = await db.User.findByPk(userId);

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    let artistProfile = await db.ArtistProfile.findOne({
      where: { userId },
    });
    if (!artistProfile) {
      return {
        EM: "Can't find artist profile",
        EC: -1,
      };
    }

    return {
      EM: "Get Artist Profile Successfully",
      EC: 0,
      DT: artistProfile,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
    };
  }
};

export const deleteArtistProfile = async (userId) => {
  try {
    let user = await db.User.findByPk(userId);

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }
    let artistProfile = await db.ArtistProfile.findOne({
      where: { userId },
    });
    if (!artistProfile) {
      return {
        EM: "Can't find artist profile",
        EC: -1,
      };
    }

    await artistProfile.destroy();
    await user.update({
      groupId: 2,
    });

    return {
      EM: "Delete Artist Profile Successfully",
      EC: 0,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
    };
  }
};
