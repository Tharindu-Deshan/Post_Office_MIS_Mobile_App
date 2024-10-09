import React, { useContext, useRef, useState } from "react";
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
  Vibration,
  Modal,
} from "react-native";
import AuthContext from "../../context/AuthContextProvider";
import TabNavigation from "../../Navigations/TabNavigation";
import axios from "axios";
import LoginFailedModal from "./LoginFailedModal";

// Import the local image
const backgroundImage = require("../LoginPage/07cfeb9c-421d-4ae1-b95f-73c60c97efbb.jpg");

const LoginScreen = () => {
  const { handleLogin, isLoggedIn } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);

  const openAlert = () => {
    setModalVisible(true);
  };

  const closeAlert = () => {
    setModalVisible(false);
  };

  const passwordRef = useRef(null);

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
      const url = `${API_BASE_URL}:${APP_PORT}/mobile/authenticate`;
      console.log(API_BASE_URL);
      console.log(APP_PORT);
      console.log(email, password);
      const response = await axios.post(url, {
        username: email,
        password: password,
      });

      if (response.status === 200) {
        const { username, postmanId, email, token } = response.data;
        console.log("Authentication successful");

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("postmanId", postmanId);

        handleLogin(username, postmanId, email); // Trigger login callback to update isLoggedIn state
      } else {
        alert("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      // console.error("Error authenticating user", error.message);
      // alert("Incorrect Password or Email.");//
      openAlert();
      Vibration.vibrate(500);
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
                returnKeyType="next" // Set return key type to "next"
                onSubmitEditing={() => passwordRef.current.focus()}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                ref={passwordRef} // Set ref to password TextInput
                returnKeyType="go" // Set return key type to "done"
                onSubmitEditing={authenticateUser}
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

              {/* <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={closeAlert}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.alertBox}>
                    <Text style={styles.alertText}>
                      Login Failed!
                    </Text>
                    <TouchableOpacity
                      style={styles.alertButton}
                      onPress={closeAlert}
                    >
                      <Text style={styles.alertButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal> */}
              <LoginFailedModal
                closeAlert={closeAlert}
                visible={modalVisible}
              />

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

  //modal
  modalOverlay: {
    flex: 1, // takes up the whole screen
    justifyContent: "center", // center the alert vertically
    alignItems: "center", // center the alert horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  alertBox: {
    width: 300, // set a fixed width for the alert box
    padding: 20, // padding inside the alert box
    backgroundColor: "#fff", // white background for the alert
    borderRadius: 10, // rounded corners
    alignItems: "center", // center content inside the box
  },
  alertText: {
    fontSize: 18, // text size
    marginBottom: 20, // space below the text
    textAlign: "center", // center the text horizontally
  },
  alertButton: {
    padding: 10, // padding inside the button
    backgroundColor: "#007bff", // button background color
    borderRadius: 8, // rounded button corners
    width: "100%", // button takes full width of the alert box
    alignItems: "center", // center the text inside the button
  },
  alertButtonText: {
    color: "#fff", // white text color
    fontSize: 16, // text size inside the button
  },
});

export default LoginScreen;
