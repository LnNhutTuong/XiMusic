import axios from "../../../../API/axiosSetup";

const fetchAllGenre = (page, limit, sort, keySearch) => {
  return axios.get(`api/v1/admin/genre`, {
    params: { page, limit, sort, keySearch },
  });
};

const getGenreOption = () => {
  return axios.get(`api/v1/admin/genre/option`);
};

const createNewGenre = (name, description, icon) => {
  const data = new FormData();

  data.append("name", name);
  data.append("description", description);
  data.append("icon", icon);

  return axios.post("/api/v1/admin/genre/create", data);
};

const getGenreWithId = (genreId) => {
  return axios.get(`/api/v1/admin/genre/${genreId}`);
};

const updateGenre = (genreId, name, description, icon) => {
  const data = new FormData();

  data.append("name", name);
  data.append("description", description);
  data.append("icon", icon);

  return axios.put(`/api/v1/admin/genre/update/${genreId}`, data);
};

const deleteGenre = (genreId) => {
  return axios.delete(`/api/v1/admin/genre/delete/${genreId}`);
};

export {
  fetchAllGenre,
  getGenreOption,
  createNewGenre,
  getGenreWithId,
  updateGenre,
  deleteGenre,
};
