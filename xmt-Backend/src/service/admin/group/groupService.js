import db from "../../../models/index";

const handleGetAllGroup = async (res, req) => {
  let groups = [];

  try {
    groups = await db.Group.findAll();

    return {
      EM: "Get all group successfully", //error message
      EC: 0, //error code
      DT: groups, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

export { handleGetAllGroup };
