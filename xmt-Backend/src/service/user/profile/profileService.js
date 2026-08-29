import { where } from "sequelize";
import db from "../../../models/index";
import { deleteFile } from "../../../utils/fileHelper";

const getProfile = async (email) => {
  try {
    let user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    let artistProfile = await db.ArtistProfile.findOne({
      where: { userId: user.id },
      attributes: ["verified"],
    });

    if (artistProfile) {
      user.dataValues.artistProfile = artistProfile;
      // user.dataValues.verified = artistProfile?.verified ?? false;
    }

    return {
      EM: "get profile user successfully",
      EC: 0,
      DT: user,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
    };
  }
};

const updateProfile = async (userId, rawData) => {
  try {
    let user = await db.User.findByPk(userId);
    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    if (rawData.hasNewAvatar && user.avatar) {
      deleteFile(user.avatar);
    }

    const nextDisplayName =
      rawData.displayName === "" ||
      rawData.displayName === null ||
      rawData.displayName === undefined ||
      rawData.displayName === "null"
        ? user.displayName
        : rawData.displayName;
    const nextAvatar = rawData.hasNewAvatar ? rawData.avatar : user.avatar;

    await user.update({
      displayName: nextDisplayName,
      avatar: nextAvatar,
    });

    return {
      EM: "Update profile successfully",
      EC: 0,
      DT: user,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
    };
  }
};

const requestArtistProfile = async (userId, stageName, bio) => {
  try {
    let user = await db.User.findByPk(userId);

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }
    const artistProfile = await user.createArtistProfile({
      stageName,
      bio,
    });

    return {
      EM: "Create artist profile successfully",
      EC: 0,
      DT: artistProfile,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const cancelRequestArtistProfile = async (userId) => {
  try {
    let user = await db.User.findByPk(userId);

    if (!user) {
      return {
        EM: "Can't find this user",
        EC: -1,
      };
    }

    await db.ArtistProfile.destroy({ where: { userId } });

    return {
      EM: "Cancel request artist profile successfully",
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

const editRequestArtistProfile = async (userId, stageName, bio) => {
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

    await db.ArtistProfile.update(
      {
        stageName,
        bio,
      },
      { where: { userId } },
    );

    return {
      EM: "Edit artist profile successfully",
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
export {
  getProfile,
  updateProfile,
  requestArtistProfile,
  cancelRequestArtistProfile,
  editRequestArtistProfile,
};
