import axios from "../../API/axiosSetup";

const getUserAccount = () => {
  return axios.get("/api/v1/account");
};

export { getUserAccount };
