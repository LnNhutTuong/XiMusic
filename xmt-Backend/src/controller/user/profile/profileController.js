import console from "console";
import {
  getProfile,
  updateProfile,
  requestArtistProfile,
  cancelRequestArtistProfile,
  editRequestArtistProfile,
} from "../../../service/user/profile/profileService";

const handleGetProfile = async (req, res) => {
  try {
    let { email } = req.query;

    if (!email) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1,
      });
    }

    let data = await getProfile(email);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { displayName } = req.body;

    const avatarFile = req.file;
    let avatarPath = null;

    if (avatarFile) {
      avatarPath = `uploads/user/avatar/${avatarFile.filename}`;
    }

    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1,
      });
    }

    if (!displayName && !avatarPath) {
      return res.status(400).json({
        EM: "At least one of displayName or avatarPath must be provided",
        EC: -1,
      });
    }

    const data = await updateProfile(userId, {
      displayName,
      avatar: avatarPath,
      hasNewAvatar: !!avatarFile,
    });

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleRequestArtistProfile = async (req, res) => {
  try {
    const { userId, stageName, bio } = req.body;

    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1,
      });
    }

    let data = await requestArtistProfile(userId, stageName, bio);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleCancelRequestArtistProfile = async (req, res) => {
  try {
    let { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1,
      });
    }

    let data = await cancelRequestArtistProfile(userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleEditRequestArtistProfile = async (req, res) => {
  try {
    const { userId, stageName, bio } = req.body;

    if (!userId) {
      return res.status(400).json({
        EM: "Missing requires parameter",
        EC: -1,
      });
    }

    let data = await editRequestArtistProfile(userId, stageName, bio);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

export {
  handleGetProfile,
  handleUpdateProfile,
  handleRequestArtistProfile,
  handleCancelRequestArtistProfile,
  handleEditRequestArtistProfile,
};
