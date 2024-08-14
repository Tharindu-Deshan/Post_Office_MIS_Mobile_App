import { View, StyleSheet } from 'react-native';
import React from 'react';
import DeliveryRouteDisplayMaps from './DeliveryRouteDisplayMaps';


export default function RouteDisplay() {
  return (
    <View style={styles.container}>
      <DeliveryRouteDisplayMaps />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
