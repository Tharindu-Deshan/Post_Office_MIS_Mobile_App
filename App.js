import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation";
import AuthContext from "./App/context/AuthContext";
import LoginScreen from "./App/Screens/LoginPage/LoginScreen";





export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, handleLogin, handleLogout}}>
      
        <NavigationContainer>
          {isLoggedIn ? (
            <TabNavigation />
          ) : (
           <LoginScreen/>
          )}
        </NavigationContainer>
      
    </AuthContext.Provider>
  );
}



