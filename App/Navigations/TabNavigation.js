import { View, Text } from 'react-native'
import React from 'react'
import Home from '../Screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import ViewDeliveryPage from '../Screens/ViewDeliveryPage';
import Profile from '../Screens/Profile';
import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import RouteDisplay from '../Screens/RouteDisplay';
import MailStatusUpdate from '../Screens/MailStatusUpdate';
import { Foundation } from '@expo/vector-icons';



export default function TabNavigation() {
    const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator  screenOptions={{
        headerShown:false
    }}>
        <Tab.Screen name = "Home" component ={Home}
            options={{
                    tabBarLabel:'Home',
                    tabBarIcon : ({color,size})=>(
                        <Ionicons name="home" color = {color} size = {size}/>
                    ),

            }}
        />
        <Tab.Screen name = "ViewDeliveryPage" component ={ViewDeliveryPage}
            options={{
                tabBarLabel:'View Delivery',
                tabBarIcon : ({color,size})=>(
                    <MaterialCommunityIcons name="google-maps" color = {color} size = {size}/>
                ),
              

        }}
        />
        <Tab.Screen name ="RouteDisplay" component ={RouteDisplay}
            options={{
                tabBarLabel:'Route',
                tabBarIcon : ({color,size})=>(
                    <FontAwesome5 name="route" color = {color} size = {size}/>
                ),
                

        }}
        />
        <Tab.Screen name = "MailStatusUpdate" component ={MailStatusUpdate}
            options={{
                tabBarLabel:'Update Status',
                tabBarIcon : ({color,size})=>(
                    <Foundation name="clipboard-notes" color = {color} size = {size}/>
                ),
                
              

        }}
        />

        <Tab.Screen name = "Profile" component ={Profile}
            options={{
                tabBarLabel:'Profile',
                tabBarIcon : ({color,size})=>(
                    <FontAwesome name="user-circle-o" color = {color} size = {size}/>
                ),

        }}
        />
    </Tab.Navigator>
  )
}