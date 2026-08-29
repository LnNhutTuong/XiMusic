import axios from "../../API/axiosSetup";

const registerNewUser = (email, password, displayName) => {
  return axios.post("api/v1/register", {
    email: email,
    password: password,
    displayName: displayName,
  });
};

const handleLogin = (valueLogin, password) => {
  return axios.post("api/v1/login", {
    valueLogin: valueLogin,
    password: password,
  });
};

const handleLogout = () => {
  return axios.post("api/v1/logout");
};

export { registerNewUser, handleLogin, handleLogout };
