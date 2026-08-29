import { getArtistProfile } from "../../../service/user/artist/artistService";

export const handleGetArtistProfile = async (req, res) => {
  try {
    let userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        EM: "Missing userId",
        EC: -1,
        DT: "",
      });
    }

    let data = await getArtistProfile(userId);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from controller..." + error,
      EC: -1,
      DT: error,
    });
  }
};
