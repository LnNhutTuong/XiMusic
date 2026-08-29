"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGetNotificationById = exports.handleGetNotification = exports.handleCreateNotification = exports.handelGetNotificationForAdmin = void 0;
var _notificationService = require("../../service/notification/notificationService");
const handleGetNotification = async (req, res) => {
  try {
    const userId = req.query.id;
    const data = await (0, _notificationService.getNotifications)(userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from controller..." + error,
      EC: -2
    });
  }
};
exports.handleGetNotification = handleGetNotification;
const handleGetNotificationById = async (req, res) => {
  try {
    const notiId = req.params.id;
    const userId = req.query.userId;
    if (!notiId) {
      return res.status(400).json({
        EM: "Notification ID is required",
        EC: -1
      });
    }
    const data = await (0, _notificationService.getNotificationsById)(notiId, userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from controller..." + error,
      EC: -2
    });
  }
};
exports.handleGetNotificationById = handleGetNotificationById;
const handelGetNotificationForAdmin = async (req, res) => {
  try {
    let data = await (0, _notificationService.getNotificationsForAdmin)();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: ""
    });
  }
};
exports.handelGetNotificationForAdmin = handelGetNotificationForAdmin;
const handleCreateNotification = async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      groupId,
      userId
    } = req.body;
    console.log(req.body);
    const imageFile = req.files;
    const imagePath = imageFile ? `uploads/notification/image/${imageFile.filename}` : null;
    if (!type || !title || !content) {
      return res.status(400).json({
        EM: "Missing required data",
        EC: -1
      });
    }
    const data = await (0, _notificationService.createNotification)({
      type,
      title,
      content,
      image: imagePath,
      groupId,
      userId
    });
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from controller..." + error,
      EC: -2
    });
  }
};
exports.handleCreateNotification = handleCreateNotification;