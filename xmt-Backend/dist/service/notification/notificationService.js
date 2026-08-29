"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationsForAdmin = exports.getNotificationsById = exports.getNotifications = exports.createNotification = void 0;
var _index = _interopRequireDefault(require("../../models/index"));
var _sequelize = require("sequelize");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getNotifications = async (userId = null) => {
  try {
    const publicNotis = await _index.default.Notification.findAll({
      where: {
        targetType: "PUBLIC"
      },
      order: [["createdAt", "DESC"]]
    });
    let userNotis = [];
    if (userId) {
      userNotis = await _index.default.UserNotification.findAll({
        where: {
          userId
        },
        attributes: ["isRead"],
        include: {
          model: _index.default.Notification
        },
        order: [["createdAt", "DESC"]]
      });
    }
    return {
      EM: "Get notification success",
      EC: 0,
      DT: {
        publicNotis,
        userNotis
      }
    };
  } catch (error) {
    return {
      EM: "Error from service..." + error,
      EC: -2
    };
  }
};
exports.getNotifications = getNotifications;
const getNotificationsById = async (notiId, userId = null) => {
  try {
    const notification = await _index.default.Notification.findByPk(notiId);
    if (!notification) {
      return {
        EM: "Notification not found",
        EC: -1
      };
    }
    if (notification.targetType === "PUBLIC") {
      return {
        EM: "Get notification success",
        EC: 0,
        DT: notification
      };
    }
    if (!userId) {
      return {
        EM: "Unauthorized: Please login to view this notification",
        EC: -1
      };
    }
    const hasPermission = await _index.default.UserNotification.findOne({
      where: {
        notificationId: notiId,
        userId
      }
    });
    if (!hasPermission) {
      return {
        EM: "Unauthorized: You don't have permission to view this notification",
        EC: -1
      };
    }
    return {
      EM: "Get notification success",
      EC: 0,
      DT: notification
    };
  } catch (error) {
    return {
      EM: "Error from service..." + error,
      EC: -2
    };
  }
};
exports.getNotificationsById = getNotificationsById;
const getNotificationsForAdmin = async () => {
  try {
    const notifications = await _index.default.Notification.findAll({
      order: [["createdAt", "DESC"]]
    });
    return {
      EM: "Get all notifications for admin success",
      EC: 0,
      DT: notifications
    };
  } catch (error) {}
};
exports.getNotificationsForAdmin = getNotificationsForAdmin;
const createNotification = async rawData => {
  try {
    let notification;
    let resMessage;
    if (!rawData.userId && !rawData.groupId) {
      notification = await _index.default.Notification.create({
        title: rawData.title,
        content: rawData.content,
        targetType: "PUBLIC",
        type: rawData.type ? rawData.type.toUpperCase() : "SYSTEM",
        image: rawData.image
      });
      resMessage = "Create Public notification success";
    }
    if (rawData.groupId) {
      const listUsers = await _index.default.User.findAll({
        where: {
          groupId: rawData.groupId
        }
      });
      notification = await _index.default.Notification.create({
        title: rawData.title,
        content: rawData.content,
        targetType: "GROUP",
        type: rawData.type ? rawData.type.toUpperCase() : "SYSTEM",
        image: rawData.image
      });
      const userNotiRecords = listUsers.map(user => ({
        notificationId: notification.id,
        userId: user.id
      }));
      if (userNotiRecords.length > 0) {
        await _index.default.UserNotification.bulkCreate(userNotiRecords);
      }
      resMessage = "Create Group notification success";
    }
    if (rawData.userId) {
      notification = await _index.default.Notification.create({
        title: rawData.title,
        content: rawData.content,
        targetType: "USER",
        type: rawData.type ? rawData.type.toUpperCase() : "SYSTEM",
        image: rawData.image
      });
      await _index.default.UserNotification.create({
        notificationId: notification.id,
        userId: rawData.userId
      });
      resMessage = "Create Private notification success";
    }
    return {
      EM: resMessage,
      EC: 0,
      DT: notification
    };
  } catch (error) {
    return {
      EM: "Error from service..." + error,
      EC: -2
    };
  }
};
exports.createNotification = createNotification;