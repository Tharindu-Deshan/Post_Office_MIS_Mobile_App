import React from 'react';
import { View, StyleSheet } from 'react-native';

const CommonLayout = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingTop:28,
    backgroundColor:"#000",
    flex: 1,
  },
});

export default CommonLayout;
 