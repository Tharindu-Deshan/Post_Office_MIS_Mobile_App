import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function Dropdown({label,placeholder,items}) {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} : </Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedValue(value)}
        items={items}
        style={pickerSelectStyles}
        placeholder={placeholder}
      />
      {selectedValue && <Text style={styles.selectedValue}>Selected: {selectedValue}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  label: {
    marginBottom: 10,
    fontSize: 12,
  },
  selectedValue: {
    marginTop: 10,
    fontSize: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  
  
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
