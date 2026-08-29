import axios from "../../../API/axiosSetup";

const getAllGroup = () => {
  return axios.get("api/v1/admin/group");
};

export { getAllGroup };
