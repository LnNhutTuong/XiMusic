import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";

import _ from "lodash";
import AppRoutes from "./routes/AppRoute";
import { useContext, useEffect, useState } from "react";
import Nav from "./components/Navigation/Nav";
import { UserContext } from "./context/userContext";
import { PlayerContext } from "./context/musicContext";
import { Triangle } from "react-loader-spinner";
import PlayerBar from "./components/Home/PlayerBar";

const App = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && user.isLoadingAuth ? (
        <>
          <div className="flex justify-center items-center h-screen">
            <Triangle
              visible={true}
              height="220"
              width="220"
              color="#000000"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </>
      ) : (
        <div className="app-container h-screen flex flex-col">
          <div className="app-header">
            <Nav />
          </div>
          <div className="app-content flex-1 overflow-hidden pb-23">
            <AppRoutes />
          </div>
          <PlayerBar />
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default App;
