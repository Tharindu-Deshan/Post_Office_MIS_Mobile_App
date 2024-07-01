import { GOOGLE_MAPS_API_KEY } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function GoogleMapView() {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  return (
    <View style={{ marginTop: 20 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        style={{
          width: Dimensions.get('screen').width * 0.89,
          height: Dimensions.get('screen').height * 0.23,
          borderRadius: 20,
        }}
        region={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
      />
      <View style={{ padding: 20 }}>
        {latitude && longitude ? (
          <Text>Latitude: {latitude}, Longitude: {longitude}</Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
        {errorMsg && <Text>{errorMsg}</Text>}
      </View>
    </View>
  );
}
