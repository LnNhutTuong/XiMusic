import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

import Admin from "@/pages/Admin";
import Dashboard from "../components/Admin/Content/Dashboard";
import ManagerNoti from "../components/Admin/Content/Notification/ListNotification";
import ManagerUser from "../components/Admin/Content/User/ListUserWithPagination";
import ManagerGenre from "../components/Admin/Content/Music/Genre/ListGenreWithPagination";
import ManageAlbum from "../components/Admin/Content/Music/Album/ListAlbum";
import ManageSong from "../components/Admin/Content/Music/Song/ListSongWithPagination";

import UserPage from "@/pages/User";
import { Profile } from "@/components/User/content/Profile";
import Notification from "@/components/User/content/notification/Notification";
import { PublicNoti } from "@/components/User/content/notification/PublicNoti";
import { PrivateNoti } from "@/components/User/content/notification/PrivateNoti";

import Home from "@/pages/Home";

import PrivateRoutes from "./AdminRoute";
import PublicRoutes from "./PublicRoute";
import UserRoutes from "./UserRoute";

const AppRoutes = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* private route */}
        <Route element={<PrivateRoutes />}>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="notification" element={<ManagerNoti />} />
            <Route path="users" element={<ManagerUser />} />
            <Route path="genre" element={<ManagerGenre />} />
            <Route path="album" element={<ManageAlbum />} />
            <Route path="song" element={<ManageSong />} />
          </Route>
        </Route>

        {/* Auth */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<UserRoutes />}>
          <Route path="/profile" element={<UserPage />}>
            <Route index element={<Profile />} />
            <Route path="notifications" element={<Notification />}>
              <Route index element={<PublicNoti />} />
              <Route path="private" element={<PrivateNoti />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
