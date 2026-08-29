import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaPlus,
  FaExpandAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { LuListMusic } from "react-icons/lu";
import { GrSort } from "react-icons/gr";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const LibrarySidebar = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const { user } = useContext(UserContext);
  const handleScroll = (direction) => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      const scrollAmount = direction === "left" ? -150 : 150;
      container.scrollLeft += scrollAmount;
    }
  };

  return user && user.isAuthenticated ? (
    <div className="w-fit h-[calc(100%-30px)] bg-white/10 rounded-xl overflow-hidden transition-all duration-300">
      <Sidebar
        collapsed={collapsed}
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
                <button
                  className="cursor-pointer p-1 text-white/60 hover:text-white rounded text-white h-full"
                  onClick={() => setCollapsed((c) => !c)}
                >
                  <LuListMusic size={44} />
                </button>
                <div
                  style={{ fontWeight: 700, fontSize: 18 }}
                  className="w-full"
                >
                  {!collapsed && (
                    <div className="w-full flex items-center justify-between px-1">
                      <span>Your library</span>
                      <div className="flex gap-1">
                        <button className="p-2 rounded-2xl bg-white/20 text-white/60 hover:text-white">
                          <FaPlus />
                        </button>
                        <button className="p-2 rounded-2xl text-white/60 hover:text-white hover:bg-white/20">
                          <FaExpandAlt />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Menu>
          </div>

          {collapsed && (
            <>
              <div className=" flex-1 min-h-0 w-full flex items-center justify-center flex-col gap-3">
                <div className="text-2xl">
                  <button className="p-2 rounded-2xl bg-white/20 text-white/60 hover:text-white">
                    <FaPlus />
                  </button>
                </div>
                <div className="overflow-y-auto flex flex-col gap-2 px-2 pb-4 scrollbar-none">
                  {[...Array(20)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-white/5 shrink-0 rounded-lg"
                    >
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                        <img
                          src="https://picsum.photos/60"
                          className="w-12 h-12 rounded-md object-cover"
                          alt="avatar"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* --- cat go ri --- */}
          {!collapsed && (
            <div className="relative group px-4 my-2 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaChevronLeft size={12} />
              </button>

              <div
                id="category-scroll-container"
                className="overflow-x-auto scrollbar-none scroll-smooth w-full"
              >
                <div className="flex gap-2 w-max pb-1 text-sm">
                  {[
                    "Playlist",
                    "Albums",
                    "PodCasts",
                    "Artists",
                    "Downloaded",
                  ].map((item) => (
                    <button
                      key={item}
                      className="border border-white/40 hover:border-white rounded-xl px-3 py-1 bg-white/5 whitespace-nowrap"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          )}

          {/*phiuter va search */}
          {!collapsed && (
            <div className="flex gap-3 p-4 my-2 justify-center items-center shrink-0">
              <div className="w-full flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-body"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="search"
                    className="block w-full p-2 ps-9 bg-zinc-800 border border-white/10 rounded-xl text-sm focus:ring-brand focus:border-brand shadow-xs"
                    placeholder="....."
                    required
                  />
                  <button
                    type="button"
                    className="absolute end-1.5 bottom-0.5 text-white bg-brand hover:bg-brand-strong box-border border border-transparent font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div>
                <button className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white">
                  <GrSort />
                </button>
              </div>
            </div>
          )}

          {/* your library */}
          {!collapsed && (
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 px-2 pb-4 scrollbar-none">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="border border-white/5 shrink-0 rounded-lg"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                    <img
                      src="https://picsum.photos/60"
                      className="w-12 h-12 rounded-md object-cover"
                      alt="avatar"
                    />
                    <div>
                      <p className="text-sm font-medium">Haisam {index + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  ) : (
    <div className="w-fit h-[calc(100%-30px)] bg-white/10 rounded-xl overflow-hidden transition-all duration-300">
      <Sidebar
        collapsed={collapsed}
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
                <button
                  className="cursor-pointer p-1 text-white/60 hover:text-white rounded text-white h-full"
                  onClick={() => setCollapsed((c) => !c)}
                >
                  <LuListMusic size={44} />
                </button>
                <div
                  style={{ fontWeight: 700, fontSize: 18 }}
                  className="w-full"
                >
                  {!collapsed && (
                    <div className="w-full flex items-center justify-between px-1">
                      <span>Your library</span>
                    </div>
                  )}
                </div>
              </div>
            </Menu>
          </div>

          {collapsed && (
            <>
              <div className=" flex-1 min-h-0 w-full flex items-center justify-center flex-col gap-3">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4 mb-22">
                  <button
                    className="bg-white/20 rounded-2xl px-2 py-3 text-white/60 hover:text-white cursor-pointer"
                    onClick={() => {
                      {
                        handleLogin();
                      }
                    }}
                  >
                    <p className="[writing-mode:vertical-lr] rotate-180 text-center font-medium tracking-wide">
                      Login
                    </p>
                  </button>
                  <p className="[writing-mode:vertical-lr] rotate-180 text-center font-medium tracking-wide">
                    Login to make your library
                  </p>
                </div>
              </div>
            </>
          )}

          {/* your library */}
          {!collapsed && (
            <div className="flex justify-center flex-col items-center gap-2 ">
              <p>Login to make you library</p>
              <button
                className="bg-white/20 rounded-2xl px-3 py-2 text-white/60 hover:text-white cursor-pointer"
                onClick={() => {
                  {
                    handleLogin();
                  }
                }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
};

export default LibrarySidebar;
