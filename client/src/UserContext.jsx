import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({}); // Initialize the user data state

  const updateUser = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData })); // Merge the new data with the existing user data
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
