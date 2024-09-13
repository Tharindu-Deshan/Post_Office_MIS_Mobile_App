import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import TabNavigation from "./App/Navigations/TabNavigation";
import  {
  AuthContextProvider,
} from "./App/context/AuthContextProvider";
// import LoginScreen from "./App/Screens/LoginPage/LoginScreen";
import LoginChild from "./LoginChild";

export default function App() {

  

  // const [userId, setUserId] = useState("4"); //setUserId method stores the userid in that
  // const [deliveryDetails, setDeliveryDetails] = useState(null);
  // const [userName, setUserName] = useState("tharindu");

 

  return (
    <AuthContextProvider>
      <LoginChild/>
    </AuthContextProvider>
  );
}
