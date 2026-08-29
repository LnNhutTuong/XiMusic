import axios from "../../API/axiosSetup";

export const getProfile = (email) => {
  return axios.get(`api/v1/user/profile`, { params: { email } });
};

export const updateProfile = (userId, displayName, avatar) => {
  const data = new FormData();

  data.append("displayName", displayName);
  data.append("avatar", avatar);

  return axios.put(`/api/v1/user/profile/update/${userId}`, data);
};

export const requestArtist = (userId, stageName, bio) => {
  return axios.post(`api/v1/user/artist-profile/request`, {
    userId,
    stageName,
    bio,
  });
};

export const editRequestArtist = (userId, stageName, bio) => {
  return axios.put(`api/v1/user/artist-profile/edit-request`, {
    userId,
    stageName,
    bio,
  });
};

export const cancelRequestArtist = (userId) => {
  return axios.delete(`api/v1/user/artist-profile/cancel-request`, {
    data: { userId },
  });
};
