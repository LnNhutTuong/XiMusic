import axios from "../../API/axiosSetup";

export const getNotifications = async (userId = null) => {
  return axios.get("/api/v1/notification", { params: { id: userId } });
};

export const getNotificationById = async (notiId, userId = null) => {
  return axios.get(`/api/v1/notification/${notiId}`, { params: { userId } });
};

export const getNotificationsForAdmin = async () => {
  return axios.get(`/api/v1/admin/notification`);
};

export const createNotification = (
  type,
  title,
  content,
  image,
  groupId = null,
  userId = null,
) => {
  const data = new FormData();

  data.append("type", type);
  data.append("title", title);
  data.append("content", content);
  data.append("image", image);
  data.append("groupId", groupId);
  data.append("userId", userId);

  return axios.post(`api/v1/admin/notification/create`, data);
};
