import AuthContext from '../../context/AuthContextProvider';
import React, { useContext } from "react";
import { Marker } from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function MarkDestinations() {
  const { deliveryDetails } = useContext(AuthContext);

  // Split the visitOrder string and convert it to an array of numbers
  const orderIndices = deliveryDetails.visitOrder.split(",").map(Number);
  
  // Filter out the last '0' if present and take only indices up to 7th index (1 in this case)
  const filteredIndices = orderIndices.slice(0, orderIndices.lastIndexOf(0) !== -1 ? orderIndices.lastIndexOf(0) : orderIndices.length);

  const CustomMarker = ({ coordinate, title, tag, onPress }) => (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={styles.customMarker}>
        <Text style={styles.tag}>{tag}</Text>
      </View>
    </Marker>
  );

  return (
    <>
      {
        filteredIndices.map((orderIndex, index) => {
          const location = deliveryDetails.destinations[orderIndex];
          return (
            <CustomMarker
              key={index}
              coordinate={{
                latitude: location.lat,
                longitude: location.lng,
              }}
              title={
                index === 0
                  ? `Post Office`
                  : `Location ${index}`
              }
              tag={
                index === 0
                  ? (<FontAwesome6 name="building-columns" size={24} color="black" />)
                  : String(index)
              }
            />
          );
        })
      }
    </>
  );
}



const styles = StyleSheet.create({
  customMarker: {
    backgroundColor: "white",
    padding: 7,
    width: 50,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
  },
  tag: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});
