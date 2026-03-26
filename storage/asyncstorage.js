// storage/asyncstorage.js
// Exp 05 — Local data storage using AsyncStorage
// Key-value based persistent storage

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'calloryx_notes';

// Save a string value against a key
export const saveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('saveItem error:', error);
  }
};

// Retrieve a value by key
export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('getItem error:', error);
    return null;
  }
};

// Remove a value by key
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('removeItem error:', error);
  }
};

// Save meeting note (convenience wrapper)
export const saveMeetingNote = async (note) => {
  await saveItem(NOTES_KEY, note);
};

// Get meeting note (convenience wrapper)
export const getMeetingNote = async () => {
  return await getItem(NOTES_KEY);
};