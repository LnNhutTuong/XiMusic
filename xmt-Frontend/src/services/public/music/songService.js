import axios from "../../../API/axiosSetup";

const getAllSongsPublic = (page, limit, genreId, keySearch) => {
  console.log(axios);
  return axios.get("api/v1/song", {
    params: { page, limit, genreId, keySearch },
  });
};

const incrementPlays = (songId) => {
  return axios.post(`api/v1/song/${songId}/play`);
};

export { getAllSongsPublic, incrementPlays };
