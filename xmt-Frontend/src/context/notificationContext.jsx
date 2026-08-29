// src/context/notificationContext.jsx
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

import { toast } from "react-toastify";

import { UserContext } from "./userContext";

import { getNotifications } from "@/services/notification/notificationService";
import { getNotificationById } from "@/services/notification/notificationService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);
  const [notificationById, setNotificationById] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications(user?.account?.id);
    if (res?.EC === 0) {
      const publicNotis = res.DT?.publicNotis || []; //public noti
      const userNotis = res.DT?.userNotis || []; //user noti
      setNotifications({ publicNotis, userNotis });

      const unreadUserCount = userNotis.filter((n) => !n.isRead).length; //filter user noti

      const readPublicIds = getReadPublicIds(); //get public noti readed
      const unreadPublicCount = publicNotis.filter(
        //loc ra public noti ko nam trong readPublicIds
        (n) => !readPublicIds.includes(n.id),
      ).length;

      setUnreadCount(unreadUserCount + unreadPublicCount);
    }
  }, [user?.account?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleGetNotificationById = async (notiId, userId) => {
    const res = await getNotificationById(notiId, userId);
    if (res?.EC === 0) {
      setNotificationById(res.DT);
    } else {
      toast.error(res?.EM);
    }
  };

  //Vào local lấy mấy thằng public noti mà user đã đọc
  const getReadPublicIds = () => {
    try {
      return JSON.parse(localStorage.getItem("read_public_notis") || "[]");
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  //gọi cái này ra, onChange hay onClick thì chưa biết vì chưa hiểu rõ cách haotj động lắm
  const markAllPublicAsRead = () => {
    if (!notifications?.publicNotis.length) return;
    const allPublicIds = notifications.publicNotis.map((n) => n.id);

    localStorage.setItem("read_public_notis", JSON.stringify(allPublicIds));

    const unreadUserCount = notifications?.userNotis.filter(
      (n) => !n.isRead,
    ).length;
    setUnreadCount(unreadUserCount);
  };

  //mark user noti as read
  const markUserNotiAsRead = (id) => {};

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationById,
        setNotificationById,
        unreadCount,
        fetchNotifications,
        handleGetNotificationById,
        markAllPublicAsRead,
        markUserNotiAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
