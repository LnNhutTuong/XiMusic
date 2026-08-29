import { useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import _ from "lodash";
import { useState } from "react";
import { UserContext } from "@/context/userContext";

const AdminRoute = (props) => {
  const { user } = useContext(UserContext);

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.account.groupWithRoles.id !== 1) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
