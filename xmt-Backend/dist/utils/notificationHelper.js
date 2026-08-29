"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotification = exports.sendArtistVerifyNotification = void 0;
var _index = _interopRequireDefault(require("../models/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Gửi thông báo cho User (theo ID cá nhân, danh sách ID, hoặc theo Group ID)
 * @param {Object} options
 * @param {number|number[]} [options.userIds] - ID hoặc mảng ID của User nhận thông báo
 * @param {number|number[]} [options.groupIds] - Group ID hoặc mảng Group ID để gửi thông báo cho tất cả User thuộc nhóm đó
 * @param {string} options.title - Tiêu đề thông báo
 * @param {string} options.content - Nội dung thông báo
 * @param {string} [options.type="SYSTEM"] - Loại thông báo (SYSTEM, ARTIST_REQUEST, NEW_SONG, ...)
 * @param {string} [options.image=null] - Ảnh minh họa (nếu có)
 */
const sendNotification = async ({
  userIds,
  groupIds,
  title,
  content,
  type = "SYSTEM",
  image = null
}) => {
  try {
    let targetUserIds = [];
    if (userIds) {
      targetUserIds = Array.isArray(userIds) ? [...userIds] : [userIds];
    }
    if (groupIds) {
      const groups = Array.isArray(groupIds) ? groupIds : [groupIds];
      const usersInGroups = await _index.default.User.findAll({
        where: {
          groupId: groups
        },
        attributes: ["id"],
        raw: true
      });
      const groupUserIds = usersInGroups.map(u => u.id);
      targetUserIds = [...new Set([...targetUserIds, ...groupUserIds])];
    }
    if (targetUserIds.length === 0) {
      return false;
    }
    const targetType = groupIds ? "GROUP" : userIds ? "USER" : "PUBLIC";
    const notification = await _index.default.Notification.create({
      title,
      content,
      type,
      targetType,
      image
    });
    const userNotificationRecords = targetUserIds.map(userId => ({
      userId,
      notificationId: notification.id,
      isRead: false
    }));
    await _index.default.UserNotification.bulkCreate(userNotificationRecords);
    return true;
  } catch (error) {
    console.error("Error in sendNotification helper:", error);
    return false;
  }
};

/**
 * 🎯 THÔNG BÁO CỨNG (PRESET TEMPLATES)
 */

// Thông báo duyệt / từ chối Yêu cầu Nghệ sĩ
exports.sendNotification = sendNotification;
const sendArtistVerifyNotification = async (userId, isApproved) => {
  return await sendNotification({
    userIds: userId,
    title: "Update artist request",
    content: isApproved ? "Congratulations! Your artist request has been approved." : "Sorry, your artist request has been rejected.",
    type: "ARTIST_VERIFY",
    image: isApproved ? "/uploads/notification/accept.png" : "/uploads/notification/reject.png"
  });
};
exports.sendArtistVerifyNotification = sendArtistVerifyNotification;