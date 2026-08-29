import db from "../../../models/index";

import {
  getAllUsers,
  createNewUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../../../service/admin/user/userService";

const getAllUser = async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    const group = req.query.group || null;
    const sort = req.query.sort || null;
    const keySearch = req.query.keySearch || "";

    if (!page || !limit) {
      return {
        EM: "Missing required parameters", //error message
        EC: 0, //error code
      };
    }

    let data = await getAllUsers(page, limit, group, sort, keySearch);

    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Error from server" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleCreateNewUser = async (req, res) => {
  if (!req.body?.email || !req.body?.displayName || !req.body?.groupId) {
    return res.status(200).json({
      EM: "Missing required parameters", //error message
      EC: -1, //error code
      DT: req.body, //data
    });
  }

  if (req.body.groupId === "2" && !req.body.statusVerify) {
    return res.status(200).json({
      EM: "Missing status Verify", //error message
      EC: -1, //error code
      DT: req.body, //data
    });
  }

  let data = await createNewUser(req.body);
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const getUserWithId = async (req, res) => {
  const userId = req.params.id;

  let data = await getUserById(userId);
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const handleUpdateUser = async (req, res) => {
  const userId = req.params.id;

  if (!req.body?.email || !req.body?.displayName || !req.body?.groupId) {
    return res.status(200).json({
      EM: "Missing required parameters", //error message
      EC: -1, //error code
      DT: req.body, //data
    });
  }

  if (req.body.groupId === "2" && !req.body.statusVerify) {
    return res.status(200).json({
      EM: "Missing status Verify", //error message
      EC: -1, //error code
      DT: req.body, //data
    });
  }

  let data = await updateUser(userId, req.body);

  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const handleDelete = async (req, res) => {
  const userId = req.params.id;

  let data = await deleteUser(userId);
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const getUserAccount = async (req, res) => {
  let user = await db.User.findOne({
    where: { email: req.user.email },
    attributes: ["avatar", "displayName"],
  });

  return res.status(200).json({
    EM: "ok",
    EC: 0,
    DT: {
      id: req.user.id,
      email: req.user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      access_token: req.token,
      groupWithRoles: req.user.groupWithRoles,
    },
  });
};

export {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
  handleDelete,
  getUserAccount,
};
