import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { deliveryObject } from '../../Components/DataHardCoded/deliveryObject';
import { useNavigation } from "@react-navigation/native";
import CommonLayout from '../../Components/commonLayout/CommonLayout';

export default function ViewDeliveryPage() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  const markers = deliveryObject.destinations;
  const visitOrder = deliveryObject.visitOrder;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  return (
    <CommonLayout>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            style={styles.map}
            region={region}
            onRegionChangeComplete={(region) => setRegion(region)}
          >
            {/* Loop through the visitOrder array to display numbered markers */}
            {visitOrder.map((orderIndex, index) => {
              const marker = markers[orderIndex]; // Get the marker according to the visiting order
              return (
                <Marker
                  key={index}
                  coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                >
                  {/* Default Google Marker with number overlay */}
                  <View style={styles.numberOverlay}>
                    <Text style={styles.markerText}>{index + 1}</Text>
                  </View>
                  <Callout>
                    <Text>{`Marker ${index + 1}`}</Text>
                    <Text>{`Address: ${marker.lat}, ${marker.lng}`}</Text>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>

        {/* Bottom Section for Details and Button */}
        <View style={styles.bottomSection}>
          <Text style={styles.detailText}>Total Destinations: {deliveryObject.destinations.length}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton}  onPress={() => navigation.navigate("RouteDisplay")}>
              <Text style={styles.buttonText}>Start Duty</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endButton} onPress={() => {}}>
              <Text style={styles.buttonText}>End Duty</Text>
            </TouchableOpacity>
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
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 40,
  },
  detailText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
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
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    color: 'white',
    fontSize: 16,
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
