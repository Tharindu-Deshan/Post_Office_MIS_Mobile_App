import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const LoginFailedModal = ({ visible, onClose, closeAlert }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>Login Failed!</Text>
          <Text style={styles.alertContent}>Incorrect Email or Password !</Text>
          <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay for more emphasis
    },
    alertBox: {
      width: 320,
      padding: 30,
      backgroundColor: "#ffffff",
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10, // Adds shadow for Android
      alignItems: "center",
    },
    alertText: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 15,
      color: "#333333",
      textAlign: "center",
    },
    alertContent: {
      fontSize: 16,
      marginBottom: 20,
      color: "#333333",
      textAlign: "center",
    },
    alertButton: {
      paddingVertical: 12,
      paddingHorizontal: 25,
      backgroundColor: "#ff4c4c", // More distinct red color for alert button
      borderRadius: 25,
      alignItems: "center",
      width: "80%", // Slightly smaller button width
    },
    alertButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600", // Bold text for the button
    },
  });
  


export default LoginFailedModal;
