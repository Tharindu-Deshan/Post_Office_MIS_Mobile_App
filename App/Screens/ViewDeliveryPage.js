import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CommonLayout from '../Components/commonLayout/CommonLayout'
import GoogleMapView from '../Components/Home/GoogleMapView'


export default function ViewDeliveryPage() {
  return (
    <CommonLayout>
    <View >
      <Text style={{padding:10,fontWeight:'bold',textAlign:'center'}}>View Delivery Locations</Text>
      <GoogleMapView/>
    </View>
    </CommonLayout>
  )
}

const styles = StyleSheet.create({
  



});