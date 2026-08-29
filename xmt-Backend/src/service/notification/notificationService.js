import db from "../../models/index";
import { Op, where } from "sequelize";

export const getNotifications = async (userId = null) => {
  try {
    const publicNotis = await db.Notification.findAll({
      where: {
        targetType: "PUBLIC",
      },
      order: [["createdAt", "DESC"]],
    });

    let userNotis = [];
    if (userId) {
      userNotis = await db.UserNotification.findAll({
        where: { userId },
        attributes: ["isRead"],
        include: {
          model: db.Notification,
        },
        order: [["createdAt", "DESC"]],
      });
    }

    return {
      EM: "Get notification success",
      EC: 0,
      DT: {
        publicNotis,
        userNotis,
      },
    };
  } catch (error) {
    return {
      EM: "Error from service..." + error,
      EC: -2,
    };
  }
};

export const getNotificationsById = async (notiId, userId = null) => {
  try {
    const notification = await db.Notification.findByPk(notiId);

    if (!notification) {
      return {
        EM: "Notification not found",
        EC: -1,
      };
    }

    if (notification.targetType === "PUBLIC") {
      return {
        EM: "Get notification success",
        EC: 0,
        DT: notification,
      };
    }

    if (!userId) {
      return {
        EM: "Unauthorized: Please login to view this notification",
        EC: -1,
      };
    }

    const hasPermission = await db.UserNotification.findOne({
      where: {
        notificationId: notiId,
        userId,
      },
    });

    if (!hasPermission) {
      return {
        EM: "Unauthorized: You don't have permission to view this notification",
        EC: -1,
      };
    }

    return {
      EM: "Get notification success",
      EC: 0,
      DT: notification,
    };
  } catch (error) {
    return {
      EM: "Error from service..." + error,
      EC: -2,
    };
  }
};

export const getNotificationsForAdmin = async () => {
  try {
    const notifications = await db.Notification.findAll({
      order: [["createdAt", "DESC"]],
    });

    return {
      EM: "Get all notifications for admin success",
      EC: 0,
      DT: notifications,
    };
  } catch (error) {}
};

export const createNotification = async (rawData) => {
  try {
    let notification;
    let resMessage;

    if (!rawData.userId && !rawData.groupId) {
      notification = await db.Notification.create({
        title: rawData.title,
        content: rawData.content,
        targetType: "PUBLIC",
        type: rawData.type ? rawData.type.toUpperCase() : "SYSTEM",
        image: rawData.image,
      });

      resMessage = "Create Public notification success";
    }

    if (rawData.groupId) {
      const listUsers = await db.User.findAll({
        where: { groupId: rawData.groupId },
      });

      notification = await db.Notification.create({
        title: rawData.title,
        content: rawData.content,
        targetType: "GROUP",
        type: rawData.type ? rawData.type.toUpperCase() : "SYSTEM",
        image: rawData.image,
      });

      const userNotiRecords = listUsers.map((user) => ({
        notificationId: notification.id,
        userId: user.id,
      }));

      if (userNotiRecords.length > 0) {
        await db.UserNotification.bulkCreate(userNotiRecords);
      }

      resMessage = "Create Group notification success";
    }

    if (rawData.userId) {
      notification = await db.Notification.create({
        title: rawData.title,
        content: rawData.content,
        targetType: "USER",
        type: rawData.type ? rawData.type.toUpperCase() : "SYSTEM",
        image: rawData.image,
      });

      await db.UserNotification.create({
        notificationId: notification.id,
        userId: rawData.userId,
      });

      resMessage = "Create Private notification success";
    }

    return {
      EM: resMessage,
      EC: 0,
      DT: notification,
    };
  } catch (error) {
    return {
      EM: "Error from service..." + error,
      EC: -2,
    };
  }
};
