
//view delivery page
//homes where the deliveries to go in the map (not the route)

import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import {   Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { postmanData } from '../Components/DataHardCoded/postmanData';



export default function Home() {
  const navigation=useNavigation();
  const [status, setStatus] = useState(null);
  const [name,setName]=useState(null);
  const [loading, setLoading] = useState(true);
  const postmanId = 1; //for testing purpose only

  useEffect(() => {
    const getStatus = () => {
      setLoading(true);
      const postman = postmanData.find(p => p.id === postmanId);
      if (postman) {
        setStatus(postman.status);
        setName(postman.name); // Set the name
      } else {
        setStatus('not assigned');
        setName('Unknown'); // Set a default name if not found
      }
      setLoading(false);
    };

    getStatus();
  }, [postmanId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
   
    <View style={{padding:20}}>

    <Text style={{padding:20,fontWeight:'bold',marginTop:20,fontSize:20}}>Hello  {name}  !! </Text>

    

     <Text style={{fontWeight:'bold',marginTop:20}}>Your Status :  {status}  </Text>


     <Button style={{marginTop:20}} mode="contained" onPress={() => navigation.navigate('RouteDisplay')}>
            Start Delivery
      </Button>

      <Button style={{marginTop:20}} mode="contained" onPress={() => navigation.navigate('RouteDisplay')}>
            Stop Delivery
      </Button>
     
    </View>
    
  )
}