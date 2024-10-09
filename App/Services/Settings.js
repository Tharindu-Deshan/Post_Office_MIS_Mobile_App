import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

function Settings() {
  const [message, setMessage] = useState('Settings Screen');

  const handlePress = () => {
    setMessage('Settings Updated');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{message}</Text>
      <TouchableOpacity onPress={handlePress} style={{backgroundColor:"#f2fa5d", height:60 , width : 200 ,display:"flex", flexDirection:"row", alignItems:"center" , justifyContent:"center"}}>
        <Text style={{fontSize:20}}>Update Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Settings;
