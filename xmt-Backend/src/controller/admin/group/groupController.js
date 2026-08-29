import { handleGetAllGroup } from "../../../service/admin/group/groupService";

const getAllGroup = async (req, res) => {
  try {
    let data = await handleGetAllGroup();
    return await res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

export { getAllGroup };
