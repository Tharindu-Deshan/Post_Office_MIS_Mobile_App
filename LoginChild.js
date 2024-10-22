// import { View, Text } from 'react-native'

import React, { useContext, useEffect } from "react";
import AuthContext from "./App/context/AuthContextProvider";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation";
import LoginScreen from "./App/Screens/LoginPage/LoginScreen";

export default function LoginChild() {
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    
  }, [isLoggedIn]);
  return (
    <NavigationContainer>
      {isLoggedIn ? <TabNavigation /> : <LoginScreen />}
    </NavigationContainer>
  );
}
