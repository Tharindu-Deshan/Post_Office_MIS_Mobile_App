import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation";
import AuthContext from "./App/context/AuthContext";
import LoginScreen from "./App/Screens/LoginPage/LoginScreen";





export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userId,setUserId] = useState("4");  //setUserId method stores the userid in that
  const [deliveryDetails,setDeliveryDetails] = useState(null);
  const [userName,setUserName] = useState("tharindu");

  const handleLogin = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };


  return (
    <AuthContext.Provider value={{isLoggedIn,userId,userName, deliveryDetails,handleLogin, handleLogout}}>
      
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



