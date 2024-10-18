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
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CommonLayout from "../../Components/commonLayout/CommonLayout";

import { useFocusEffect } from "@react-navigation/native";

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
  // const [currentIndex,setCurrentIndex]=useState(1);

  const {
    userId,
    email,
    userName,
    setDeliveryDetails,
    deliveryDetails,
    currentIndexContext,
  } = useContext(AuthContext);

  

  const [noDeliveryObjectFetched, setNoDeliveryObjectFetched] = useState("");
  const isDisabled =
    deliveryDetails?.status === "Completed" ||
    deliveryDetails?.status === "Not Assigned" ||
    noDeliveryObjectFetched === "Not Assigned";
  // getting postman data
  // LOG  Postman
  // LOG  logged in true
  // LOG  true
  //LOG  Request successful

  // const getPostmanData = async () => {
  //   // //console.log("getting postman data");
  //   try {
  //     const response = await axios.get(
  //       `http://192.168.83.191:8081/api/postman/route-display/get-delivery?postmanId=${userId}`
  //     );
  //     //connected usb --> ipconfig -->ipv4-->192.168.83.191
  //     //emu -->10.0.2.2

  //     if (response.status === 200) {
  //       // Check if the response body is "1" which means no delivery object
  //       if (response.data === 1) {
  //         //console.log("No delivery assigned to this postman");
  //         setNoDeliveryObjectFetched("Not Assigned");
  //         setDeliveryDetails(null); // Clear delivery details since none exist
  //       } else {
  //         //console.log("Request successful");
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
   

    try {
    ////console.log("User ID:", idd);  // Add this line

      // const url = `${API_BASE_URL}:${APP_PORT}/api/postman/route-display/get-delivery?postmanId=${userId}`;
      const url = `${API_BASE_URL}:${APP_PORT}/api/postman/route-display/get-delivery?postmanId=4`;
      console.log(url);
      const x = await getStartDutyStatus();
      //console.log("LOG..... ", x);
      const response = await axios.get(url);

      // If the response is successful (200), set the delivery details
      if (response.status === 200) {
        //console.log("Request successful");
        console.log(response.data);
        setDeliveryDetails(response.data); // Set the valid delivery object
        setNoDeliveryObjectFetched(""); // Clear the no-delivery message
      }
   
    } catch (error) {
      // Handle the 404 error when no delivery is found
      if (error.response && error.response.status === 404) {
        //console.log("No delivery assigned to this postman...");
        setNoDeliveryObjectFetched("Not Assigned");
        setDeliveryDetails(null); // Clear delivery details since none exi
      } else {
        setNoDeliveryObjectFetched("Not Assigned");

        // Handle other errors (e.g., network issues, server errors)
        // console.error("Error fetching postman data", error.message);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(userId){
      getPostmanData();
    }
   
  }, [userId]);

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
          <View style={{ marginTop: 50, marginBottom: 10 }}>
            <Text style={styles.statusText}>
              Current Status:{" "}
              {/* {deliveryDetails?.status || noDeliveryObjectFetched || "Pending"} */}
              {deliveryDetails?.status || noDeliveryObjectFetched}
            </Text>
          </View>
          {/* {deliveryDetails&&(<Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
            Remaining <View>{deliveryDetails.destinations.length-currentIndexContext}</View>
          </Text>)} */}
          {!isDisabled && deliveryDetails && (
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
            Remaining   :  {" "}
              <Text>
                {deliveryDetails.destinations.length - currentIndexContext}
              </Text>
            </Text>
          )}
        </View>

        {!deliveryDetails && <View style={styles.emptyContainer}></View>}

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
            testID="explore-map-button" 
              style={[
                styles.buttonBlock1,
                isDisabled && styles.disabledButtonExpolreMap,
              ]} // Apply conditional opacity
              disabled={isDisabled}
              onPress={() => tabnavigation.navigate("ViewDeliveryPage")}
            >
              <MaterialCommunityIcons
                name="map-marker-multiple"
                size={60}
                color="#000"
              />
              <Text style={styles.buttonText1}>Explore Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.buttonBlock1}
              onPress={() => navigation.navigate("AddPerson")}
            >
              <Ionicons name="person-add" size={60} color="#000" />
              <Text style={styles.buttonText1}>Add Person</Text>
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
  emptyContainer: {
    marginTop: 20,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f4f4f5",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,

    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingTop: 70,
    paddingBottom: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: "#000", // Adds shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5, // For Android devices
    // borderColor: "#ddd", // Light border for separation
    borderWidth: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2, // Adds a border around the image
    borderColor: "#e0e0e0", // Light border color
  },
  welcomeMessage: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff", // Darker gray for better contrast
    marginBottom: 5, // Adds spacing between the welcome message and email
  },
  subWelcomeMessage: {
    fontSize: 14,
    color: "#666", // Slightly darker gray for readability
    letterSpacing: 0.5, // Adds subtle spacing between letters for better readability
  },

  // profileContainer: {
  //   alignItems: "center",
  //   marginBottom: 20,
  //   marginTop: 15,
  //   backgroundColor: "#fff",
  //   padding: 30

  // },
  // profileImage: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 50,
  //   marginBottom: 10,
  // },
  // welcomeMessage: {
  //   fontSize: 28,
  //   fontWeight: "bold",
  //   color: "#4a4a4a",
  // },
  // subWelcomeMessage: {
  //   fontSize: 16,
  //   color: "#7a7a7a",
  // },
  // statusContainer: {
  //   backgroundColor: "#f57c00",
  //   padding: 15,
  //   borderRadius: 15,
  //   borderColor: "#f57c00",
  //   borderWidth: 2,
  //   marginBottom: 20,
  // },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  blockContainer: {
    padding: 35,
    backgroundColor: "#f4f4f5",
    // borderRadius: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.15, // Slightly increased shadow opacity for better elevation effect
    // shadowOffset: { width: 0, height: 4 }, // More prominent shadow
    // shadowRadius: 10,
    // elevation: 6, // Slightly increased for a better elevation effect on Android
    marginBottom: 50,
    // marginTop: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 20, // Slightly more space between button rows for better spacing
  },
  buttonBlock: {
    width: "45%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c2a42", // Kept the same vibrant color for consistency
    borderRadius: 20, // Increased border radius for a softer look
    paddingVertical: 15, // Increased padding for a more balanced feel
    shadowColor: "#000", // Adding shadow directly to buttons for depth
    shadowOpacity: 0.2, // Slight shadow effect for the buttons
    shadowOffset: { width: 0, height: 3 }, // Subtle shadow for buttons
    shadowRadius: 6,
    elevation: 3, // Elevation for Android devices
  },
  buttonBlock1: {
    width: "45%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c6cf11", // Kept the same vibrant color for consistency
    borderRadius: 20, // Increased border radius for a softer look
    paddingVertical: 15, // Increased padding for a more balanced feel
    shadowColor: "#000", // Adding shadow directly to buttons for depth
    shadowOpacity: 0.2, // Slight shadow effect for the buttons
    shadowOffset: { width: 0, height: 3 }, // Subtle shadow for buttons
    shadowRadius: 6,
    elevation: 3, // Elevation for Android devices
  },
  buttonText: {
    color: "#fff",
    fontSize: 18, // Slightly increased font size for better readability
    marginTop: 15, // Reduced margin for a more compact button
    fontWeight: "bold",
    textAlign: "center", // Ensures text is centered
    letterSpacing: 1, // Adds slight spacing between characters for a modern look
  },
  buttonText1: {
    color: "#000",
    fontSize: 18, // Slightly increased font size for better readability
    marginTop: 15, // Reduced margin for a more compact button
    fontWeight: "bold",
    textAlign: "center", // Ensures text is centered
    letterSpacing: 1, // Adds slight spacing between characters for a modern look
  },

  disabledButtonExpolreMap: {
    opacity: 0.5, // Kept the same for disabled buttons
  },
});
