import axios from "../../../API/axiosSetup";

const getAllArtist = () => {
  return axios.get(`api/v1/admin/artist`);
};

const getArtistOption = () => {
  return axios.get(`api/v1/admin/artist/option`);
};

const deleteArtistProfile = (userId) => {
  return axios.delete(`api/v1/admin/artist-profile/delete/${userId}`);
};

export { getAllArtist, getArtistOption, deleteArtistProfile };
