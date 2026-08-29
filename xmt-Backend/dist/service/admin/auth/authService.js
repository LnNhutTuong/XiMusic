"use strict";

var _bcryptjs = _interopRequireWildcard(require("bcryptjs"));
var _index = _interopRequireDefault(require("../../../models/index"));
var _sequelize = require("sequelize");
var _JWTService = require("../jwt/JWTService");
var _JWTAction = _interopRequireDefault(require("../../../middleware/JWTAction"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const salt = _bcryptjs.default.genSaltSync(10);
require("dotenv").config();
const hashPassword = password => {
  return _bcryptjs.default.hashSync(password, salt);
};
const checkEmail = async userEmail => {
  let user = await _index.default.User.findOne({
    where: {
      email: userEmail
    }
  });
  if (user) {
    return true;
  }
  return false;
};
const handleRegister = async rawUserData => {
  try {
    let emailExist = await checkEmail(rawUserData.email);
    if (emailExist) {
      return {
        EM: "Email already exists",
        EC: 1,
        DT: ""
      };
    }
    let passwordHash = hashPassword(rawUserData.password);
    await _index.default.User.create({
      email: rawUserData.email,
      displayName: rawUserData.displayName,
      password: passwordHash,
      groupId: 3
    });

    //Create token

    return {
      EM: "Create user successfully",
      EC: 0,
      DT: ""
    };
  } catch (error) {
    console.log(">> ERROR << : ", error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: ""
    };
  }
};
const checkPassword = (inputPassword, password) => {
  return _bcryptjs.default.compareSync(inputPassword, password);
};
const checkValueLogin = async valueLogin => {
  let user = await _index.default.User.findOne({
    where: {
      [_sequelize.Op.or]: [{
        email: valueLogin
      }]
    }
  });
  if (user) {
    return user;
  }
  return false;
};
const handleLogin = async rawUserData => {
  try {
    let user = await checkValueLogin(rawUserData.valueLogin);
    if (!user) {
      return {
        EM: "Email is incorrect",
        EC: 1,
        DT: ""
      };
    }
    let isCorrectPassword = await checkPassword(rawUserData.password, user.password);
    if (!isCorrectPassword) {
      return {
        EM: "Password is incorrect",
        EC: 1,
        DT: ""
      };
    }

    //create token

    //get user
    let groupWithRoles = await (0, _JWTService.getGroupWithRoles)(user);
    let payload = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      groupWithRoles
    };
    let token = await _JWTAction.default.createJwt(payload);
    return {
      EM: "Login successfully",
      EC: 0,
      DT: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        access_token: token,
        groupWithRoles
      }
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service... /" + error,
      EC: -2,
      DT: ""
    };
  }
};
const handleLogout = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        EM: "Clear cookies successfully!",
        EC: 0,
        DT: ""
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleRegister,
  handleLogin,
  handleLogout
};