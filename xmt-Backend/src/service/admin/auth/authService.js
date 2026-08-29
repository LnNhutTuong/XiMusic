import bcrypt, { hash, hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../../../models/index";
import { Op } from "sequelize";
import { getGroupWithRoles } from "../jwt/JWTService";
import JWTAction from "../../../middleware/JWTAction";
require("dotenv").config();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const checkEmail = async (userEmail) => {
  let user = await db.User.findOne({
    where: {
      email: userEmail,
    },
  });

  if (user) {
    return true;
  }

  return false;
};

const handleRegister = async (rawUserData) => {
  try {
    let emailExist = await checkEmail(rawUserData.email);

    if (emailExist) {
      return {
        EM: "Email already exists",
        EC: 1,
        DT: "",
      };
    }

    let passwordHash = hashPassword(rawUserData.password);

    await db.User.create({
      email: rawUserData.email,
      displayName: rawUserData.displayName,
      password: passwordHash,
      groupId: 3,
    });

    //Create token

    return {
      EM: "Create user successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    console.log(">> ERROR << : ", error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: "",
    };
  }
};

const checkPassword = (inputPassword, password) => {
  return bcrypt.compareSync(inputPassword, password);
};

const checkValueLogin = async (valueLogin) => {
  let user = await db.User.findOne({
    where: {
      [Op.or]: [{ email: valueLogin }],
    },
  });

  if (user) {
    return user;
  }

  return false;
};

const handleLogin = async (rawUserData) => {
  try {
    let user = await checkValueLogin(rawUserData.valueLogin);

    if (!user) {
      return {
        EM: "Email is incorrect",
        EC: 1,
        DT: "",
      };
    }

    let isCorrectPassword = await checkPassword(
      rawUserData.password,
      user.password,
    );

    if (!isCorrectPassword) {
      return {
        EM: "Password is incorrect",
        EC: 1,
        DT: "",
      };
    }

    //create token

    //get user
    let groupWithRoles = await getGroupWithRoles(user);

    let payload = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      groupWithRoles,
    };
    let token = await JWTAction.createJwt(payload);

    return {
      EM: "Login successfully",
      EC: 0,
      DT: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        access_token: token,
        groupWithRoles,
      },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service... /" + error,
      EC: -2,
      DT: "",
    };
  }
};

const handleLogout = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        EM: "Clear cookies successfully!",
        EC: 0,
        DT: "",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
};
