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
import AuthContext from "../../context/AuthContext";

const backgroundimage = require("../HomePage/e03b2bf1-678e-49f1-998d-d5b03fb09a99.webp");

export default function Home() {
  const navigation = useNavigation();
  const [status, setStatus] = useState("Unassigned");
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivery, setDelivery] = useState(null);

  const { userId, userName, deliveryDetails, ...other } =
    useContext(AuthContext);

    const getPostmanData = async () => {
      console.log("getting postman data");
      try {
        const response = await axios.get(`http://10.0.2.2:8083/api/postman/route-display/get-delivery?postmanId=${userId}`);

    
        if (response.status === 200) {
          console.log("Request successful");
          console.log(response.data);
          setDelivery(response.data);
          setStatus(response.data.status);
          setName(userName)
          
         
          
       
        } else {
          console.error(`Error: Received status ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching postman data", error.message);
        setError(error.message); 
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
          <Text style={styles.welcomeMessage}>Welcome, {name}!</Text>
          <Text style={styles.subWelcomeMessage}>
            You're logged in as a Postman
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Current Status: {status}</Text>
        </View>

        <View style={styles.blockContainer}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.buttonBlock} onPress={() => ({})}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={60}
                color="#fff"
              />
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBlock}
              onPress={() => navigation.navigate("ViewDeliveryPage")}
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
            <TouchableOpacity style={styles.buttonBlock} onPress={() => ({})}>
              <Ionicons name="person-add" size={60} color="#fff" />
              <Text style={styles.buttonText}>Add Person</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonBlock} onPress={() => ({})}>
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
    backgroundColor: "#e8daef",
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
});
