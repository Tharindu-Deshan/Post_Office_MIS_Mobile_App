import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import CommonLayout from "../Components/commonLayout/CommonLayout";
import GoogleMapView from "../Components/DeliveryView/GoogleMapView";
import Header from "../Components/DeliveryView/Header";

import { tableHead, tableData } from "../Components/DataHardCoded/tableData";
import DisplayTable from "../Components/commonLayout/DisplayTable";
import axios from "axios";

export default function ViewDeliveryPage() {
  const postmanId = 4; //for testing purpose only
  // const [deliveryId, setDeliveryId] = useState(5);
  const [data, setData] = useState(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDelivery();
    // console.log("Delivery ID: ", deliveryId);
  }, []);

  const fetchDelivery = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8082/api/postman/view-delivery/get-today-delivery/${postmanId}`
      );
      console.log(response.data);
      setData(response.data);
      setDestinations(response.data.destinations);
    } catch (e) {
      console.error("Error fetching delivery data", e.message);
    }
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.title}>View Delivery Locations</Text>
        {/* <Header /> */}
        <View style={styles.mapContainer}>
          <GoogleMapView />
        </View>
        <Text>Mail Id:={data.date}</Text>
        <SafeAreaView style={styles.tableContainer}>
          <DisplayTable tableHead={tableHead} tableData={tableData} />
        </SafeAreaView>
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
    flex: 1, // Take up half of the screen
  },
  tableContainer: {
    flex: 1, // Take up the other half of the screen
    paddingTop: 10,
  },
});
