import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location'; // Import for handling location services
import { deliveryObject } from '../../Components/DataHardCoded/deliveryObject'; // Importing the delivery object data
import { useNavigation } from "@react-navigation/native"; // Navigation hook for moving between screens
import CommonLayout from '../../Components/commonLayout/CommonLayout'; // Custom layout component


export default function ViewDeliveryPage() {
  const navigation = useNavigation(); // Hook to use navigation between screens
  const [location, setLocation] = useState(null); // State for storing the user's current location
  const [region, setRegion] = useState(null); // State for storing the map region
  const [errorMsg, setErrorMsg] = useState(null); // State for storing any location permission error
  const mapRef = useRef(null); // Ref to control the MapView programmatically
  
  
  
  //const markers = deliveryObject.destinations; // Get destinations from deliveryObject
  // const visitOrder = deliveryObject.visitOrder; // Get visiting order from deliveryObject

  useEffect(() => {
    // Fetch user's current location and request permissions on component mount
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied'); // Set error message if permissions are denied
        return;
      }

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location); // Update state with user's location
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 50,
        longitudeDelta: 100,
      }); // Set initial region to focus on user's location
    })();
  }, []); // Empty dependency array to run once on component mount

  return (
    <CommonLayout>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {/* MapView component with Google Maps as the provider */}
          <MapView
            ref={mapRef} // Assign ref for programmatic control
            provider={PROVIDER_GOOGLE} // Use Google Maps as provider
            showsUserLocation={true} // Show user's current location
            showsMyLocationButton={true} // Show the button to center on user's location
            style={styles.map} // Apply styles to the map
            region={region} // Set the map's region
            onRegionChangeComplete={(region) => setRegion(region)} // Update region state when the map region changes
          >
            {/* Loop through the visitOrder array to display numbered markers */}
            {deliveryObject.visitOrder.map((orderIndex, index) => {
              const marker = deliveryObject.destinations[orderIndex]; // Get the marker according to the visiting order
              return (
                <Marker
                  key={index} // Unique key for each marker
                  coordinate={{ latitude: marker.lat, longitude: marker.lng }} // Marker position (latitude and longitude)
                >
                  {/* Custom View to display marker number */}
                  <View style={styles.numberOverlay}>
                    <Text style={styles.markerText}>{index + 1}</Text>
                  </View>
                  
                  {/* Callout component to show info when marker is clicked */}
                  <Callout>
                    <Text>{`Marker ${index + 1}`}</Text>
                    <Text>{`Address: ${marker.lat}, ${marker.lng}`}</Text>
                    
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>

        {/* Bottom section for displaying total destinations and action buttons */}
        <View style={styles.bottomSection}>
          <Text style={styles.detailText}>Total Destinations: {deliveryObject.destinations.length}</Text> 

          <View style={styles.buttonContainer}>
            {/* Button to navigate to the RouteDisplay screen */}
            <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("RouteDisplay")}>
              <Text style={styles.buttonText}>Start Duty</Text>
            </TouchableOpacity>

            {/* Button to end the delivery duty (currently not functional) */}
            {/* <TouchableOpacity style={styles.endButton} onPress={() => {}}>
              <Text style={styles.buttonText}>End Duty</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </CommonLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8daef',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    width: '90%',
    backgroundColor: 'rgba(230, 230, 255, 0.8)',
    padding: 25,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 40,
  },
  detailText: {
    fontSize: 17,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    // fontWeight: 'bold',
    textShadowColor: '#AAA',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  endButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  numberOverlay: {
    position: 'absolute', // Overlay on the marker
    //top: -15, // Position it above the marker
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)', // Semi-transparent background
    borderRadius: 15,
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  markerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
