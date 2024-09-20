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



// // Save data to local storage
// export const storeData = async (key, value) => {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//     console.log(`Data stored under key: ${key}`);
//   } catch (e) {
//     console.error('Failed to store data', e);
//   }
// };

// // Get data from local storage
// export const getData = async (key) => {
//   try {
//     const value = await AsyncStorage.getItem(key);
//     if (value !== null) {
//       console.log(`Data retrieved from key: ${key}`);
//       return JSON.parse(value);
//     }
//     return null;
//   } catch (e) {
//     console.error('Failed to retrieve data', e);
//   }
// };

// // Remove data from local storage
// export const removeData = async (key) => {
//   try {
//     await AsyncStorage.removeItem(key);
//     console.log(`Data removed from key: ${key}`);
//   } catch (e) {
//     console.error('Failed to remove data', e);
//   }
// };

// // Clear all data from local storage
// export const clearAllData = async () => {
//   try {
//     await AsyncStorage.clear();
//     console.log('All data cleared');
//   } catch (e) {
//     console.error('Failed to clear data', e);
//   }
// };
