import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.includes("/private")
    ? "private"
    : "public";

  const handleChangeTab = (value) => {
    if (value === "public") {
      navigate("/profile/notifications");
    } else {
      navigate("/profile/notifications/private");
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleChangeTab}>
        <TabsList variant="line" className="mt-3 ms-2">
          <TabsTrigger value="public">Public Noti</TabsTrigger>
          <TabsTrigger value="private">User Noti</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Notification;
