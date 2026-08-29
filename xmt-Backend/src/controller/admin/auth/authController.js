import authService from "../../../service/admin/auth/authService";

const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.displayName || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters", //error message
        EC: 1, //error code
        DT: "", //data
      });
    }

    if (req.body.password && req.body.password.length < 6) {
      return res.status(200).json({
        EM: "Password must be at least 6 characters",
        EC: 1,
        DT: "",
      });
    }

    let dataUser = await authService.handleRegister(req.body);

    return res.status(200).json({
      EM: dataUser.EM, //error message
      EC: dataUser.EC, //error code
      DT: dataUser.DT, //data
    });
  } catch (error) {
    console.log(">>>>>why error: ", error);
    return res.status(500).json({
      EM: "Error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    if (!req.body.valueLogin || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters", //error message
        EC: 1, //error code
        DT: "", //data
      });
    }

    if (req.body.password && req.body.password.length < 6) {
      return res.status(200).json({
        EM: "Password must be at least 6 characters",
        EC: 1, //error code
        DT: "", //data
      });
    }

    let data = await authService.handleLogin(req.body);
    if (data && data.DT && data.DT.access_token) {
      //set cookie
      res.clearCookie("jwt", {
        path: "/",
      });

      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }

    return await res.status(200).json({
      EC: data.EC,
      EM: data.EM,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server: " + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleLogout = async (req, res) => {
  try {
    let data = await authService.handleLogout();

    res.clearCookie("jwt", {
      path: "/",
      httpOnly: true,
    });

    return res.status(200).json({
      EC: data.EC,
      EM: data.EM,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server: " + error,
      EC: -1,
      DT: "",
    });
  }
};

export { handleRegister, handleLogin, handleLogout };
