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
} from "react-native";
import * as Location from "expo-location";
import AuthContext from "../../context/AuthContextProvider";
import axios from "axios";
import AddressModal from "./AddAddressModal";

const AddAddress = () => {
  const { deliveryDetails } = useContext(AuthContext);
  const [newAddress, setNewAddress] = useState({});

  const [modalVisible, setModalVisible] = useState(false);

  const [city, setCity] = useState("Kochchikade");
  const zone = deliveryDetails.zone;
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
    if (city && zone && houseNumber && members.every((member) => member.name)) {
      const address = {
        city,
        zone,
        houseNumber,
        members,
        location, // includes longitude and latitude
      };
      setNewAddress(address);
      setModalVisible(true); // Show the modal after setting the address

      

      try {
        const url = `${API_BASE_URL}:${APP_PORT}/api/postman/address/add-address`;
        const response = await axios.post(url, address);
        if (response.status === 200) {
          console.log("Address added successfully");
          // Alert.alert(
          //   "Form Submitted",
          //   `Address: ${JSON.stringify(address, null, 2)}`
          // );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setHouseNumber("");
        setMembers([{ customerId: 1, name: "" }]);
      }
    } else {
      Alert.alert("Error", "Please fill all the fields");
    }
  };

  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>House Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter house number"
        value={houseNumber}
        onChangeText={(text) => setHouseNumber(text)}
      />

      <Text style={styles.label}>Zone</Text>
      <TextInput
        style={styles.input}
        value={zone}
        editable={false} // Zone is directly fetched from deliveryDetails
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        editable={false}
        onChangeText={(text) => setCity(text)}
      />

      <Text style={styles.label}>Location</Text>
      <View style={styles.locationContainer}>
        {location ? (
          <>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Latitude : {location.latitude}</Text>
          </>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>

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

      <TouchableOpacity style={styles.addButton} onPress={addMember}>
        <Text style={styles.buttonText1}>Add Another Member</Text>
      </TouchableOpacity>

      <AddressModal visible={modalVisible} onClose={() => setModalVisible(false)} address= {newAddress} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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
  locationContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8ff",
    borderRadius: 8,
  },
  memberContainer: {
    marginBottom: 15,
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
    marginTop: 20,
  },
  buttonText1: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddAddress;
