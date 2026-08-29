import {
  getAllArtistOption,
  deleteArtistProfile,
  updateRequest,
} from "../../../service/admin/artist/artistService";

const handleGetAllArtistOption = async (req, res) => {
  let data = await getAllArtistOption();
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const handleDeleteArtistProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId)
      return await res.status(400).json({
        EM: "Missing userId or statusVerify", //error message
        EC: -1, //error code
      });

    let data = await deleteArtistProfile(userId);

    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Error from controller..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleUpdateRequest = async (req, res) => {
  try {
    const userId = req.params.id;

    const statusVerify = req.body.statusVerify;

    if (!userId || !statusVerify)
      return await res.status(400).json({
        EM: "Missing userId or statusVerify", //error message
        EC: -1, //error code
      });

    let data = await updateRequest(userId, statusVerify);
    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Error from server..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

export {
  handleGetAllArtistOption,
  handleDeleteArtistProfile,
  handleUpdateRequest,
};
