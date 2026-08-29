import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { UserContext } from "@/context/userContext";
import { NotificationContext } from "@/context/notificationContext";
import { IoMdHome } from "react-icons/io";
import defaultAvatar from "../../assets/static/users/default_image.svg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaBell } from "react-icons/fa";
import { MdPublic } from "react-icons/md";
import { RiChatPrivateFill } from "react-icons/ri";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDate } from "@/utils/timeUtils";

import { DialogNotification } from "../User/content/notification/DialogNotification";

const Nav = (props) => {
  const { user, logoutContext } = useContext(UserContext);
  const {
    notifications,
    unreadCount,

    handleGetNotificationById,

    notificationById,
    setNotificationById,

    markAllPublicAsRead,
  } = useContext(NotificationContext);

  const navigate = useNavigate();

  const [showNoti, setShowNoti] = useState(false);

  const handleLogout = async () => {
    await logoutContext();
    localStorage.removeItem("jwt");
  };

  const handleShowNoti = () => {
    setShowNoti(true);
  };

  return (
    <nav className="bg-none text-white px-22 py-4 border-b border-white/20">
      <div className="flex items-center justify-between">
        {/* XimenT */}
        <h1 className="text-xl font-bold ximent flex-1">XiMusic</h1>

        {/* search bar */}
        <div class="h-max flex-1 flex items-center justify-center gap-1">
          <NavLink
            to="/"
            end
            className="bg-white/30 p-2 rounded-xl text-3xl flex items-center justify-center"
          >
            {({ isActive }) => (
              <IoMdHome
                className={
                  isActive ? "text-white" : "text-black hover:text-white"
                }
              />
            )}
          </NavLink>
          <div className="w-full">
            <label
              for="search"
              class="block mb-2.5 text-sm font-medium text-heading sr-only "
            >
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-body"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                class="block w-full p-3 ps-9 bg-neutral-secondary-medium bg-white/30 rounded-xl text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                placeholder="Search"
                required
              />
              <button
                type="button"
                class="absolute end-1.5 bottom-1.5 text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <ul className="flex gap-4 flex-1 justify-end items-center">
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 flex items-center justify-center cursor-pointer"
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5 transition-transform duration-200 hover:rotate-12" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 max-h-[450px] overflow-y-auto bg-black/40 backdrop-blur-md border border-white/10 text-white p-2 rounded-xl shadow-xl backdrop-blur-md"
              >
                <DropdownMenuLabel
                  className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 px-2 py-1.5 cursor-pointer hover:underline"
                  onClick={() => navigate("/profile/notifications")}
                >
                  <MdPublic className="text-blue-400" /> Public Notifications
                </DropdownMenuLabel>

                {notifications?.publicNotis &&
                notifications.publicNotis.length > 0 ? (
                  notifications.publicNotis.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className="p-2.5 rounded-lg hover:!cursor-pointer flex flex-col items-start gap-1 outline-none transition-colors group"
                      onClick={() => {
                        handleShowNoti();
                        handleGetNotificationById(item.id, user?.account?.id);
                      }}
                    >
                      {item.image && (
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/${item.image}`}
                          alt={item.title}
                          className="w-24 h-24 object-cover"
                        />
                      )}
                      <span className="text-sm font-medium text-inherit">
                        {item.title}
                      </span>
                      {item.createdAt && (
                        <span className="text-xs text-slate-400">
                          {formatDate(item.createdAt)}
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 px-2 py-2 italic flex items-center gap-2">
                    Không có thông báo chung
                  </div>
                )}

                <DropdownMenuSeparator className="bg-white/10 my-1" />
                {user.isAuthenticated ? (
                  <>
                    <DropdownMenuLabel
                      className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 px-2 py-1.5 cursor-pointer hover:underline"
                      onClick={() => {
                        navigate("/profile/notifications/private");
                      }}
                    >
                      <RiChatPrivateFill className="text-blue-400 cursor-pointer hover:underline" />{" "}
                      Your Notifications
                    </DropdownMenuLabel>

                    {notifications?.userNotis &&
                    notifications.userNotis.length > 0 ? (
                      notifications.userNotis.map((item, index) => (
                        <DropdownMenuItem
                          key={item.id || index}
                          className="flex p-2.5 rounded-lg cursor-pointer flex-col items-start gap-1"
                          onClick={() => {
                            handleShowNoti();
                            handleGetNotificationById(
                              item?.Notification?.id,
                              user?.account?.id,
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {item?.Notification?.image && (
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}${item?.Notification?.image}`}
                                alt="image notification"
                                className="w-8 h-8 object-cover rounded-full bg-white/10 hover:bg-black/20 transition-all duration-200"
                              />
                            )}
                            <span className="text-sm font-medium text-white">
                              {item?.Notification?.title}
                            </span>
                          </div>
                          {item?.Notification?.createdAt && (
                            <span className="text-xs text-slate-400">
                              {formatDate(item?.Notification?.createdAt)}
                            </span>
                          )}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500 px-2 py-2 italic flex items-center gap-2">
                        No notifications for you
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-500 px-2 py-2 italic flex items-center gap-2">
                    Login to get notifications
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {user && !_.isEmpty(user) && user.isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 py-1.5 px-3 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-white/30 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      src={
                        user?.account?.avatar
                          ? `${import.meta.env.VITE_BACKEND_URL}/${user?.account?.avatar}`
                          : defaultAvatar
                      }
                      alt={user?.account?.displayName || "User avatar"}
                    />
                  </div>
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    {user.account.displayName}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-fit rounded-2xl bg-black/95 backdrop-blur-md border border-white/10 text-slate-200 shadow-xl"
                  align="end"
                >
                  <DropdownMenuGroup className="space-y-1">
                    {user?.account?.groupWithRoles?.id === 1 ? (
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                      >
                        <Link
                          to="/admin"
                          className="w-full block px-3 py-2 text-sm font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      user?.account?.groupWithRoles?.id === 2 && (
                        <DropdownMenuItem
                          asChild
                          className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                        >
                          <Link
                            to="/profile"
                            className="w-full block px-3 py-2 text-sm font-medium"
                          >
                            Artist Profile
                          </Link>
                        </DropdownMenuItem>
                      )
                    )}
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors"
                    >
                      <Link
                        to="/profile"
                        className="w-full block px-3 py-2 text-sm font-medium"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="my-1 bg-white/10" />

                  <DropdownMenuGroup className="space-y-1">
                    <DropdownMenuItem className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors px-3 py-2 text-sm font-medium">
                      Support
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLogout()}
                      className="rounded-xl focus:bg-red-500/20 text-red-400 focus:text-red-300 cursor-pointer transition-colors px-3 py-2 text-sm font-medium"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-slate-900"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-slate-900"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <DialogNotification
        show={showNoti}
        setShow={setShowNoti}
        notiData={notificationById}
        setNotiData={setNotificationById}
      />
    </nav>
  );
};
// };

export default Nav;
