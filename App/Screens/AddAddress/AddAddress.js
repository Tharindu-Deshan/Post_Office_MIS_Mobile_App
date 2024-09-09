// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from "react-native";
// import * as Location from "expo-location";

// const AddAddress = () => {
//   const [city, setCity] = useState("");
//   const [zone, setZone] = useState("");
//   const [houseNumber, setHouseNumber] = useState("");
//   const [members, setMembers] = useState([{ customerId: 1, name: "" }]);

//   const handleMemberChange = (index, field, value) => {
//     const updatedMembers = members.map((member, idx) =>
//       idx === index ? { ...member, [field]: value } : member
//     );
//     setMembers(updatedMembers);
//   };

//   const addMember = () => {
//     const nextCustomerId = members.length + 1;
//     setMembers([...members, { customerId: nextCustomerId, name: "" }]);
//   };

//   const handleSubmit = () => {
//     if (city && zone && houseNumber && members.every((member) => member.name)) {
//       const address = {
//         city,
//         zone,
//         houseNumber,
//         members,
//         location, // includes longitude and latitude
//       };
  
//       Alert.alert(
//         "Form Submitted",
//         `Address: ${JSON.stringify(address, null, 2)}`
//       );
//     } else {
//       Alert.alert("Error", "Please fill all the fields");
//     }
//   };

//   const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
//   const [errorMsg, setErrorMsg] = useState(null);
//   useEffect(() => {
//     // Fetch user's current location and request permissions on component mount
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied"); // Set error message if permissions are denied
//         return;
//       }

//       // Get the user's current location
//       let location = await Location.getCurrentPositionAsync({});
//       setLocation({
//         longitude: location.coords.longitude,
//         latitude: location.coords.latitude,
//       }); // Update state with user's location
//     })();
//   }, []); // Empty dependency array to run once on component mount

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.label}>House Number</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter house number"
//         value={houseNumber}
//         onChangeText={(text) => setHouseNumber(text)}
//       />

//       <Text style={styles.label}>Zone</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter zone"
//         value={zone}
//         onChangeText={(text) => setZone(text)}
//       />

//       <Text style={styles.label}>City</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter city"
//         value={city}
//         onChangeText={(text) => setCity(text)}
//       />

//       <Text style={styles.label}>Location</Text>
//       <View>
//         {location ? (
//           <>
//             <Text>Longitude: {location.longitude}</Text>
//             <Text>Latitude: {location.latitude}</Text>
//           </>
//         ) : (
//           <Text>Fetching location...</Text>
//         )}
//       </View>

//       <Text style={styles.label}>Members</Text>
//       {members.map((member, index) => (
//         <View key={index} style={styles.memberContainer}>
//           <Text>Member : {member.customerId}</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter member name"
//             value={member.name}
//             onChangeText={(text) => handleMemberChange(index, "name", text)}
//           />
//         </View>
//       ))}

//       <Button title="Add Another Member" onPress={addMember} />

//       <View style={styles.submitButton}>
//         <Button title="Submit" onPress={handleSubmit} />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     justifyContent: "center",
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 5,
//   },
//   input: {
//     borderColor: "#ddd",
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   memberContainer: {
//     marginBottom: 15,
//   },
//   submitButton: {
//     marginTop: 20,
//   },
// });

// export default AddAddress;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

const AddAddress = () => {
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [members, setMembers] = useState([{ customerId: 1, name: "" }]);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = members.map((member, idx) =>
      idx === index ? { ...member, [field]: value } : member
    );
    setMembers(updatedMembers);
  };

  const addMember = () => {
    const nextCustomerId = members.length + 1;
    setMembers([...members, { customerId: nextCustomerId, name: "" }]);
  };

  const handleSubmit = () => {
    if (city && zone && houseNumber && members.every((member) => member.name)) {
      const address = {
        city,
        zone,
        houseNumber,
        members,
        location, // includes longitude and latitude
      };

      Alert.alert(
        "Form Submitted",
        `Address: ${JSON.stringify(address, null, 2)}`
      );
    } else {
      Alert.alert("Error", "Please fill all the fields");
    }
  };

  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>House Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter house number"
        value={houseNumber}
        onChangeText={(text) => setHouseNumber(text)}
      />

      <Text style={styles.label}>Zone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter zone"
        value={zone}
        onChangeText={(text) => setZone(text)}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={(text) => setCity(text)}
      />

      <Text style={styles.label}>Location</Text>
      <View style={styles.locationContainer}>
        {location ? (
          <>
            <Text>Longitude:   {location.longitude}</Text>
            <Text>Latitude    :   {location.latitude}</Text>
          </>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>

      <Text style={styles.label}>Members</Text>
      {members.map((member, index) => (
        <View key={index} style={styles.memberContainer}>
          <Text>Member: {member.customerId}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter member name"
            value={member.name}
            onChangeText={(text) => handleMemberChange(index, "name", text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addMember}>
        <Text style={styles.buttonText}>Add Another Member</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f8ff", // Soothing background color
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2, // subtle shadow for depth
  },
  locationContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8ff",
    borderRadius: 8,
  },
  memberContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddAddress;
