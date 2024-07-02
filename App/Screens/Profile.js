import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import CommonLayout from '../Components/commonLayout/CommonLayout';

export default function Profile() {
  return (
    <CommonLayout>
      <View style={styles.ParentView}>
        <Text style={styles.text}>Profile</Text>
        <Text style={styles.text}>profile 1</Text>
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  ParentView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // Add background color to check visibility
  },
  text: {
    color: '#000', // Ensure text is black and visible
  },
});
