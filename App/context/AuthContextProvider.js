// AuthContext.js
import { createContext, useState , useEffect } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userName: null,
  email: null,
  handleLogin: () => {},
  handleLogout: () => {},
  deliveryDetails: null,
  setDeliveryDetails: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [email, setEmail] = useState("");

  const handleLogin = (username, postmanId, email) => {
    setIsLoggedIn(true);
    setUserId(postmanId);
    setUserName(username);
    setEmail(email);
  };

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        userName,
        email,
        handleLogin,
        handleLogout,
        setIsLoggedIn,
        setUserId,
        setUserName,
        deliveryDetails,
        setDeliveryDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
