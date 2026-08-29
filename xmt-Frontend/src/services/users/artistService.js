import axios from "../../API/axiosSetup";

const getArtistProfile = (userId) => {
  return axios.get(`/api/v1/user/artist-profile/${userId}`);
};

export { getArtistProfile };
