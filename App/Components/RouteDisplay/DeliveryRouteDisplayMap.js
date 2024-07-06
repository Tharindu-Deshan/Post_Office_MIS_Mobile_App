import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Button as RNButton } from 'react-native';

import { Provider as PaperProvider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';


import Dropdown from '../commonLayout/dropDown';
import CommonLayout from '../commonLayout/CommonLayout';


export default function DeliveryRootDisplayMaps() {
  const navigation = useNavigation();
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
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      });
    })();
  }, []);

  const zoomIn = () => {
    if (region) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 1 / 5,
        longitudeDelta: region.longitudeDelta * 1 / 5,
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

  return (
    <PaperProvider>
      <CommonLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontWeight:'bold'}}>RouteDisplay</Text>
          
          
          
          {region ? (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
            />
          ) : (
            <Text>Loading map...</Text>
          )}

          <View style={styles.zoomContainer}>
            <RNButton title="Zoom In" onPress={zoomIn} />
            <RNButton title="Zoom Out" onPress={zoomOut} />
          </View>
        </View>
          <View>
              <Dropdown 
                label="Select Last Checkpoint : "
                placeholder={{label:'choose the last checkpoint',value:null}}
                items={[
                  { label: "691/B,Ella rd,Elptiya", value: "691/B,Ella rd,Elptiya" },
                  { label: "692/B,Ella rd,Elptiya", value: "692/B,Ella rd,Elptiya" },
                  { label: "696/B,Ella rd,Elptiya", value: "696/B,Ella rd,Elptiya" },
                ]}
              />
              <Dropdown
                label="Select next Checkpoint : "
                placeholder={{label:'choose the next checkpoint',value:null}}
                items={[
                  { label: "691/B,Ella rd,Elptiya", value: "691/B,Ella rd,Elptiya" },
                  { label: "692/B,Ella rd,Elptiya", value: "692/B,Ella rd,Elptiya" },
                  { label: "696/B,Ella rd,Elptiya", value: "696/B,Ella rd,Elptiya" },
                ]}
              
              />

          </View>
        
          <Button style={{marginBottom:40}} mode="contained" onPress={() => navigation.navigate('Home')}>
              End journey
          </Button>
        </CommonLayout>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('screen').width * 0.89,
    height: Dimensions.get('screen').height * 0.5,
    display: 'flex',
    alignContent: 'center',
    marginTop:20
  },
  zoomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    bottom: 20,
    width: '100%',
  },
});
