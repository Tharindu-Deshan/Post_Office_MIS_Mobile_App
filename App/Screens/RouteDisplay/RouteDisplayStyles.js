import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },
    map: {
      flex: 10,
    },
    customMarker: {
      backgroundColor: "white",
      padding: 5,
      borderRadius: 5,
      borderColor: "black",
      borderWidth: 1,
      alignItems: "center",
    },
    tag: {
      color: "black",
      fontWeight: "bold",
    },
    buttonContainer: {
      marginTop: 3,
      flexDirection: "row",
      justifyContent: "flex-start", // Distribute space between buttons
      backgroundColor: "#fff7ed",
      borderRadius: 30,
      padding: 10,
      marginHorizontal: 10, // Adds spacing between screen edges and the buttons
      alignItems: "center", // Align buttons vertically in the center to prevent stretching
    },
    firstbuttoncontainer: {
      flexDirection: "column",
    },
    currentpositionnumber: {
      borderRadius: 10,
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      height: 50,
      width: 50,
      textAlignVertical: "center",
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      paddingVertical: 5,
      marginLeft: 15,
    },
    viewDetailsButton: {
      marginTop: 5,
      backgroundColor: "#c3cdce",
      borderRadius: 5,
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
    },
    detailbuttontext: {
      fontWeight: "bold",
      fontSize: 15,
      padding: 0,
    },
    secondbuttoncontainer: {
      marginLeft: 10,
      flexDirection: "row", // Align buttons horizontally
      alignItems: "center", // Vertically center the buttons
      marginTop: 10, // Adjust margin as needed
    },
    arrivedButtonContainer: {
      backgroundColor: "#2c2a42", // Button color
      paddingVertical: 20, // Adjust vertical padding
      borderRadius: 10, // Rounded corners
      justifyContent: "center",
      alignItems: "center", // Center the button text
      paddingHorizontal: 30,
      marginLeft: 10, // Spacing between
    },
    arrievedtext: {
      fontWeight: "bold",
      fontSize: 17,
      color: "white",
    },
    nextLocationButton: {
      backgroundColor: "#c6cf11", // Button color
      // backgroundColor: "#006666", // Button color
      paddingVertical: 20, // Adjust vertical padding
      borderRadius: 10, // Rounded corners
      justifyContent: "center",
      alignItems: "center", // Center the button text
      marginLeft: 10, // Spacing between the buttons
      paddingHorizontal: 10,
    },
    nextlocationtext: {
      fontWeight: "bold",
      fontSize: 17,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    //------------------
    modalContent: {
      width: 310,
      height: 440,
      padding: 20,
      backgroundColor: "#f3f4f6",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 1,
      borderColour: "black",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    statusButtons: {
      flexDirection: "column",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    deliveredButton: {
      backgroundColor: "#2c2a42",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },
    undeliveredButton: {
      backgroundColor: "#c6cf11",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    confirmCancelButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    // confirmButton: {
    //   backgroundColor: "#f33",
    //   paddingVertical: 10,
    //   paddingHorizontal: 20,
    //   borderRadius: 5,
    // },
    cancelButton: {
      backgroundColor: "#fff",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      borderColor: "000",
    },
    buttonText: {
      color: "#000",
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonTextDelivered: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    detailsclosebuttonText: {
      // color: "red",
      fontWeight: "bold",
      textAlign: "center",
      borderWidth: 2,
      // borderColor: "red",
      borderRadius: 10,
      padding: 6,
    },
    modalText: {
      padding: 10,
    },
  
    finalbuttoncompleted: {
      backgroundColor: "#008080", // Button color
      paddingVertical: 20, // Adjust vertical padding
      borderRadius: 10, // Rounded corners
      justifyContent: "center",
      alignItems: "center", // Center the button text
      paddingHorizontal: 35,
      paddingLeft: 40,
      marginLeft: 20,
    },
    finalbuttontext: {
      color: "black",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 17,
    },
    scrollView: {
      paddingHorizontal: 20, // Padding on left and right for better spacing
      paddingVertical: 10, // Padding on top and bottom for better readability
      backgroundColor: "#f9f9f9", // Light background color for better text contrast
      borderRadius: 10, // Rounded corners for a more polished look
      marginBottom: 20, // Margin to create space between ScrollView and other components
    },
    confirmButton: {
      backgroundColor: "#fef2f2", // Regular button color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      borderWidth: 3,
      borderColor: "red",
    },
  
    // Styles for the confirm button when disabled
    disabledButton: {
      // backgroundColor: "#f33", // Disabled button color (can also be lighter)
      opacity: 0.25, // Reduce opacity to indicate disabled state
    },
    floatingBackButton: {
      position: "absolute", // Floating effect to stay on top
      width: 70,
      height: 60,
      backgroundColor: "#c6cf11", // A nice soft blue color for the previous button
      borderRadius: 9, // Circular button
      justifyContent: "center", // Center the icon inside the button
      alignItems: "center", // Center the icon horizontally
      right: 335, // Distance from the left edge
      bottom: 140, // Distance from the bottom edge
      elevation: 0, // Shadow for Android
  
      // shadowOffset: { width: 0, height: 4 }, // Deeper shadow for more dimension
      shadowOpacity: 0.3, // Softer shadow opacity
      shadowRadius: 4, // Softer shadow radius
      borderWidth: 2, // Add subtle border
      borderColor: "#ffffff", // White border for contrast
      zIndex: 100, // Ensure the button stays on top of all other elements
    },
  
    prevButtonText: {
      color: "#000", // White text for contrast
      fontWeight: "bold", // Bold text for emphasis
      fontSize: 16, // Text size
    },
  });

  export default styles;