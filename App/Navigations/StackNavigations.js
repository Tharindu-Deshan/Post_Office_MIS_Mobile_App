import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BarCodeScanner from "../Screens/BarCodeScanner/BarCodeScanner";
import AddPerson from "../Screens/AddPerson/AddPerson";
import AddAddress from "../Screens/AddAddress/AddAddress";
import Home from "../Screens/HomePage/Home";

// Create the Stack Navigator
const Stack = createStackNavigator();

const StackNavigations = () => {
  return (
    <Stack.Navigator initialRouteName="Home" >
     <Stack.Screen   name="Home" options={{ headerShown: false }} component={Home} />
      <Stack.Screen name="BarCodeScanner" options={{ title: 'Bar Code Scanner' }} component={BarCodeScanner} />
      <Stack.Screen name="AddPerson" options={{ title: 'Add Person' }} component={AddPerson} />
      <Stack.Screen name="AddAddress" options={{ title: 'Add Address' }}  component={AddAddress}  />
    </Stack.Navigator>
  );
};

export default StackNavigations;
