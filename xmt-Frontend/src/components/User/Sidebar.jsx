import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavLink, useLocation } from "react-router-dom";

const SidebarUser = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/profile") {
      return location.pathname === "/profile";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white/20 rounded-xl">
      <Sidebar
        rootStyles={{
          backgroundColor: "transparent",
          border: "none",
          height: "100%",
          overflow: "hidden",
          "& .ps-sidebar-container": {
            backgroundColor: "transparent !important",
            display: "flex !important",
            flexDirection: "column !important",
            height: "100% !important",
          },
        }}
      >
        <div className="flex flex-col h-full overflow-hidden w-full text-white">
          {/* header: co lap, open, create new*/}
          <div className="shrink-0">
            <Menu
              menuItemStyles={{
                button: {
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1) !important",
                  },
                },
              }}
              rootStyles={{ border: "none" }}
            >
              <div className="flex items-center justify-between p-4 text-white">
                <div
                  style={{ fontWeight: 700, fontSize: 18 }}
                  className="w-full"
                >
                  <div className="w-full flex items-center justify-between px-1 pb-1 border-b">
                    <p>Hi, Skibidi</p>
                  </div>
                </div>
              </div>
            </Menu>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Menu
              menuItemStyles={{
                button: {
                  backgroundColor: "transparent",
                  borderRadius: "12px",
                  margin: "4px 12px",
                  padding: "0 16px",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                  },

                  "&.ps-active": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <div className="mb-4">
                <h1 className="text-md px-2 text-white/40 drop-shadow-[0_1px_0.1px_rgba(255,255,255,0.5)]">
                  Profile
                </h1>
                <MenuItem
                  component={<NavLink to="/profile" />}
                  active={isActive("/profile")}
                  className="font-medium"
                >
                  Edit Profile
                </MenuItem>
                <MenuItem
                  component={<NavLink to="/profile/notifications" />}
                  active={isActive("/profile/notifications")}
                  className="font-medium"
                >
                  Notifications
                </MenuItem>
              </div>
              <div className="mb-4">
                <h1 className="text-md px-2 text-white/40 drop-shadow-[0_1px_0.1px_rgba(255,255,255,0.5)]">
                  Secure
                </h1>
                <MenuItem
                  component={<NavLink to="/secure/password" />}
                  active={isActive("/secure/password")}
                  className="font-medium"
                >
                  Password
                </MenuItem>
              </div>

              <button className="font-medium text-red-400 bg-red-400/30 p-1 mx-11 rounded-xl">
                Delete your account
              </button>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default SidebarUser;
