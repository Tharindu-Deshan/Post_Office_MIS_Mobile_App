import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import AuthContext from "../../context/AuthContextProvider";
import Feather from "@expo/vector-icons/Feather";

const imageUser = require("../Profile/e03b2bf1-678e-49f1-998d-d5b03fb09a99.webp");

export default function Profile() {
  const { userId, userName, email, handleLogout, ...others } =
    useContext(AuthContext);

  return (
    <>
      <View
        style={{
          backgroundColor: "#000",
          borderBottomLeftRadius: 50,
          paddingTop: 40,
          borderBottomRightRadius: 50,
        }}
      >
        <View style={styles.profileContainer}>
          <Image source={imageUser} style={styles.profileImage} />
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>POSTMAN</Text>

  
        </View>
      </View>
      <View>
        <View style={styles.detailsSection} testID="detailsSection">
          <View style={styles.detailsItemField}>
            <Feather
              name="user"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.detailsText}>
              User Name : <Text style={styles.detailsItem}>{userName}</Text>
            </Text>
          </View>
          <View style={styles.detailsItemField}>
            <Feather
              name="hash"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.detailsText}>
              Postman ID : <Text style={styles.detailsItem}>{userId}</Text>
            </Text>
          </View>
          <View style={styles.detailsItemField}>
            <Feather
              name="phone"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.detailsText}>
              Contact : <Text style={styles.detailsItem}>076 551 6789</Text>
            </Text>
          </View>
          <View style={styles.detailsItemField}>
            <Feather
              name="mail"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.detailsText}>
              Email : <Text style={styles.detailsItem}>{email}</Text>
            </Text>
          </View>
         
        </View>
      </View>

      <View contentContainerStyle={styles.container}>
        {/* Feedback and Help & Support Section  */}

        {/* Centralized Logout Button at the bottom */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={25} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        {/* Spacer View */}
        <View style={styles.spacer}></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f8ff", // Softer background color for a calm feel
    padding: 20,
    // marginTop: 50,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
    // backgroundColor:"#000"
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
    marginTop: 30,
    width: "100%",
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 18,
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
   
  },
  detailsItemField: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
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

  supportSection: {
    width: "100%",
    marginBottom: 20, // Add space between the section and the logout button
    paddingHorizontal: 20,
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
    marginTop: 40,
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
