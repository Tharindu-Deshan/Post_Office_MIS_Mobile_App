import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Home from '../Screens/HomePage/Home';



import Profile from '../Screens/Profile/Profile';
import ViewDeliveryPage from '../Screens/ViewDeliveryLocations/ViewDeliveryPage';
import RouteDisplay from '../Screens/RouteDisplay/RouteDisplay';


export default function TabNavigation() {
  const Tab = createBottomTabNavigator();

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
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Ionicons name={iconName} size={size + 5} color={color} />;
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
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ViewDeliveryPage"
        component={ViewDeliveryPage}
        options={{
          tabBarLabel: 'View Delivery',
        }}
      />
      <Tab.Screen
        name="RouteDisplay"
        component={RouteDisplay}
        options={{
          tabBarLabel: 'Route',
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
