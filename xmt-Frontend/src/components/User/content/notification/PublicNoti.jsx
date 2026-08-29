import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/utils/timeUtils";

import { useContext, useState } from "react";
import { NotificationContext } from "@/context/notificationContext";

import { UserContext } from "@/context/userContext";

import { DialogNotification } from "./DialogNotification";

export const PublicNoti = (props) => {
  const {
    notifications,

    notificationById,
    setNotificationById,

    handleGetNotificationById,
  } = useContext(NotificationContext);

  const { user } = useContext(UserContext);

  const [showNoti, setShowNoti] = useState(false);
  return (
    <>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-1 cursor-pointer">
              <span className="bg-white/10 hover:bg-white/60 hover:text-black rounded-full p-2">
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
          {notifications?.publicNotis &&
            notifications.publicNotis.length > 0 &&
            notifications.publicNotis.map((item) => (
              <TableRow
                onClick={() => {
                  handleGetNotificationById(item?.id, user?.account?.id);
                  setShowNoti(true);
                }}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Checkbox />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <img
                    className="w-10 h-10 object-cover"
                    src={
                      item?.image
                        ? `${import.meta.env.VITE_BACKEND_URL}${item?.image}`
                        : ""
                    }
                    alt=""
                  />
                </TableCell>
                <TableCell>{item?.title}</TableCell>
                <TableCell>{item?.content}</TableCell>
                <TableCell className="text-center">
                  {formatDate(item?.createdAt)}
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
