import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, Button, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { markers } from '../DataHardCoded/markerLocations';


export default function GoogleMapView() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

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

  const zoomIn = () => {
    if (region) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta*1/5 ,
        longitudeDelta: region.longitudeDelta*1/5 ,
      }, 1000);
    }
  };

  const zoomOut = () => {
    if (region) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 5,
        longitudeDelta: region.longitudeDelta * 5,
      }, 1000);
    }
  };

  useEffect(() => {
    console.log(markers); // Log markers only once when component mounts
  }, []);

  return (
    <View style={{  }}>
      <MapView 
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>

      <View style={styles.zoomContainer}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View>

      <View style={{ padding: 20 }}>
        {location ? (
          <Text>Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}</Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
        {errorMsg && <Text>{errorMsg}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("screen").width * 0.89,
    height: Dimensions.get("screen").height * 0.23,
    display: "flex",
    alignContent: "center",
  },
  zoomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
    bottom: 0,
    width: "100%",
  },
});
