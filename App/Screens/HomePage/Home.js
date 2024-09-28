import { API_BASE_URL } from "@env";
import { APP_PORT } from "@env";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CommonLayout from "../../Components/commonLayout/CommonLayout";

import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// im??port Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from "@expo/vector-icons/Entypo";
import AuthContext from "../../context/AuthContextProvider";
import { getStartDutyStatus } from "../../Services/StorageService";

const backgroundimage = require("../HomePage/e03b2bf1-678e-49f1-998d-d5b03fb09a99.webp");

export default function Home({ navigation }) {
  const tabnavigation = useNavigation();
  // const [status, setStatus] = useState("");
  // const [name, setName] = useState("Tharindu");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId, email, userName, setDeliveryDetails, deliveryDetails } =
    useContext(AuthContext);

  const [noDeliveryObjectFetched, setNoDeliveryObjectFetched] = useState("");
  const isDisabled =
    deliveryDetails?.status === "Completed" ||
    deliveryDetails?.status === "Not Assigned" ||
    noDeliveryObjectFetched === "Not Assigned";
  // getting postman data
  // LOG  Postman
  // LOG  logged in true
  // LOG  true
  // LOG  Request successful

  // const getPostmanData = async () => {
  //   // console.log("getting postman data");
  //   try {
  //     const response = await axios.get(
  //       `http://192.168.83.191:8081/api/postman/route-display/get-delivery?postmanId=${userId}`
  //     );
  //     //connected usb --> ipconfig -->ipv4-->192.168.83.191
  //     //emu -->10.0.2.2

  //     if (response.status === 200) {
  //       // Check if the response body is "1" which means no delivery object
  //       if (response.data === 1) {
  //         console.log("No delivery assigned to this postman");
  //         setNoDeliveryObjectFetched("Not Assigned");
  //         setDeliveryDetails(null); // Clear delivery details since none exist
  //       } else {
  //         console.log("Request successful");
  //         setDeliveryDetails(response.data); // Set the valid delivery object
  //         setNoDeliveryObjectFetched(""); // Clear the no-delivery message
  //       }
  //     } else {
  //       console.error(`Error: Received status ${response.status}`);
  //       setNoDeliveryObjectFetched("Not Assigned");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching postman data", error.message);
  //     setNoDeliveryObjectFetched("Not Assigned");
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getPostmanData = async () => {
    console.log("LOG ", "Postman");
    try {
      const url = `${API_BASE_URL}:${APP_PORT}/api/postman/route-display/get-delivery?postmanId=4`;
      const x= await  getStartDutyStatus();
      console.log("LOG..... ", x);
      const response = await axios.get(
        url
      );

      // If the response is successful (200), set the delivery details
      if (response.status === 200) {
        console.log("Request successful");
        setDeliveryDetails(response.data); // Set the valid delivery object
        setNoDeliveryObjectFetched(""); // Clear the no-delivery message
      }
    } catch (error) {
      // Handle the 404 error when no delivery is found
      if (error.response && error.response.status === 404) {
        console.log("No delivery assigned to this postman");
        setNoDeliveryObjectFetched("Not Assigned");
        setDeliveryDetails(null); // Clear delivery details since none exist
      } else {
        // Handle other errors (e.g., network issues, server errors)
        console.error("Error fetching postman data", error.message);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostmanData();
   
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <CommonLayout>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={backgroundimage} // Replace with actual user profile image
            style={styles.profileImage}
          />
          <Text style={styles.welcomeMessage}>Welcome, {userName}!</Text>
          <Text style={styles.subWelcomeMessage}> Email: {email}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Current Status:{" "}
            {deliveryDetails?.status || noDeliveryObjectFetched || "Pending"}
          </Text>
        </View>

        <View style={styles.blockContainer}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.buttonBlock}
              onPress={() => navigation.navigate("BarCodeScanner")}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={60}
                color="#fff"
              />
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>

            {/* //------------------------------------------------------------------------------------------------------------------- */}

            <TouchableOpacity
              style={[
                styles.buttonBlock,
                isDisabled && styles.disabledButtonExpolreMap,
              ]} // Apply conditional opacity
              disabled={isDisabled}
              onPress={() => tabnavigation.navigate("ViewDeliveryPage")}
            >
              <MaterialCommunityIcons
                name="map-marker-multiple"
                size={60}
                color="#fff"
              />
              <Text style={styles.buttonText}>Explore Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.buttonBlock}
              onPress={() => navigation.navigate("AddPerson")}
            >
              <Ionicons name="person-add" size={60} color="#fff" />
              <Text style={styles.buttonText}>Add Person</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBlock}
              onPress={() => navigation.navigate("AddAddress")}
            >
              <Entypo name="new-message" size={60} color="#fff" />
              <Text style={styles.buttonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    backgroundColor: "#f0f8ff",
    justifyContent: "space-between",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 35,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeMessage: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4a4a4a",
  },
  subWelcomeMessage: {
    fontSize: 16,
    color: "#7a7a7a",
  },
  statusContainer: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 15,
    borderColor: "#f57c00",
    borderWidth: 2,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  blockContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  buttonBlock: {
    width: "45%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6200ee",
    borderRadius: 15,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "bold",
  },
  disabledButtonExpolreMap: {
    opacity: 0.5,
  },
});
