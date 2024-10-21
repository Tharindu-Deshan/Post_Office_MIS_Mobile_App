import { API_BASE_URL } from "@env";
import { APP_PORT } from "@env";
import styles from "./RouteDisplayStyles";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location"; // For accessing device location
import axios from "axios"; // For making HTTP requests
import polyline from "polyline"; // For decoding Google Maps polyline data
import { ref, set } from "firebase/database";
import { db } from "../../../firebase_config.js";
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

const imageTick = require("./done.png"); // Adjust the path as needed
const whileTick = require("./whiteTick.png"); // Adjust the path as needed

export default function RouteDisplay() {
  const {
    deliveryDetails,
    userId,
    userName,
    setDeliveryDetails,
    currentIndexContext,
    setCurrentIndexContext,
  } = useContext(AuthContext);

  const navigation = useNavigation();

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);

  //----------------------------update status--------------------------------

  const [completedOrNextDestination, setCompletedOrNextDestination] =
    useState(" Next  Stop ");
  const [hideTwoButtons, setHideTwoButtons] = useState(false);
  const [isUndelivered, setIsUndelivered] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Undelivered");
  const [isDeliveryReasonSelected, setIsDeliveryReasonSelected] =
    useState(false);
  const [finalReason, setFinalReasonSelected] = useState("");
  const [mailId, setMailId] = useState(
    deliveryDetails.destinations[
      deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
    ].mailId
  );

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

  const statusOptions = [
    { key: "1", value: "Undelivered - No Response" },
    { key: "2", value: "Undelivered - Wrong Address" },
    { key: "3", value: "Undelivered - Other" },
  ];

  const fetchCurrentIndex = async () => {
    const savedIndex = await getCurrentIndex();
    if (savedIndex !== null) {
      setCurrentIndex(savedIndex);
    }
  };

  const updatedeliverystatusstarted = async () => {
    await updateDeliveryStatus(deliveryDetails.deliveryId, "Started");
    await storeStartDutyStatus(true);
    setDeliveryDetails((prevDetails) => ({
      ...prevDetails,
      status: "Started",
    }));
  };

  useEffect(() => {
    fetchCurrentIndex();
    updatedeliverystatusstarted();
  }, []);

  //--------------------HANDLING BUTTON PRESSES -------------------------
  const handleConfirm = async () => {
    try {
      const payload = {
        mailId: mailId,
        status: finalReason,
      };
      const baseUrl = `${API_BASE_URL}`;
      const appPort = `${APP_PORT}`;
      const url = `${API_BASE_URL}:${APP_PORT}/api/postman/update-status`;

      const response = await axios.put(url, payload);
      mailDetails.status = finalReason;
    } catch (error) {
      console.error("Error updating mail  status:", error);
    }

    setIsUndelivered(false);
    setSelectedStatus("Undelivered");
    setIsDeliveryReasonSelected(false);
    closeModal(setArrivedModalVisible);
    setFinalReasonSelected("");
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

  const [mailDetails, setMailDetails] = useState([]);

  const getMailDetails = async () => {
    if (
      deliveryDetails.destinations[
        deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
      ].mailId
    ) {
      try {
        const baseUrl = `${API_BASE_URL}`;
        const appPort = `${APP_PORT}`;
        const url = `${API_BASE_URL}:${APP_PORT}/api/postman/mail/get-details?mailId=${mailId}`;
        console.log(url);

        const response = await axios.get(url);

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
    setCurrentIndexContext(currentIndex);
    getMailDetails();
  }, [currentIndex]);

  // Function to fetch the route between current location and destination

  const getRoute = async (currentLoc, destinationLoc) => {
    const origin = `${currentLoc.latitude},${currentLoc.longitude}`; // Current location as origin
    const destination = `${destinationLoc.lat},${destinationLoc.lng}`; // Destination

    try {
      // Get directions data from Google Maps API
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

        setRoute(coords); // Set the decoded route
      } else {
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  //Function update Delivery Status ------------------------
  const updateDeliveryStatus = async (deliveryId, status) => {
    try {
      const baseUrl = `${API_BASE_URL}`;
      const appPort = `${APP_PORT}`;
      const url = `${API_BASE_URL}:${APP_PORT}/api/postman/route-display/update-delivery-status`;

      const response = await axios.put(url, { deliveryId, status });

      if (response.status === 200) {
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

  //------------get current location in every 5 secounds and store it in a use state----------------------
  useEffect(() => {
    let intervalId;

    const startLocationTracking = async () => {
      // Request location permissions from the user
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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
      }, 5000); // 10 seconds interval
    };

    startLocationTracking();

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // Re-run if currentIndex or deliveryDetails changes

  useEffect(() => {
    if (
      currentLocation &&
      currentIndex < deliveryDetails.visitOrder.split(",").map(Number).length
    ) {
      // Fetch the route to the next destination only when currentIndex changes
      getRoute(
        currentLocation,
        deliveryDetails.destinations[
          deliveryDetails.visitOrder.split(",").map(Number)[currentIndex]
        ]
      );
    }
  }, [currentIndex, currentLocation]);

  //setting the final reason --- works when confirm button pressed
  useEffect(() => {
    setFinalReasonSelected(selectedStatus);
  }, [selectedStatus]);

  //------------------------------FIREBASE--------------------------

  const updateLocationInDatabase = (userId, location) => {
    const postmanRef = ref(db, `PostmanTracker/${userId}`);
    set(postmanRef, {
      userId: userId,
      userLocation: location,
      deliveredCount: currentIndex,
      pendingCount: deliveryDetails.destinations.length - currentIndex,
      userName: userName,
    })
      .then(() => {})
      .catch((error) => {
        console.error("Error updating location:", error);
      });
  };
  useEffect(() => {
    if (currentLocation && userId) {
      updateLocationInDatabase(userId, currentLocation);
    }
  }, [currentLocation]);

  const openModal = (setVisible) => {
    setVisible(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Function to close modal with sliding and fading animations
  const closeModal = (setVisible) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
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
        <MarkDestinations />
        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="#4285F4" />
        )}
      </MapView>

      <TouchableOpacity
        style={[
          styles.floatingBackButton,
          (currentIndex === 1 ||
            currentIndex === deliveryDetails.destinations.length) &&
            styles.disabledButton,
        ]}
        onPress={handlePreviousLocation}
        disabled={
          currentIndex === 1 ||
          currentIndex === deliveryDetails.destinations.length
        }
      >
        <MaterialIcons name="arrow-back" size={24} color="black" />
        <Text style={styles.prevButtonText}>Prev</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <View style={styles.firstbuttoncontainer}>
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
                  <Text style={styles.arrievedtext}>Update</Text>
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
              onPress={handleDetailsCloseButton}
            >
              <Text style={styles.detailsclosebuttonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}
                  >
                    Delivered
                  </Text>

                  {finalReason == "Delivered" ? (
                    <Image
                      source={whileTick}
                      style={{
                        width: 18,
                        backgroundColor: "fff",
                        height: 18,
                        marginLeft: 8,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.undeliveredButton}
                onPress={handleUndelivered}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.buttonText}>{selectedStatus}</Text>
                  {finalReason == "Undelivered - No Response" ||
                  finalReason == "Undelivered - Wrong Address" ||
                  finalReason == "Undelivered - Other" ? (
                    <Image
                      source={imageTick}
                      style={{
                        width: 21,
                        backgroundColor: "fff",
                        height: 21,
                        marginLeft: 8,
                      }}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>

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
