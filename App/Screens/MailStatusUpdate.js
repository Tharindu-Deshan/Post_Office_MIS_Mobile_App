// MailStatusUpdate.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import CommonLayout from '../Components/commonLayout/CommonLayout';
import PopUp from '../Components/commonLayout/PopUp';

const addresses = [
  '691/B,Ella Rd,Elpitiya',
  '692/A,Ella Rd,Elpitiya',
  '693/C,Ella Rd,Elpitiya',
  '694/C,Ella Rd,Elpitiya',
  '695/B,Ella Rd,Elpitiya',
  '695/B,Ella Rd,Elpitiya',
  // Add more addresses as needed
];

export default function MailStatusUpdate() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleOptionSelect = (option) => {
    setModalVisible(false);
    console.log(`Selected option: ${option} for address: ${selectedAddress}`);
    // Handle the selected option as needed
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.address}>{item}</Text>
      <Button
        title="Change Status"
        onPress={() => {
          setSelectedAddress(item);
          setModalVisible(true);
        }}
      />
    </View>
  );

  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Mail Status Update</Text>
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <PopUp
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectOption={handleOptionSelect}
        />
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  address: {
    flex: 1,
    fontSize: 16,
  },
});
