import SidebarAdmin from "../components/Admin/Sidebar";
import { Outlet } from "react-router-dom";
const AdminPage = () => {
  return (
    <>
      <div className="flex gap-4 mt-5 h-[calc(100%-30px)] px-4 overflow-hidden ">
        <SidebarAdmin />
        <div className="flex-1 bg-white/20 rounded-xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
