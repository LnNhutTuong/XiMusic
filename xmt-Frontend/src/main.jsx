import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider, UserContext } from "./context/userContext";
import { NotificationProvider } from "./context/notificationContext";
import { PlayerProvider } from "./context/musicContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <UserProvider>
      <NotificationProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </NotificationProvider>
    </UserProvider>
  </BrowserRouter>,
  // </StrictMode>,
);
