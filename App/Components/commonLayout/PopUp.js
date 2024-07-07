// common/popup.js
import React from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const PopUp = ({ visible, onClose, onSelectOption }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select an Option</Text>
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => onSelectOption('Option 1')}
          >
            <Text style={styles.optionText}>Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => onSelectOption('Option 2')}
          >
            <Text style={styles.optionText}>Return To Sender</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => onSelectOption('Option 3')}
          >
            <Text style={styles.optionText}>Address Update</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PopUp;
