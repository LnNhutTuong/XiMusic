import { useContext} from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "@/context/userContext";
const PublicRoutes = () => {
  const { user } = useContext(UserContext);

  return !user?.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
