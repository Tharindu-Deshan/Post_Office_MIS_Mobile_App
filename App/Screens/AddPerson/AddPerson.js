import { API_BASE_URL } from "@env";
import { APP_PORT } from "@env";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import * as Location from "expo-location";
import AuthContext from "../../context/AuthContextProvider";
import axios from "axios";

import { getCurrentIndex } from "../../Services/StorageService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Image = require("./auto.png");
const AddPerson = () => {
  const { deliveryDetails } = useContext(AuthContext);

  const [city, setCity] = useState("Kochchikade");
  const [zone1, setZone1] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [members, setMembers] = useState([{ customerId: 1, name: "" }]);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = members.map((member, idx) =>
      idx === index ? { ...member, [field]: value } : member
    );
    setMembers(updatedMembers);
  };

  const addMember = () => {
    const nextCustomerId = members.length + 1;
    setMembers([...members, { customerId: nextCustomerId, name: "" }]);
  };

  const handleSubmit = async () => {
    if (
      city &&
      zone1 &&
      houseNumber &&
      members.every((member) => member.name)
    ) {
      try {
        const index = await getCurrentIndex();
        const visitOrderString = deliveryDetails.visitOrder; // Extract visitOrder string
        const visitArr = visitOrderString.split(",").map(Number); // Convert to number array
        const x = visitArr[index];
        const addressId = deliveryDetails.destinations[x].addressId;

        const addressWithMembers = {
          addressId,
          members,
        };

        const response = await axios.post(
          `${API_BASE_URL}:${APP_PORT}/api/postman/add-person/`,
          addressWithMembers
        );
        if (response.status === 200) {
     
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert("Error", "Please fill all the fields");
    }
  };

  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
    })();
  }, []);

  const handlePressCurrentHouse = async () => {
    try {
      const index = await getCurrentIndex();
      const visitOrderString = deliveryDetails.visitOrder; // Extract visitOrder string
      const visitArr = visitOrderString.split(",").map(Number); // Convert to number array
      const x = visitArr[index];
      const mailId = deliveryDetails.destinations[x].mailId;

      if (!mailId) {
        console.error("Mail ID is missing");
        return;
      }
      
      const baseUrl = `${API_BASE_URL}`;const appPort = `${APP_PORT}`;const url = `${API_BASE_URL}:${APP_PORT}/api/postman/mail/get-details?mailId=${mailId}`;
      const response = await axios.get(url);
      const destinationAddress = response.data.destinationAddress;
      
      const housenumber = destinationAddress
        .split(",")[0]
        .replace(/\s+/g, "")
        .trim();
      setHouseNumber(housenumber);

      //console.log("Destination Address:", destinationAddress);
      // You can now use the destinationAddress as needed in your component
    } catch (error) {
      console.error("Error fetching mail details:", error);
    }
  };

  const getZone1 = async () => {
    const postmanId = await AsyncStorage.getItem("postmanId");
    //console.log("Postman Id:", postmanId);
    const baseUrl = `${API_BASE_URL}`;const appPort = `${APP_PORT}`;const url = `${API_BASE_URL}:${APP_PORT}/api/postman/add-person/get-zone?postmanId=${postmanId}`;
    //console.log("URL:", url);
    try {
      const response = await axios.get(url);
      setZone1(response.data);
    } catch (error) {
      console.error("network errorr.......", error);
    }
  };

  useEffect(() => {
    getZone1();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>House Number</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.customInput}
            placeholder="Enter house number"
            value={houseNumber}
            onChangeText={(text) => setHouseNumber(text)}
          />
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginBottom: 15,
              marginRight: 15,
            }}
          >
            <Button
              color={"#475569"}
              borderRadius={50}
              title="Current House"
              disabled={!deliveryDetails}
              onPress={handlePressCurrentHouse}
            />
            
          </View>
        </View>

        <Text style={styles.label}>Zone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter zone"
          value={zone1}
          // onChangeText={(text) => setZone(text)}
          onChangeText={(text) => setZone1(text)}
          editable={false}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={(text) => setCity(text)}
          editable={false}
        />

        <Text style={styles.label}>Members</Text>
        {members.map((member, index) => (
          <View key={index} style={styles.memberContainer}>
            <Text>Member: {member.customerId}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter member name"
              value={member.name}
              onChangeText={(text) => handleMemberChange(index, "name", text)}
            />
          </View>
        ))}
        <View style={{ marginTop: 100 }}>
          <TouchableOpacity style={styles.addButton} onPress={addMember}>
            <Text style={styles.buttonText1}>Add Another Member</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fafafa", // Soothing background color
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2, // subtle shadow for depth
  },
  customInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    width: "50%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2, // subtle shadow for depth
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8ff",
    borderRadius: 8,
  },
  memberContainer: {
    mariginTop: 20,
  },
  addButton: {
    backgroundColor: "#c6cf11",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#2c2a42",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText1: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddPerson;
