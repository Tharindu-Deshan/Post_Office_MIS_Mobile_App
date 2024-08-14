import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CommonLayout from "../../Components/commonLayout/CommonLayout";
import GoogleMapView from "./GoogleMapView";


export default function ViewDeliveryPage() {
  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.title}>View Delivery Locations</Text>
        <View style={styles.mapContainer}>
          <GoogleMapView />
        </View>
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
  },
});
