// AddressModal.js
import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const AddressModal = ({ visible, onClose, address }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <ScrollView>
            <Text style={styles.modalTitle}>Success !</Text>
            <Text style={styles.text}><Text style={styles.bold}>City:</Text> {address.city}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Zone:</Text> {address.zone}</Text>
            <Text style={styles.text}><Text style={styles.bold}>House Number:</Text> {address.houseNumber}</Text>

            <Text style={{ fontWeight: 'bold',fontSize: 16}}>Members:</Text>
            {address.members && address.members.length > 0 ? (
              address.members.map((member, index) => (
                <Text key={index} style={styles.text}>
                  {member.name} 
                </Text>
              ))
            ) : (
              <Text>No members available</Text>
            )}
{/* 
            <Text style={styles.modalTitle}>Location:</Text>
            <Text style={styles.text}><Text style={styles.bold}>Latitude:</Text> {address.location.latitude}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Longitude:</Text> {address.location.longitude}</Text> */}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    display: 'flex',
   alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddressModal;
