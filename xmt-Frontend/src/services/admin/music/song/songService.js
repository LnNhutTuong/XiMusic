import axios from "../../../../API/axiosSetup";

const getAllSongs = (page, limit, genreId, keySearch) => {
  return axios.get(`api/v1/admin/song`, {
    params: { page, limit, genreId, keySearch },
  });
};

const getSongOptionWithIdOrNot = (id) => {
  return axios.get(`/api/v1/admin/song/option?id=${id}`);
};

const createNewSong = (
  title,
  audioUrl,
  cover,
  duration,
  lyrics,
  status,
  ownerId,
  featureId,
  genreId,
  albumId,
) => {
  const data = new FormData();

  data.append("title", title);
  data.append("audioUrl", audioUrl);
  data.append("cover", cover);
  data.append("duration", duration);
  data.append("lyrics", lyrics);
  data.append("status", status);

  genreId.forEach((item) => {
    data.append("genreId", item);
  });

  data.append("ownerId", ownerId);
  data.append("featureId", featureId);
  data.append("albumId", albumId);

  return axios.post("/api/v1/admin/song/create", data);
};

const getSongWithId = (songId) => {
  return axios.get(`/api/v1/admin/song/${songId}`);
};

const songUpdate = (
  songId,
  title,
  audioUrl,
  cover,
  duration,
  lyrics,
  status,
  ownerId,
  featureId,
  genreId,
  albumId,
) => {
  const data = new FormData();

  data.append("title", title);
  data.append("audioUrl", audioUrl);
  data.append("cover", cover);
  data.append("duration", duration);
  data.append("lyrics", lyrics);
  data.append("status", status);

  genreId.forEach((item) => {
    data.append("genreId", item);
  });
  data.append("ownerId", ownerId);

  featureId.forEach((item) => {
    data.append("featureId", item);
  });

  data.append("albumId", albumId);

  return axios.put(`/api/v1/admin/song/update/${songId}`, data);
};

const deleteSong = (songId) => {
  return axios.delete(`/api/v1/admin/song/delete/${songId}`);
};

export {
  getAllSongs,
  getSongOptionWithIdOrNot,
  createNewSong,
  getSongWithId,
  songUpdate,
  deleteSong,
};
