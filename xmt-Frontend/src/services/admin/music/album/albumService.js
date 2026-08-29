import axios from "../../../../API/axiosSetup";

const getAlbumOptionWithIdOrNot = (id) => {
  return axios.get(`/api/v1/admin/album/option?id=${id}`);
};

const getListAlbum = (sort, keySearch) => {
  return axios.get("api/v1/admin/album", { params: { sort, keySearch } });
};

const getAlbumWithId = (albumId) => {
  return axios.get(`api/v1/admin/album/${albumId}`);
};

const createNewAlbum = (title, cover, ownerId, releaseDate, listSongChoose) => {
  const data = new FormData();

  data.append("title", title);
  data.append("cover", cover);
  data.append("ownerId", ownerId);
  data.append("releaseDate", releaseDate);

  listSongChoose.forEach((song) => {
    data.append("songId", song);
  });

  return axios.post(`api/v1/admin/album/create`, data);
};

const albumUpdate = (
  albumId,
  title,
  cover,
  ownerId,
  releaseDate,
  listSongId,
) => {
  const data = new FormData();

  data.append("title", title);
  data.append("cover", cover);
  data.append("ownerId", ownerId);
  data.append("releaseDate", releaseDate);

  listSongId.forEach((song) => {
    data.append("songId", song);
  });

  return axios.put(`/api/v1/admin/album/update/${albumId}`, data);
};

const deleteAlbum = (id) => {
  return axios.delete(`/api/v1/admin/album/delete/${id}`);
};

export {
  getAlbumOptionWithIdOrNot,
  getListAlbum,
  getAlbumWithId,
  createNewAlbum,
  albumUpdate,
  deleteAlbum,
};
