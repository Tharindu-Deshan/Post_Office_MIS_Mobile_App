import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from 'polyline';

import { deliveryObject } from '../../Components/DataHardCoded/deliveryObject';
import CommonLayout from '../../Components/commonLayout/CommonLayout';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDtman-i1xVwD90dMS3HgHc_0CoobjBelc';


const CustomMarker = ({ coordinate, title, tag }) => (
  <Marker coordinate={coordinate} title={title}>
    <View style={styles.customMarker}>
      <Text style={styles.tag}>{tag}</Text>
    </View>
  </Marker>
);

export default function DeliveryRouteDisplayMaps() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start from the first destination in visitOrder
  const [region, setRegion] = useState({
    latitude: deliveryObject.destinations[0].lat,
    longitude: deliveryObject.destinations[0].lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const mapViewRef = useRef(null);
  const zoomedInRef = useRef(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
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
            getRoute(currentLocation, deliveryObject.destinations[deliveryObject.visitOrder[currentIndex]]);
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
        const points = polyline.decode(response.data.routes[0].overview_polyline.points);
        const coords = points.map(point => {
          return {
            latitude: point[0],
            longitude: point[1],
          };
        });

        setRoute(coords);
      } else {
        console.log('No routes found');
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  useEffect(() => {
    if (currentLocation && currentIndex < deliveryObject.visitOrder.length) {
      getRoute(currentLocation, deliveryObject.destinations[deliveryObject.visitOrder[currentIndex]]);
    }
  }, [currentIndex]);

  const nextDestination = () => {
    if (currentIndex < deliveryObject.visitOrder.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowUpdateStatus(true);
    } else if (currentIndex === deliveryObject.visitOrder.length - 1) {
      setRoute([]);
      setShowUpdateStatus(true);
    }
  };

  const updateStatus = () => {
    setModalVisible(true);
  };

  const confirmStatusUpdate = () => {
    // Handle status update logic here
    setModalVisible(false);
  };

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
    mapViewRef.current.animateToRegion(region);
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
    mapViewRef.current.animateToRegion(region);
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold', marginLeft: '35%' }}>Route display</Text>
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
            <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
          )}
        </MapView>
        <Text style={{ fontWeight: 'bold' }}>Total Destinations: {deliveryObject.destinations.length}</Text>
        <View style={styles.zoomContainer}>
          <Button title="Zoom In" onPress={zoomIn} />
          <Button title="Zoom Out" onPress={zoomOut} />
        </View>
        <View style={styles.zoomContainer}>
          <Button title="Arrived" onPress={nextDestination} />
          {showUpdateStatus && <Button title="Update Status" onPress={updateStatus} />}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Update Mail Status</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={confirmStatusUpdate}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  zoomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },
  customMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
  },
  tag: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
