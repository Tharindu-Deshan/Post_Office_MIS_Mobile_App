// AuthContext.js
import { createContext, useState , useEffect } from "react";

const AuthContext = createContext({
  isLoggedIn: true,
  userId: null,
  userName: null,
  handleLogin: () => {},
  handleLogout: () => {},
  deliveryDetails: null, 
  setDeliveryDetails: () => {},
  
});

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(4);
  const [userName, setUserName] = useState("Tharindu");
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  


  const handleLogin = (userId, userName) => {
 
    setIsLoggedIn(true);
    setUserId(userId);
    setUserName(userName);
  };

  useEffect(() => {
    console.log(isLoggedIn)
  }, [isLoggedIn])

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
  };

  

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, userName, handleLogin, handleLogout , setIsLoggedIn, setUserId, setUserName , deliveryDetails , setDeliveryDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
