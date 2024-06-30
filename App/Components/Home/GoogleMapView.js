import { View, Text } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps';

export default function GoogleMapView() {
  return (
    <View>
      <MapView  style ={{width:400,
        height:200
      }}> 

      </MapView>
    </View>
  )
}