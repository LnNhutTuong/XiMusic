import SidebarUser from "@/components/User/Sidebar";
import { Outlet } from "react-router-dom";
const UserPage = () => {
  return (
    <>
      <div className="flex gap-4 mt-5 h-[calc(100%-30px)] mx-50 overflow-hidden ">
        <SidebarUser />
        <div className="flex-1 bg-white/20 rounded-xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserPage;
