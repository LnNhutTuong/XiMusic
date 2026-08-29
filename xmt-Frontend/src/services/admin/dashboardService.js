import axios from "../../API/axiosSetup";

const getAllTotal = () => {
  return axios.get(`api/v1/admin/dashboard`);
};

export { getAllTotal };
