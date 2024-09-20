import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
// import Home from '../Screens/HomePage/Home';


import Profile from '../Screens/Profile/Profile';
import ViewDeliveryPage from '../Screens/ViewDeliveryLocations/ViewDeliveryPage';
import RouteDisplay from '../Screens/RouteDisplay/RouteDisplay';
import StackNavigations from './StackNavigations';
import AuthContext from '../context/AuthContextProvider';
import { TouchableOpacity } from 'react-native';



export default function TabNavigation() {
  const Tab = createBottomTabNavigator();
  const {deliveryDetails} = useContext(AuthContext);
  const isDisabled = deliveryDetails?.status === "Completed" || deliveryDetails?.status === "Not Assigned" ;
  return (
    <Tab.Navigator  
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,  // Increase the height of the tab bar
          paddingBottom: 10,  // Add padding to ensure the icons are centered
          paddingTop: 10,  // Add padding to adjust icon position
          backgroundColor: '#fff',  // You can set a custom background color
          
        },
        tabBarLabelStyle: {
          fontSize: 14,  // Increase the font size of the labels
          fontWeight: 'bold',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = 'home';
            return <Ionicons name={iconName} size={size + 5} color={color}  />;
          } else if (route.name === 'ViewDeliveryPage') {
            iconName = 'google-maps';
            return <MaterialCommunityIcons name={iconName} size={size + 5} color={color} />;
          } else if (route.name === 'RouteDisplay') {
            iconName = 'route';
            return <FontAwesome5 name={iconName} size={size + 5} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'user-circle-o';
            return <FontAwesome name={iconName} size={size + 5} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Main"
        component={StackNavigations}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ViewDeliveryPage"
        component={ViewDeliveryPage}
        options={{
          tabBarLabel: 'View Delivery',
          tabBarButton: (props) => (
            <TouchableOpacity {...props} disabled={isDisabled} style={[props.style, { opacity: isDisabled ? 0.5 : 1 }]}  />
          ),  // Disable the tab based on the status
        }}
      />
      <Tab.Screen
        name="RouteDisplay"
        component={RouteDisplay}
        options={{
          tabBarLabel: 'Route',
          tabBarButton: (props) => (
            <TouchableOpacity {...props} disabled={isDisabled} style={[props.style, { opacity: isDisabled ? 0.5 : 1 }]}  />
          ),  // Disable the tab based on the status
        }}
      />
   
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
