"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateUser = exports.handleDelete = exports.handleCreateNewUser = exports.getUserWithId = exports.getUserAccount = exports.getAllUser = void 0;
var _index = _interopRequireDefault(require("../../../models/index"));
var _userService = require("../../../service/admin/user/userService");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getAllUser = async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const group = req.query.group || null;
    const sort = req.query.sort || null;
    const keySearch = req.query.keySearch || "";
    if (!page || !limit) {
      return {
        EM: "Missing required parameters",
        //error message
        EC: 0 //error code
      };
    }
    let data = await (0, _userService.getAllUsers)(page, limit, group, sort, keySearch);
    return await res.status(200).json({
      EM: data.EM,
      //error message
      EC: data.EC,
      //error code
      DT: data.DT //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Error from server" + error,
      //error message
      EC: -1,
      //error code
      DT: "" //data
    });
  }
};
exports.getAllUser = getAllUser;
const handleCreateNewUser = async (req, res) => {
  if (!req.body?.email || !req.body?.displayName || !req.body?.groupId) {
    return res.status(200).json({
      EM: "Missing required parameters",
      //error message
      EC: -1,
      //error code
      DT: req.body //data
    });
  }
  if (req.body.groupId === "2" && !req.body.statusVerify) {
    return res.status(200).json({
      EM: "Missing status Verify",
      //error message
      EC: -1,
      //error code
      DT: req.body //data
    });
  }
  let data = await (0, _userService.createNewUser)(req.body);
  return await res.status(200).json({
    EM: data.EM,
    //error message
    EC: data.EC,
    //error code
    DT: data.DT //data
  });
};
exports.handleCreateNewUser = handleCreateNewUser;
const getUserWithId = async (req, res) => {
  const userId = req.params.id;
  let data = await (0, _userService.getUserById)(userId);
  return await res.status(200).json({
    EM: data.EM,
    //error message
    EC: data.EC,
    //error code
    DT: data.DT //data
  });
};
exports.getUserWithId = getUserWithId;
const handleUpdateUser = async (req, res) => {
  const userId = req.params.id;
  if (!req.body?.email || !req.body?.displayName || !req.body?.groupId) {
    return res.status(200).json({
      EM: "Missing required parameters",
      //error message
      EC: -1,
      //error code
      DT: req.body //data
    });
  }
  if (req.body.groupId === "2" && !req.body.statusVerify) {
    return res.status(200).json({
      EM: "Missing status Verify",
      //error message
      EC: -1,
      //error code
      DT: req.body //data
    });
  }
  let data = await (0, _userService.updateUser)(userId, req.body);
  return await res.status(200).json({
    EM: data.EM,
    //error message
    EC: data.EC,
    //error code
    DT: data.DT //data
  });
};
exports.handleUpdateUser = handleUpdateUser;
const handleDelete = async (req, res) => {
  const userId = req.params.id;
  let data = await (0, _userService.deleteUser)(userId);
  return await res.status(200).json({
    EM: data.EM,
    //error message
    EC: data.EC,
    //error code
    DT: data.DT //data
  });
};
exports.handleDelete = handleDelete;
const getUserAccount = async (req, res) => {
  let user = await _index.default.User.findOne({
    where: {
      email: req.user.email
    },
    attributes: ["avatar", "displayName"]
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
      groupWithRoles: req.user.groupWithRoles
    }
  });
};
exports.getUserAccount = getUserAccount;