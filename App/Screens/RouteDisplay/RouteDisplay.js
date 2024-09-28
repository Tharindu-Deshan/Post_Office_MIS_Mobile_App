import { API_BASE_URL } from "@env";
import { APP_PORT } from "@env";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location"; // For accessing device location
import axios from "axios"; // For making HTTP requests
import polyline from "polyline"; // For decoding Google Maps polyline data
import { ref, set } from "firebase/database";
import { db } from "../../../firebase_config.js";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import { SelectList } from "react-native-dropdown-select-list";

import AuthContext from "../../context/AuthContextProvider";
import { MaterialIcons } from "@expo/vector-icons";
import {
  storeCurrentIndex,
  getCurrentIndex,
  removeCurrentIndex,
  removeStartDutyStatus,
  storeStartDutyStatus,
} from "../../Services/StorageService.js";
import MarkDestinations from "./MarkDestinations.js";

export default function RouteDisplay() {
  const { deliveryDetails, userId, setDeliveryDetails } =
    useContext(AuthContext);
  // const updateDeliveryStatus = async (deliveryId, status) => {
  //   try {
  //     const response = await axios.put(
  //       `${API_BASE_URL}:${APP_PORT}/api/postman/route-display/update-delivery-status`,
  //       { deliveryId, status }
  //     );

  //     if (response.status === 200) {
  //       console.log("Delivery status updated successfully");
  //     } else {
  //       console.error(`Error: Received status ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating delivery status", error.message);
  //   }
  // };

  useEffect(() => {
    const updatedeliverystatusstarted = async () => {
      await updateDeliveryStatus(deliveryDetails.deliveryId, "Started");

      //update asyncstorage telling duty is started
      await storeStartDutyStatus(true);
      console.log("Duty started");
      setDeliveryDetails((prevDetails) => ({
        ...prevDetails,
        status: "Started",
      }));
    };

    updatedeliverystatusstarted();
  }, []);

  //testingpurpose
  const [x, setX] = useState(0);
  const navigation = useNavigation();
  // Google Maps API key
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  // State for the current location of the user
  const [currentLocation, setCurrentLocation] = useState(null);
  // State for the route, which is a list of coordinates
  const [route, setRoute] = useState([]);
  // State to keep track of the current destination index in the delivery route
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    const fetchCurrentIndex = async () => {
      const savedIndex = await getCurrentIndex();
      if (savedIndex !== null) {
        setCurrentIndex(savedIndex);
      }
    };

    fetchCurrentIndex();
  }, []);

  //----------------------------update status--------------------------------

  const [completedOrNextDestination, setCompletedOrNextDestination] =
    useState(" Next  Stop ");

  const [hideTwoButtons, setHideTwoButtons] = useState(false);
  const [isUndelivered, setIsUndelivered] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Undelivered");
  const [isDeliveryReasonSelected, setIsDeliveryReasonSelected] =
    useState(false);
  const [finalReason, setFinalReasonSelected] = useState("");
  // mail id usestate--
  const [mailId, setMailId] = useState(
    deliveryDetails.destinations[
      deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
    ].mailId
  );
  //ref eken krnne mkkhri dyk krnkot eken thw component ekak wenas wenn hdnn... anith component eka ekka
  //connection ekk thiygnn wage.actions denn plwn anith object ekt
  const mapViewRef = useRef(null); // Reference to the map view component//
  const zoomedInRef = useRef(false); // Boolean to track if the map has zoomed in
  //--------------------------------------------------------------------------------------------
  // State for controlling the visibility of the modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false); // Modal for "Details"
  const [arrivedModalVisible, setArrivedModalVisible] = useState(false); // Modal for "Arrived"
  // Animated values for slide-in effect for modals
  const slideAnim = useRef(new Animated.Value(300)).current; // Starts the modal off-screen
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity starts at 0 (invisible)
  //---------------------------------------------------------------------------------------------
  // Initial region (map zoom level and coordinates)
  const [region, setRegion] = useState({
    latitude: deliveryDetails.destinations[0].lat,
    longitude: deliveryDetails.destinations[0].lng,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  // // Custom Marker component to show a marker with a title and tag on the map
  // const CustomMarker = ({ coordinate, title, tag }) => (
  //   <Marker coordinate={coordinate} title={title}>
  //     <View style={styles.customMarker}>
  //       <Text style={styles.tag}>{tag}</Text>
  //     </View>
  //   </Marker>
  // );

  const statusOptions = [
    { key: "1", value: "Undelivered - No Response" },
    { key: "2", value: "Undelivered - Wrong Address" },
    { key: "3", value: "Undelivered - Other" },
  ];

  //--------------------HANDLING BUTTON PRESSES -------------------------

  const handleConfirm = async () => {
    try {
      // Define the request payload
      const payload = {
        mailId: mailId,
        status: finalReason,
      };
      const url = `${API_BASE_URL}:${APP_PORT}/api/postman/update-status`;
      // Send the POST request to the backend using axios
      const response = await axios.put(
        //connected usb --> ipconfig -->ipv4-->192.168.83.191
        //emu -->10.0.2.2
        url,
        payload
      );

      // Handle the response
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }

    setIsUndelivered(false);
    setSelectedStatus("Undelivered");
    setIsDeliveryReasonSelected(false);
    closeModal(setArrivedModalVisible);
  };

  const handleUndelivered = () => {
    setIsUndelivered(true);
    setIsDeliveryReasonSelected(true);
  };

  const handleDelivered = () => {
    setFinalReasonSelected("Delivered");

    setIsDeliveryReasonSelected(true);
  };

  const handleUpdateStatusCancel = () => {
    setIsUndelivered(false);
    setIsDeliveryReasonSelected(false);
    closeModal(setArrivedModalVisible);
  };

  const handleDetailsCloseButton = () => {
    closeModal(setDetailsModalVisible);
  };

  // Function to open modal with sliding and fading animations
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

  // Function to close modal with sliding and fading animations
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

  const [mailDetails, setMailDetails] = useState([]);

  const getMailDetails = async () => {
    if (
      deliveryDetails.destinations[
        deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
      ].mailId
    ) {
      try {
        const url = `${API_BASE_URL}:${APP_PORT}/api/postman/mail/get-details?mailId=${mailId}`;
        const response = await axios.get(
          //connected usb --> ipconfig -->ipv4-->192.168.83.191
          //emu -->10.0.2.2
          url
        );

        if (response.status === 200) {
          setMailDetails(response.data);
        } else {
          console.error(`Error: Received status ${response.status}`);
          setMailDetails([]);
        }
      } catch (error) {
        console.error("Error fetching Mail data", error.message);
      }
    } else {
      setMailDetails([]);
    }
  };
  useEffect(() => {
    getMailDetails();
  }, [currentIndex]);

  useEffect(() => {
    console.log("Mail Id", mailId);
    console.log("Mail details", mailDetails);
  }, [mailDetails]);

  // Function to fetch the route between current location and destination

  const getRoute = async (currentLoc, destinationLoc) => {
    const origin = `${currentLoc.latitude},${currentLoc.longitude}`; // Current location as origin
    const destination = `${destinationLoc.lat},${destinationLoc.lng}`; // Destination

    try {
      // Get directions data from Google Maps API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      );

      // If routes are available, decode the polyline and store the coordinates
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

        setRoute(coords); // Set the decoded route
      } else {
        console.log("No routes found");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  //Function update Delivery Status ------------------------
  const updateDeliveryStatus = async (deliveryId, status) => {
    try {
      const url = `${API_BASE_URL}:${APP_PORT}/api/postman/route-display/update-delivery-status`;
      const response = await axios.put(url, { deliveryId, status });

      if (response.status === 200) {
        console.log("Delivery status updated successfully");
      } else {
        console.error(`Error: Received status ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating delivery status", error.message);
    }
  };

  //Function to move to the next destination----------------------------------------------------------------
  const nextDestination = async () => {
    if (
      currentIndex <
      deliveryDetails.visitOrder.split(",").map(Number).length - 2
    ) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;

        // Set the mailId with the updated currentIndex
        setMailId(
          deliveryDetails.destinations[
            deliveryDetails.visitOrder.split(",").map(Number)[newIndex]
          ].mailId
        );

        return newIndex;
      });
    } else if (
      currentIndex ===
      deliveryDetails.visitOrder.split(",").map(Number).length - 2
    ) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;

        // Set the mailId with the updated currentIndex
        setMailId(
          deliveryDetails.destinations[
            deliveryDetails.visitOrder.split(",").map(Number)[newIndex]
          ].mailId
        );

        return newIndex;
      });

      setCompletedOrNextDestination("To Post Office");
      setArrivedModalVisible(false);

      //call the relavant methond thats for completing the delivery..
    } else if (
      currentIndex ===
      deliveryDetails.visitOrder.split(",").map(Number).length - 1
    ) {
      setHideTwoButtons(true);

      // Update the delivery details in AuthContext
      setDeliveryDetails((prevDetails) => ({
        ...prevDetails,
        status: "Completed", // Update the status to Completed
      }));
      // Update the status in the database(put it in the db)
      await updateDeliveryStatus(deliveryDetails.deliveryId, "Completed");

      //delete the current index from async storage
      await removeCurrentIndex();
      await removeStartDutyStatus();

      setMailId("");
      setRoute([]); // Clear route when all destinations are reached
    }
  };

  const handlePreviousLocation = async () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        // Set the mailId with the updated currentIndex
        setMailId(
          deliveryDetails.destinations[
            deliveryDetails.visitOrder.split(",").map(Number)[newIndex]
          ].mailId
        );

        return newIndex;
      });
    }
  };

  useEffect(() => {
    const updateIndexInStorage = async () => {
      await storeCurrentIndex(currentIndex);
    };

    updateIndexInStorage(); // Call the async function
  }, [currentIndex]);

  // -------------Update mailId whenever currentIndex changes---------------------------------------
  // useEffect(() => {
  //   if (
  //     deliveryDetails &&
  //     deliveryDetails.visitOrder.split(",").map(Number) &&
  //     deliveryDetails.destinations[
  //       deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
  //     ]
  //   ) {
  //     const newMailId =
  //       deliveryDetails.destinations[
  //         deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
  //       ].mailId;
  //     setMailId(newMailId); // Update mailId state
  //   }
  // }, [currentIndex]);

  //-------------------------------------------------------------------------------------------------

  //------------get current location in every 5 secounds and store it in a use state----------------------
  useEffect(() => {
    let intervalId;

    const startLocationTracking = async () => {
      // Request location permissions from the user
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Start tracking the user's location every 5 seconds
      intervalId = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low, // High accuracy location
        });

        const { latitude, longitude } = location.coords;
        setCurrentLocation({ latitude, longitude });

        // If the map is not zoomed in yet, zoom in on the user's location
        if (mapViewRef.current && !zoomedInRef.current) {
          mapViewRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          zoomedInRef.current = true; // Prevents further zooming
        }

        // Update the map region to follow the user's location
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // -------Fetch the route to the next destination
        // getRoute(
        //   { latitude, longitude }, // Pass the updated location
        //   deliveryDetails.destinations[
        //     deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
        //   ]
        // );
      }, 500000); // 5 seconds interval
    };

    startLocationTracking();

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // Re-run if currentIndex or deliveryDetails changes

  //-----------------------------------------------------------------------------------------

  //--------------- UseEffect to update the route whenever the current index changes

  // useEffect(() => {
  //   if (
  //     currentLocation &&
  //     currentIndex < deliveryDetails.visitOrder.split(",").map(Number).length
  //   ) {
  //     getRoute(
  //       currentLocation,
  //       deliveryDetails.destinations[
  //         deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
  //       ]
  //     );
  //   }
  // }, [currentIndex]);

  //setting the final reason --- works when confirm button pressed
  useEffect(() => {
    setFinalReasonSelected(selectedStatus);
  }, [selectedStatus]);
  //------------------------------FIREBASE--------------------------

  // location tracking ...
  // and updating in firebase

  useEffect(() => {
    if (currentLocation && userId) {
      updateLocationInDatabase(userId, currentLocation);
    }
  }, [currentLocation]);

  const updateLocationInDatabase = (userId, location) => {
    const postmanRef = ref(db, `PostmanTracker/${userId}`);

    set(postmanRef, {
      userId: userId,
      userLocation: location,
    })
      .then(() => {
        console.log("Location updated successfully!");
        setX(x + 1);
        console.log(x);
      })
      .catch((error) => {
        console.error("Error updating location:", error);
      });
  };

  //------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        ref={mapViewRef}
        region={region}
        showsUserLocation={true} // Show user's location on the map
        followsUserLocation={true} // Map follows the user's location
      >
        {/* Add markers for each destination --------------------------------------------------------------------------------*/}

        <MarkDestinations />
        {/* {deliveryDetails.visitOrder
          .split(",")
          .map(Number)
          .map((orderIndex, index) => {
            const location = deliveryDetails.destinations[orderIndex];
            return (
              <CustomMarker
                key={index}
                coordinate={{ latitude: location.lat, longitude: location.lng }}
                title={`Location ${index + 1}`}
                tag={
                  index === deliveryDetails.destinations.length - 1 ? (
                    <EvilIcons
                      name="envelope"
                      size={24}
                      color="black"
                      borderColor="black"
                      borderWidth={5}
                    />
                  ) : (
                    String(index)
                  )
                }
              />
            );
          })} */}

        {/* Draw the route polyline if available */}
        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="#4285F4" />
        )}
      </MapView>

      {/* //--------------------------------------------------------------------------------------------------------------?>>>>>>>>>>>>>? */}
      <TouchableOpacity
        style={[
          styles.floatingBackButton,
          (currentIndex === 0 ||
            currentIndex === deliveryDetails.destinations.length) &&
            styles.disabledButton, // Disable when at the first location
        ]}
        onPress={handlePreviousLocation}
        disabled={
          currentIndex === 0 ||
          currentIndex === deliveryDetails.destinations.length
        } // Disable the button at the first location
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
        <Text style={styles.prevButtonText}>Prev</Text>
      </TouchableOpacity>

      {/* ?-------------------------------------------------------------------------------------------------- */}

      {/* Buttons at the bottom */}
      <View style={styles.buttonContainer}>
        <View style={styles.firstbuttoncontainer}>
          {/* Display the current destination index */}
          <Text style={styles.currentpositionnumber}>{currentIndex}</Text>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => openModal(setDetailsModalVisible)}
          >
            <Text style={styles.detailbuttontext}>Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondbuttoncontainer}>
          {hideTwoButtons ? (
            <TouchableOpacity
              style={styles.finalbuttoncompleted}
              title="Completed"
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.finalbuttontext}>Task Completed</Text>
            </TouchableOpacity>
          ) : (
            <>
              {currentIndex < deliveryDetails.destinations.length ? (
                <TouchableOpacity
                  style={styles.arrivedButtonContainer}
                  title="Arrived"
                  onPress={() => openModal(setArrivedModalVisible)}
                >
                  <Text style={styles.arrievedtext}>Arrived</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.nextLocationButton}
                title="Next Dest"
                onPress={nextDestination}
              >
                <Text style={styles.nextlocationtext}>
                  {completedOrNextDestination}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Modal
        visible={detailsModalVisible}
        animationType="fade"
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
            {mailDetails && mailDetails.recipientName ? (
              <ScrollView style={styles.scrollView}>
                <Text style={[styles.modalText, { lineHeight: 30 }]}>
                  <Text style={{ fontWeight: "bold" }}>Recipient Name: </Text>
                  <Text>{mailDetails.recipientName}</Text>
                  {"\n"}

                  <Text style={{ fontWeight: "bold" }}>Address: </Text>
                  <Text>{mailDetails.destinationAddress}</Text>
                  {"\n"}

                  <Text style={{ fontWeight: "bold" }}>Status: </Text>
                  <Text>{mailDetails.status}</Text>
                  {"\n"}

                  <Text style={{ fontWeight: "bold" }}>Mail Type: </Text>
                  <Text>{mailDetails.mailType}</Text>
                  {"\n"}

                  {/* <Text style={{ fontWeight: "bold" }}>Zone: </Text>
                  <Text>{mailDetails.zone}</Text>
                  {"\n"}
                  <Text style={{ fontWeight: "bold" }}>City: </Text>
                  <Text>{mailDetails.city}</Text> */}
                  {"\n"}
                </Text>
              </ScrollView>
            ) : (
              <Text style={{ fontWeight: "bold" }}>
                No Mail details available
              </Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleDetailsCloseButton} // This should work since it's just passing the reference
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
              <TouchableOpacity
                style={styles.deliveredButton}
                onPress={handleDelivered}
              >
                <Text style={styles.buttonText}>Delivered</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deliveredButton}
                onPress={handleUndelivered}
              >
                <Text style={styles.buttonText}>{selectedStatus}</Text>
              </TouchableOpacity>

              {/* Dropdown for selecting Undelivered reason */}
              {isUndelivered && (
                <SelectList
                  setSelected={(val) => setSelectedStatus(val)}
                  data={statusOptions}
                  save="value"
                  placeholder="Select Reason for Undelivered"
                />
              )}
            </View>

            <View style={styles.confirmCancelButtons}>
              <TouchableOpacity
                disabled={!isDeliveryReasonSelected}
                style={[
                  styles.confirmButton,
                  !isDeliveryReasonSelected && styles.disabledButton, // Apply disabled styles
                ]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleUpdateStatusCancel}
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
    marginTop: 3,
    flexDirection: "row",
    justifyContent: "flex-start", // Distribute space between buttons
    backgroundColor: "#fff7ed",
    borderRadius: 30,
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
  viewDetailsButton: {
    marginTop: 5,
    backgroundColor: "#c3cdce",
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  detailbuttontext: {
    fontWeight: "bold",
    fontSize: 15,
    padding: 0,
  },
  secondbuttoncontainer: {
    marginLeft: 10,
    flexDirection: "row", // Align buttons horizontally
    alignItems: "center", // Vertically center the buttons
    marginTop: 10, // Adjust margin as needed
  },
  arrivedButtonContainer: {
    backgroundColor: "#2c2a42", // Button color
    paddingVertical: 20, // Adjust vertical padding
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center", // Center the button text
    paddingHorizontal: 30,
  },
  arrievedtext: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
  nextLocationButton: {
    backgroundColor: "#c6cf11", // Button color
    paddingVertical: 20, // Adjust vertical padding
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center", // Center the button text
    marginLeft: 10, // Spacing between the buttons
    paddingHorizontal: 10,
  },
  nextlocationtext: {
    fontWeight: "bold",
    fontSize: 17,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  //------------------
  modalContent: {
    width: 310,
    height: 360,
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
    marginBottom: 10,
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
  // confirmButton: {
  //   backgroundColor: "#f33",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  // },
  cancelButton: {
    backgroundColor: "#4CAF50",
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

  finalbuttoncompleted: {
    backgroundColor: "#008080", // Button color
    paddingVertical: 20, // Adjust vertical padding
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center", // Center the button text
    paddingHorizontal: 35,
    paddingLeft: 40,
    marginLeft: 20,
  },
  finalbuttontext: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
  },
  scrollView: {
    paddingHorizontal: 20, // Padding on left and right for better spacing
    paddingVertical: 10, // Padding on top and bottom for better readability
    backgroundColor: "#f9f9f9", // Light background color for better text contrast
    borderRadius: 10, // Rounded corners for a more polished look
    marginBottom: 20, // Margin to create space between ScrollView and other components
  },
  confirmButton: {
    backgroundColor: "#f33", // Regular button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  // Styles for the confirm button when disabled
  disabledButton: {
    backgroundColor: "#f33", // Disabled button color (can also be lighter)
    opacity: 0.5, // Reduce opacity to indicate disabled state
  },
  floatingBackButton: {
    position: "absolute", // Floating effect to stay on top
    width: 70,
    height: 60,
    backgroundColor: "#006666", // A nice soft blue color for the previous button
    borderRadius: 9, // Circular button
    justifyContent: "center", // Center the icon inside the button
    alignItems: "center", // Center the icon horizontally
    right: 335, // Distance from the left edge
    bottom: 140, // Distance from the bottom edge
    elevation: 0, // Shadow for Android

    // shadowOffset: { width: 0, height: 4 }, // Deeper shadow for more dimension
    shadowOpacity: 0.3, // Softer shadow opacity
    shadowRadius: 4, // Softer shadow radius
    borderWidth: 2, // Add subtle border
    borderColor: "#ffffff", // White border for contrast
    zIndex: 100, // Ensure the button stays on top of all other elements
  },

  prevButtonText: {
    color: "#fff", // White text for contrast
    fontWeight: "bold", // Bold text for emphasis
    fontSize: 16, // Text size
  },
});
