import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/utils/timeUtils";

import { useContext, useState } from "react";
import { NotificationContext } from "@/context/notificationContext";

import { UserContext } from "@/context/userContext";

import { DialogNotification } from "./DialogNotification";

export const PrivateNoti = (props) => {
  const {
    notifications,

    notificationById,
    setNotificationById,

    handleGetNotificationById,
  } = useContext(NotificationContext);

  const { user } = useContext(UserContext);

  const [showNoti, setShowNoti] = useState(false);

  const [checkedNotis, setCheckedNotis] = useState([]);

  const handleCheckedNotis = (id) => {
    if (checkedNotis.includes(id)) {
      setCheckedNotis(checkedNotis.filter((item) => item !== id));
    } else {
      setCheckedNotis([...checkedNotis, id]);
    }
  };

  console.log(notifications);

  return (
    <>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-1 cursor-pointer">
              <span className="bg-white/10 hover:bg-white/40 hover:text-black cursor-pointer  rounded-full p-2">
                Read all
              </span>
            </TableHead>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="text-center">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications?.userNotis &&
            notifications.userNotis.length > 0 &&
            notifications.userNotis.map((item) => (
              <TableRow
                onClick={() => {
                  handleGetNotificationById(
                    item?.Notification?.id,
                    user?.account?.id,
                  );
                  setShowNoti(true);
                }}
                className={`cursor-pointer hover:!bg-white/40 ${!item?.isRead ? `text-white/30` : ``} `}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckedNotis(item?.Notification?.id);
                      }}
                      checked={checkedNotis.includes(item?.Notification?.id)}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <img
                    className="w-10 h-10 object-cover"
                    src={`${import.meta.env.VITE_BACKEND_URL}${item?.Notification?.image}`}
                    alt=""
                  />
                </TableCell>
                <TableCell>{item?.Notification?.title}</TableCell>
                <TableCell>{item?.Notification?.content}</TableCell>
                <TableCell className="text-center">
                  {formatDate(item?.Notification?.createdAt)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <DialogNotification
        show={showNoti}
        setShow={setShowNoti}
        notiData={notificationById}
        setNotiData={setNotificationById}
      />
    </>
  );
};
