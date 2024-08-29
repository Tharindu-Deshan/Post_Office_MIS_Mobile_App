import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation";
import AuthContext, {
  AuthContextProvider,
} from "./App/context/AuthContextProvider";
import LoginScreen from "./App/Screens/LoginPage/LoginScreen";

export default function App() {

  const { isLoggedIn} = useContext(AuthContext)

  // const [userId, setUserId] = useState("4"); //setUserId method stores the userid in that
  // const [deliveryDetails, setDeliveryDetails] = useState(null);
  // const [userName, setUserName] = useState("tharindu");

  useEffect(() => {

    console.log("logged in" , isLoggedIn);

    //check cookies 
    


  } , [isLoggedIn])

  return (
    <AuthContextProvider>
      <NavigationContainer>
        {isLoggedIn ? <TabNavigation /> : <LoginScreen />}
      </NavigationContainer>
    </AuthContextProvider>
  );
}
