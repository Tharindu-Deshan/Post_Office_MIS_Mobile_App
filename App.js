import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import TabNavigation from './App/Navigations/TabNavigation';
import LoginScreen from './App/Components/specialPages/LoginScreen';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        {isLoggedIn ? (
          <TabNavigation />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
