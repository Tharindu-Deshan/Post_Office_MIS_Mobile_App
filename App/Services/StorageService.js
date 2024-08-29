// src/services/storageService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to local storage
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`Data stored under key: ${key}`);
  } catch (e) {
    console.error('Failed to store data', e);
  }
};

// Get data from local storage
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log(`Data retrieved from key: ${key}`);
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    console.error('Failed to retrieve data', e);
  }
};

// Remove data from local storage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed from key: ${key}`);
  } catch (e) {
    console.error('Failed to remove data', e);
  }
};

// Clear all data from local storage
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared');
  } catch (e) {
    console.error('Failed to clear data', e);
  }
};
