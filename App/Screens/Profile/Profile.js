import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import AuthContext from "../../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";

const imageUser = require("../Profile/e03b2bf1-678e-49f1-998d-d5b03fb09a99.webp");

export default function Profile() {
  
  const { handleLogout, ...others } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={imageUser} style={styles.profileImage} />
        <Text style={styles.profileName}>Tharindu</Text>
        <Text style={styles.profileEmail}>tharindudeshan@example.com</Text>

        {/* Edit Profile Button below the email */}
        <TouchableOpacity style={styles.updateProfileButton} onPress={{}}>
          <Feather name="edit" size={24} color="#fff" />
          <Text style={styles.buttonTexthelp}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailsContainer}>
          <Feather name="hash" size={20} color="#4a4a4a" style={styles.icon} />
          <Text style={styles.detailsText}>
            Employee ID  :  <Text style={styles.detailsItem}>EMP123456</Text>
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Feather name="phone" size={20} color="#4a4a4a" style={styles.icon} />
          <Text style={styles.detailsText}>
            Contact  :  <Text style={styles.detailsItem}>076 551 6789</Text>
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Feather name="sun" size={20} color="#4a4a4a" style={styles.icon} />
          <Text style={styles.detailsText}>
            Theme Selection  :  <Text style={styles.detailsItem}>Light Mode</Text>
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Feather name="lock" size={20} color="#4a4a4a" style={styles.icon} />
          <Text style={styles.detailsText}>
            Password  :  <Text style={styles.detailsItem}>***********</Text>
          </Text>
        </View>
      </View>

      {/* Feedback and Help & Support Section */}
      <View style={styles.supportSection}>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => {
            /* Navigate to Help & Support page */
          }}
        >
          <Feather name="help-circle" size={24} color="#fff" />
          <Text style={styles.buttonTexthelp}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      {/* Centralized Logout Button at the bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={25} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Spacer View */}
      <View style={styles.spacer}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e8daef", // Softer background color for a calm feel
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2, // Add a soft border around the image for a polished look
    borderColor: "#ddd",
  },
  profileName: {
    fontSize: 26, // Slightly larger font size
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  detailsSection: {
    width: "100%",
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15, // Increased border-radius for softer corners
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }, // Slightly deeper shadow for more depth
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#eee", // Softer border for detail sections
    paddingVertical: 15,
    // borderColor: "black", // Custom blue border color
    // borderWidth: 1, // Adjust the thickness of the border
    // borderStyle:"dashed"
  },

  detailsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 0,
  },
  detailsItem: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#666",
  },
  updateProfileButton: {
    flexDirection: "row",
    width: "60%", // Set width so it's well centered
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: "#4caf50", // Solid green for Edit Profile
    borderColor: "#46a049",
    borderWidth: 1,
    marginTop: 0,
  },
  supportSection: {
    width: "100%",
    marginBottom: 20, // Add space between the section and the logout button
    paddingHorizontal: 20,
  },
  supportButton: {
    flexDirection: "row",
    width: "90%", // Full width
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: "#5dade2", // Blue color for Support buttons
    borderColor: "#3498db",
    borderWidth: 1,
    marginBottom: 10, // Spacing between Feedback and Help & Support buttons
    marginLeft: 20,
  },
  buttonTexthelp: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logoutButton: {
    flexDirection: "row",
    width: "90%", // Centered button at the bottom
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: "#ff4d4d", // Solid red for Logout
    borderColor: "#ff1a1a",
    borderWidth: 1,
    marginBottom: 20,
    marginLeft: 20,
    // Spaced out from the bottom
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    textTransform: "uppercase",
    letterSpacing: 1, // Increased letter spacing for better readability
  },
  spacer: {
    height: 80,
  },
  icon: {
    marginRight: 10, // Add space between icon and text
  },
  detailsText: {
    marginLeft: 10, // Ensure there's spacing between icon and text
  },
});
