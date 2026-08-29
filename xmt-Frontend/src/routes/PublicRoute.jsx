import { useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import _ from "lodash";
import { useState } from "react";
import { UserContext } from "@/context/userContext";
const PublicRoutes = (props) => {
  const { user } = useContext(UserContext);

  return !user?.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
