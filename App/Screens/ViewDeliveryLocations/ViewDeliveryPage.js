import { API_BASE_URL } from "@env";
import { APP_PORT } from "@env";
import axios from "axios";
import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import MapView from "react-native-maps";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CommonLayout from "../../Components/commonLayout/CommonLayout";
import AuthContext from "../../context/AuthContextProvider";
import { getStartDutyStatus } from "../../Services/StorageService";
import CustomMarker from "./MapMarker"; // Import the custom marker

export default function ViewDeliveryPage() {
  const { deliveryDetails } = useContext(AuthContext);
  const navigation = useNavigation();
  const [region, setRegion] = useState({
    latitude: deliveryDetails.destinations[0].lat,
    longitude: deliveryDetails.destinations[0].lng,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const mapRef = useRef(null);
  const [dutyStatus, setDutyStatus] = useState(null);

  // Modal state to track visibility and selected marker details
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Split the visitOrder string and convert it to an array of numbers----------------------------------------------------------------------------------------------------------------------
  const orderIndices = deliveryDetails.visitOrder.split(",").map(Number);

  // Filter out the last '0' if present and take only indices up to 7th index (1 in this case)
  const filteredIndices = orderIndices.slice(
    0,
    orderIndices.lastIndexOf(0) !== -1
      ? orderIndices.lastIndexOf(0)
      : orderIndices.length
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchDutyStatus = async () => {
        const status = await getStartDutyStatus();
        setDutyStatus(status);
      };

      fetchDutyStatus();

      return () => {};
    }, [])
  );

  const [mailModalDetails, setMailModalDetails] = useState([]);

  const getMailDetails = async (mailId) => {
    if (mailId) {
      try {
        const url = `${API_BASE_URL}:${APP_PORT}/api/postman/mail/get-details?mailId=${mailId}`;
        const response = await axios.get(
          //connected usb --> ipconfig -->ipv4-->192.168.83.191
          //emu -->10.0.2.2
          url
        );

       // console.log(response)
          setMailModalDetails(response.data);
        
      } catch (error) {
        console.error("Error fetching Mail data", error.message);
      }
    } else {
      setMailModalDetails([]);
    }
  };

  // Function to handle marker press
  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker); // Set the selected marker details
    // //console.log(marker.mailId,marker);
    getMailDetails(marker.mailId); // Fetch mail details
    setModalVisible(true); // Show the modal
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={"google"}
            showsUserLocation={true}
            showsMyLocationButton={true}
            style={styles.map}
            region={region}
            onRegionChangeComplete={(region) => setRegion(region)}
          >
            {/* Loop through multiple markers */}

            {filteredIndices.map((orderIndex, index) => {
              const location = deliveryDetails.destinations[orderIndex];
              return (
                <CustomMarker
                  key={index}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  title={index === 0 ? `Post Office` : `Location ${index}`}
                  tag={index === 0 ? "Post Office" : String(index)}
                  onPress={() =>
                    handleMarkerPress({
                      title: index === 0 ? `Post Office` : `Location ${index}`,
                      lat: location.lat,
                      lng: location.lng,
                      mailId: location.mailId,
                    })
                  }
                />
              );
            })}
            {/* {deliveryDetails.visitOrder
              .split(",")
              .map(Number)
              .map((orderIndex, index) => {
                const location = deliveryDetails.destinations[orderIndex];
                return (
                  <CustomMarker
                    key={index}
                    coordinate={{
                      latitude: location.lat,
                      longitude: location.lng,
                    }}
                    title={`Location ${index + 1}`}
                    tag={
                      index === deliveryDetails.destinations.length - 1
                        ? "Post Office"
                        : String(index)
                    }
                    onPress={() =>
                      handleMarkerPress({
                        title: `Location ${index + 1}`,
                        lat: location.lat,
                        lng: location.lng,
                        mailId :location.mailId,
                      })
                    }
                  />
                );
              })} */}
          </MapView>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.detailText}>
            Total Destinations: {deliveryDetails.destinations.length - 1}
          </Text>

          <View style={styles.buttonContainer}>
            {dutyStatus === null || dutyStatus === false ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate("RouteDisplay")}
              >
                <Text style={styles.buttonText}>Start Duty</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate("RouteDisplay")}
              >
                <Text style={styles.buttonText}>Continue Duty</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Modal to show marker info */}
        <Modal
  transparent={true}
  animationType="slide"
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Slightly darker for better contrast
    }}
  >
    <View
      style={{
        width: "80%", // Width of the modal
        backgroundColor: "white", // Background color of the modal
        borderRadius: 10, // Rounded corners
        padding: 20, // Padding inside the modal
        elevation: 5, // Shadow effect for Android
        shadowColor: "#000", // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.25, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow radius for iOS
      }}
    >
      <Text
        style={{
          fontSize: 22, // Font size for modal title
          fontWeight: "bold", // Bold text
          marginBottom: 12, // Space below the title
          textAlign: "center", // Center align text
        }}
      >
        {selectedMarker ? selectedMarker.title : "Location Info"}
      </Text>
      {selectedMarker && selectedMarker.title === "Post Office" ? (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 16, marginVertical: 5 }}>Post Office Location: Kochchikade</Text>
          <Text style={{ fontSize: 16, marginVertical: 5 }}>Operating Hours: 9 AM - 5 PM</Text>
          <Text style={{ fontSize: 16, marginVertical: 5 }}>Contact Number: 123-456-7890</Text>
        </View>
      ) : (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 16, marginVertical: 5 }}>
            {selectedMarker ? `Mail Type: ${mailModalDetails.mailType}` : ""}
          </Text>
          <Text style={{ fontSize: 16, marginVertical: 5 }}>
            {selectedMarker ? `Recipient Name: ${mailModalDetails.recipientName}` : ""}
          </Text>
          <Text style={{ fontSize: 16, marginVertical: 5 }}>
            {selectedMarker ? `Destination Address: ${mailModalDetails.destinationAddress}` : ""}
          </Text>
        </View>
      )}

      <Button
        title="Close"
        onPress={() => setModalVisible(false)}
        color="#2c2a42" // Button color
        style={{
          marginTop: 15, // Space above the button
          borderRadius: 5, // Rounded button corners
          padding: 10, // Padding inside the button
        }}
      />
    </View>
  </View>
</Modal>

      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8daef",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  bottomSection: {
    position: "absolute",
    bottom: 20,
    left: "5%",
    width: "90%",
    backgroundColor: "rgba(255, 247, 237, 0.95)",
    padding: 25,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 40,
  },
  detailText: {
    fontSize: 17,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  startButton: {
    backgroundColor: "#c6cf11",
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  

  
  button: {
    marginTop: 15, // Space above the button
    backgroundColor: "#2196F3", // Button color
    borderRadius: 5, // Rounded button corners
    padding: 10, // Padding inside the button
  },
  buttonText: {
    // color: 'white', // Text color for the button
    // textAlign: 'center', // Center align button text
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
 
});
