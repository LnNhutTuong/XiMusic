import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavLink, useLocation } from "react-router-dom";
const SidebarAdmin = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
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
                  <div className="w-full flex items-center justify-between px-1 border-b">
                    <p>XimenT</p>
                  </div>
                </div>
              </div>
            </Menu>
          </div>

          <div className="flex-1 overflow-y-auto mt-4">
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
              <MenuItem
                component={<NavLink to="/admin" />}
                active={isActive("/admin")}
                className="font-medium"
              >
                Dashboard
              </MenuItem>

              <MenuItem
                component={<NavLink to="/admin/notification" />}
                active={isActive("/admin/notification")}
                className="font-medium"
              >
                Notifications
              </MenuItem>

              <MenuItem
                component={<NavLink to="/admin/users" />}
                active={isActive("/admin/users")}
                className="font-medium"
              >
                Manager Users
              </MenuItem>

              <SubMenu
                label="Manager Music"
                rootStyles={{
                  "& .ps-submenu-content": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    paddingLeft: "20px",
                    // margin: "0px 10px ",
                  },
                }}
              >
                <MenuItem
                  component={<NavLink to="/admin/genre" />}
                  active={isActive("/admin/genre")}
                  className="font-medium"
                >
                  Genre
                </MenuItem>
                <MenuItem
                  component={<NavLink to="/admin/album" />}
                  active={isActive("/admin/album")}
                  className="font-medium"
                >
                  Album
                </MenuItem>
                <MenuItem
                  component={<NavLink to="/admin/song" />}
                  active={isActive("/admin/song")}
                  className="font-medium"
                >
                  Song
                </MenuItem>
              </SubMenu>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default SidebarAdmin;
