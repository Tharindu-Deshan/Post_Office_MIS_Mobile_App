import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import CommonLayout from '../Components/commonLayout/CommonLayout';
import GoogleMapView from '../Components/DeliveryView/GoogleMapView';
import Header from '../Components/DeliveryView/Header';
import TableDisplay from '../Components/commonLayout/tableDisplay'; 
import { tableHead, tableData } from '../Components/DataHardCoded/tableData'; 
export default function ViewDeliveryPage() {
  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.title}>View Delivery Locations</Text>
        <Header />
        <View style={styles.mapContainer}>
          <GoogleMapView />
        </View>
        <SafeAreaView style={styles.tableContainer}>
          <TableDisplay tableHead={tableHead} tableData={tableData} />
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1, // Take up half of the screen
  },
  tableContainer: {
    flex: 1, // Take up the other half of the screen
    paddingTop: 10,
  },
});
