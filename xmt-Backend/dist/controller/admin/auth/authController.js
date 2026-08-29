"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRegister = exports.handleLogout = exports.handleLogin = void 0;
var _authService = _interopRequireDefault(require("../../../service/admin/auth/authService"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.displayName || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters",
        //error message
        EC: 1,
        //error code
        DT: "" //data
      });
    }
    if (req.body.password && req.body.password.length < 6) {
      return res.status(200).json({
        EM: "Password must be at least 6 characters",
        EC: 1,
        DT: ""
      });
    }
    let dataUser = await _authService.default.handleRegister(req.body);
    return res.status(200).json({
      EM: dataUser.EM,
      //error message
      EC: dataUser.EC,
      //error code
      DT: dataUser.DT //data
    });
  } catch (error) {
    console.log(">>>>>why error: ", error);
    return res.status(500).json({
      EM: "Error from server",
      //error message
      EC: "-1",
      //error code
      DT: "" //data
    });
  }
};
exports.handleRegister = handleRegister;
const handleLogin = async (req, res) => {
  try {
    if (!req.body.valueLogin || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters",
        //error message
        EC: 1,
        //error code
        DT: "" //data
      });
    }
    if (req.body.password && req.body.password.length < 6) {
      return res.status(200).json({
        EM: "Password must be at least 6 characters",
        EC: 1,
        //error code
        DT: "" //data
      });
    }
    let data = await _authService.default.handleLogin(req.body);
    if (data && data.DT && data.DT.access_token) {
      //set cookie
      res.clearCookie("jwt", {
        path: "/"
      });
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      });
    }
    return await res.status(200).json({
      EC: data.EC,
      EM: data.EM,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server: " + error,
      //error message
      EC: -1,
      //error code
      DT: "" //data
    });
  }
};
exports.handleLogin = handleLogin;
const handleLogout = async (req, res) => {
  try {
    let data = await _authService.default.handleLogout();
    res.clearCookie("jwt", {
      path: "/",
      httpOnly: true
    });
    return res.status(200).json({
      EC: data.EC,
      EM: data.EM,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server: " + error,
      EC: -1,
      DT: ""
    });
  }
};
exports.handleLogout = handleLogout;