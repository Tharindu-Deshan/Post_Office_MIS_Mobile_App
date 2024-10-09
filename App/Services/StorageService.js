// src/services/storageService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Store the current index
export const storeCurrentIndex = async (index) => {
  try {
    await AsyncStorage.setItem('currentIndex', index.toString());
  } catch (error) {
    console.error('Error storing current index', error);
  }
};

// Retrieve the current index
export const getCurrentIndex = async () => {
  try {
    const value = await AsyncStorage.getItem('currentIndex');
    if (value !== null) {
      return parseInt(value); // If index exists, return it as an integer
    }
    return 1; // If no value is found, return 1
  } catch (error) {
    console.error('Error retrieving current index', error);
    return null;
  }
};

// Remove the current index from storage
export const removeCurrentIndex = async () => {
  try {
    await AsyncStorage.removeItem('currentIndex');
  } catch (error) {
    console.error('Error removing current index', error);
  }
};



// Store the dutystatus
export const storeStartDutyStatus = async (condition) => {
  try {
    await AsyncStorage.setItem('dutystatus', condition.toString());
  } catch (error) {
    console.error('Error storing current status', error);
  }
};

// Retrieve the current index
export const getStartDutyStatus = async () => {
  try {
    const value = await AsyncStorage.getItem('dutystatus');
    if (value !== null) {
      return value === 'true'; // Convert the string 'true' or 'false' to a boolean
    }
    return null; // Return null if no value is found
  } catch (error) {
    console.error('Error retrieving current status:', error.message);
    return null; // Fallback to null in case of an error
  }
};

export const removeStartDutyStatus = async () => {
  try {
    await AsyncStorage.removeItem('dutystatus');
    console.log('Duty status removed successfully');
  } catch (error) {
    console.error('Error removing duty status:', error.message);
  }
};


