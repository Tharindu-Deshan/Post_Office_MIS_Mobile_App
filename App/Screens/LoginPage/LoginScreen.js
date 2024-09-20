import React, { useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";
import { APP_PORT } from "@env";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AuthContext from "../../context/AuthContextProvider";
import TabNavigation from "../../Navigations/TabNavigation";
import axios from "axios";

// Import the local image
const backgroundImage = require("../LoginPage/07cfeb9c-421d-4ae1-b95f-73c60c97efbb.jpg");

const LoginScreen = () => {
  const { handleLogin, isLoggedIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const authenticateUser = async () => {
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}:${APP_PORT}/mobile/authenticate`,
        {
          username: email,
          password: password,
        }
      );

      if (response.status === 200) {
        const { username, postmanId, email, token } = response.data;
        console.log("Authentication successful");

        await AsyncStorage.setItem("userToken", token);

        handleLogin(username, postmanId, email); // Trigger login callback to update isLoggedIn state
      } else {
        alert("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error authenticating user", error.message);
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <TabNavigation />
      ) : (
        <View style={styles.container}>
          <ImageBackground source={backgroundImage} style={styles.image}>
            <View style={styles.loginContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.subText}>Login to your account</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={authenticateUser}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
  },
  loginContainer: {
    backgroundColor: "#ffffff", // Fully opaque white
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 400, // Adjust as needed
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2, // Thickness of the border
    borderColor: "#d3d3d3", // Color of the border
  },
  loginButton: {
    backgroundColor: "#6a2392",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignItems: "center",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#666",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
