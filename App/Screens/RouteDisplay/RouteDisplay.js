import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import polyline from "polyline";
import { deliveryObject } from "../../Components/DataHardCoded/deliveryObject";

const GOOGLE_MAPS_API_KEY = "AIzaSyDtman-i1xVwD90dMS3HgHc_0CoobjBelc";

const CustomMarker = ({ coordinate, title, tag }) => (
  <Marker coordinate={coordinate} title={title}>
    <View style={styles.customMarker}>
      <Text style={styles.tag}>{tag}</Text>
    </View>
  </Marker>
);

export default function RouteDisplay() {
  const [detailsModalVisible, setDetailsModalVisible] = useState(false); // Modal for "Details"
  const [arrivedModalVisible, setArrivedModalVisible] = useState(false); // Modal for "Arrived"
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [region, setRegion] = useState({
    latitude: deliveryObject.destinations[0].lat,
    longitude: deliveryObject.destinations[0].lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapViewRef = useRef(null);
  const zoomedInRef = useRef(false);

  const slideAnim = useRef(new Animated.Value(300)).current; // Starts the modal off-screen
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity starts at 0 (invisible)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            latitude,
            longitude,
          });

          if (mapViewRef.current && !zoomedInRef.current) {
            mapViewRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            zoomedInRef.current = true;
          }

          if (currentLocation) {
            getRoute(
              currentLocation,
              deliveryObject.destinations[
                deliveryObject.visitOrder[currentIndex]
              ]
            );
          }
        }
      );
    })();
  }, [currentLocation]);

  const getRoute = async (currentLoc, destinationLoc) => {
    const origin = `${currentLoc.latitude},${currentLoc.longitude}`;
    const destination = `${destinationLoc.lat},${destinationLoc.lng}`;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const points = polyline.decode(
          response.data.routes[0].overview_polyline.points
        );
        const coords = points.map((point) => {
          return {
            latitude: point[0],
            longitude: point[1],
          };
        });

        setRoute(coords);
      } else {
        console.log("No routes found");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    if (currentLocation && currentIndex < deliveryObject.visitOrder.length) {
      getRoute(
        currentLocation,
        deliveryObject.destinations[deliveryObject.visitOrder[currentIndex]]
      );
    }
  }, [currentIndex]);

  const nextDestination = () => {
    if (currentIndex < deliveryObject.visitOrder.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === deliveryObject.visitOrder.length - 1) {
      setRoute([]);
    }
  };

  const openModal = (setVisible) => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, // Moves to the visible position
        duration: 250, // Slightly faster animation for slide
        easing: Easing.out(Easing.cubic), // More natural easing for smoother slide
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Fades in
        duration: 250, // Syncing fade with slide
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = (setVisible) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300, // Moves back out of view
        duration: 300, // Slightly longer for smoother close
        easing: Easing.in(Easing.cubic), // Smooth deceleration during slide out
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0, // Fades out
        duration: 200, // Faster fade out for a snappy effect
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapViewRef}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {deliveryObject.destinations.map((location, index) => (
          <CustomMarker
            key={index}
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title={`Location ${index + 1}`}
            tag={String(index + 1)}
          />
        ))}
        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="#4285F4" />
        )}
      </MapView>

      {/* Buttons */}

      <View style={styles.buttonContainer}>
        <View style={styles.firstbuttoncontainer}>
          <Text style={styles.currentpositionnumber}>1</Text>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            
            onPress={() => openModal(setDetailsModalVisible)}
          > 
          <Text style={styles.detailbuttontext}>Details</Text>
          
           </TouchableOpacity>
        </View>

        <View style={styles.secondbuttoncontainer}>
          <TouchableOpacity
            style={styles.arrivedButtonContainer}
            title="Arrived"
            onPress={() => openModal(setArrivedModalVisible)}
          >
            <Text style={styles.arrievedtext}>Arrived</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextLocationButton}
            title="Next Dest"
            onPress={nextDestination}
          >
            <Text style={styles.nextlocationtext}>Next Destination</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for "Details" Button */}
      <Modal
        visible={detailsModalVisible}
        animationType="none"
        transparent={true}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalTitle}>Mail Details</Text>
            <ScrollView>
              <Text style={[styles.modalText, { lineHeight: 30 }]}>
                <Text style={{ fontWeight: "bold" }}>Sender : </Text>John Doe
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>Receiver : </Text>Jane
                Smith{"\n"}
                <Text style={{ fontWeight: "bold" }}>Address : </Text>123
                Example Street, City{"\n"}
                <Text style={{ fontWeight: "bold" }}>Status : </Text>Pending
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>Expected Delivery : </Text>
                15th August 2024{"\n"}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => closeModal(setDetailsModalVisible)}
            >
              <Text style={styles.detailsclosebuttonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Modal for "Arrived" Button */}
      <Modal
        visible={arrivedModalVisible}
        animationType="none"
        transparent={true}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalTitle}>Update Mail Status</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity style={styles.deliveredButton}>
                <Text style={styles.buttonText}>Delivered</Text>
              </TouchableOpacity>
                <TouchableOpacity style={styles.undeliveredButton}>
                  <Text style={styles.buttonText}>Undelivered</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.confirmCancelButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => closeModal(setArrivedModalVisible)}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => closeModal(setArrivedModalVisible)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 10,
  },
  customMarker: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
  },
  tag: {
    color: "black",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop:3,
    flexDirection: "row",
    justifyContent: "flex-start", // Distribute space between buttons
   backgroundColor:"#e8daef",
    borderRadius: 30,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    padding: 10,
    marginHorizontal: 10, // Adds spacing between screen edges and the buttons
    alignItems: "center", // Align buttons vertically in the center to prevent stretching

  },

  firstbuttoncontainer: {
    flexDirection: "column",
  },

  currentpositionnumber: {
   
    borderRadius: 10,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    height: 50,
    width: 50,
    textAlignVertical: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 5,
    marginLeft: 15,
  },
  // Smaller Details Button (Reduced size)
  viewDetailsButton: {
   
    marginTop:5,
    backgroundColor: "#c3cdce",
    borderRadius: 5,
    paddingVertical: 16, // Reduced padding to make it smaller
    paddingHorizontal: 16, // Smaller padding for a more compact look
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",

    // shadowColor: "#000",/
    //  / /shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.2,
    //   shadowRadius: 2,
    // width: 100, // Explicitly set the width to make it smaller
  },
  detailbuttontext:{
      fontWeight: "bold",
      fontSize: 15,
  },

  secondbuttoncontainer: {
    marginLeft:10,
    flexDirection: "row", // Align buttons horizontally
    
    alignItems: "center", // Vertically center the buttons
    marginTop: 10, // Adjust margin as neede
   
  },

  // Arrived Button
  arrivedButtonContainer: {
 
    backgroundColor: "#4CAF50", // Button color
    paddingVertical: 20, // Adjust vertical padding
    borderRadius: 10, // Rounded corners
   
    justifyContent: "center",
    alignItems: "center", // Center the button text
    paddingHorizontal:35,
  },
  arrievedtext:{
    fontWeight: "bold",
      fontSize: 17,
  },

  // Next Destination Button
  nextLocationButton: {
    
    backgroundColor: "#c6cf11", // Button color
    paddingVertical: 20, // Adjust vertical padding
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center", // Center the button text
    marginLeft: 10, // Spacing between the buttons
    paddingHorizontal:10,
    // borderWidth: 1, 
    // borderColor:"black",
  },

  nextlocationtext:{
    fontWeight: "bold",
    fontSize: 17,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColour: "black",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  statusButtons: {

    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  deliveredButton: {
    backgroundColor: "#32a852",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom:10,
  },
  undeliveredButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmCancelButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsclosebuttonText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 10,
    padding: 6,
  },
  modalText: {
    padding: 10,
  },
});
