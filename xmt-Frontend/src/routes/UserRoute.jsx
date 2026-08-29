import { UserContext } from "@/context/userContext";
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
const UserRoute = () => {
  const { user } = useContext(UserContext);

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if (user.account.groupWithRoles.id !== 1) {
  //   return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default UserRoute;
