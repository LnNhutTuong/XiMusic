import React, { createContext, useEffect, useState } from "react";
import { getUserAccount } from "../services/auth/accountService";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "@/services/auth/authService";
import { getNotifications } from "@/services/notification/notificationService";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoadingAuth: true,
    isAuthenticated: false,
    token: "",
    account: {},
  });

  const navigate = useNavigate();

  const loginContext = (userData) => {
    setUser({ ...userData, isLoadingAuth: false });
  };

  const logoutContext = async () => {
    await handleLogout();
    setUser({
      isLoadingAuth: false,
      isAuthenticated: false,
      token: "",
      account: {},
    });
    navigate("/");
  };

  const fetchUser = async () => {
    try {
      let res = await getUserAccount();
      if (res && res.EC === 0) {
        let data = {
          isLoadingAuth: false,
          isAuthenticated: true,
          token: res.DT.access_token,
          account: {
            id: res.DT.id,
            email: res.DT.email,
            displayName: res.DT.displayName,
            avatar: res.DT.avatar,
            groupWithRoles: res.DT.groupWithRoles,
          },
        };
        setTimeout(() => {
          setUser(data);
        }, 2200);
      } else {
        setUser({
          isLoadingAuth: false,
          isAuthenticated: false,
          token: "None",
          account: {},
        });
      }
    } catch (error) {
      console.log("fetchUser error");

      setUser({
        isLoadingAuth: false,
        isAuthenticated: false,
        token: "Error Fetch",
        account: {},
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const UpdateUserAccount = (newFields) => {
    setUser((prev) => ({
      ...prev,
      account: { ...prev.account, ...newFields },
    }));
  };

  const updateUserGroup = (newGroup) => {
    setUser((prev) => ({
      ...prev,
      account: { ...prev.account, groupWithRoles: newGroup },
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginContext,
        logoutContext,
        fetchUser,
        UpdateUserAccount,
        updateUserGroup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
