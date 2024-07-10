import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from 'polyline';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBbjF0HeGK-nW2YxLu27QDxVXQQeDvQjAU'

const locations = [
  { latitude: 6.2774, longitude: 80.145, tag: '1' },
  { latitude: 6.2974, longitude: 80.1453, tag: '2' },
  { latitude: 6.3, longitude: 80.1453, tag: '3' },
  { latitude: 6.2874, longitude: 80.149, tag: '4' },
  { latitude: 6.31, longitude: 80.1463, tag: '5' },
  { latitude: 6.3, longitude: 80.1553, tag: '6' }
];

const CustomMarker = ({ coordinate, title, tag }) => (
  <Marker coordinate={coordinate} title={title}>
    <View style={styles.customMarker}>
      <Text style={styles.tag}>{tag}</Text>
    </View>
  </Marker>
);

export default function Profile() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [region, setRegion] = useState({
    latitude: locations[0].latitude,
    longitude: locations[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
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
            getRoute(currentLocation, locations[currentIndex]);
          }
        }
      );
    })();
  }, [currentLocation]);

  const getRoute = async (currentLoc, destinationLoc) => {
    if (currentIndex < locations.length) {
      const origin = `${currentLoc.latitude},${currentLoc.longitude}`;
      const destination = `${destinationLoc.latitude},${destinationLoc.longitude}`;

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
    }
  };

  useEffect(() => {
    if (currentLocation && currentIndex < locations.length) {
      getRoute(currentLocation, locations[currentIndex]);
    }
  }, [currentIndex]);

  const nextDestination = () => {
    if (currentIndex < locations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === locations.length - 1) {
      setRoute([]);
    }
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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapViewRef}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {locations.map((location, index) => (
          <CustomMarker
            key={index}
            coordinate={location}
            title={`Location ${index + 1}`}
            tag={location.tag}
          />
        ))}
        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
      <Text style={{ fontWeight: 'bold' }}> Total Destinations: {locations.length} </Text>
      <View style={styles.zoomContainer}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View>
      <View style={styles.zoomContainer}>
        <Button title="Next Destination" onPress={nextDestination} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  zoomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 50,
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
});
