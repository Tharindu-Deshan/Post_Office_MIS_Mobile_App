// CustomMarker.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";



const MapMarker = ({ coordinate, title, tag, onPress }) => (
  <Marker coordinate={coordinate} onPress={onPress}>
    <View style={styles.customMarker}>
      <Text style={styles.tag}>{tag}</Text>
    </View>
  </Marker>
);

const styles = StyleSheet.create({
  customMarker: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
  },
  tag: {
    color: "black",
    fontWeight: "bold",
  },
});

export default MapMarker;
