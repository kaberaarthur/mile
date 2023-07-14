import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import * as ImagePicker from "expo-image-picker";

import { db, auth } from "../firebaseConfig";
import { setUser } from "../slices/userSlice";

const UpdateProfileScreen = ({ navigation, route }) => {
  const { phoneNumber, expectedCode } = route.params;
  const [profilePicture, setProfilePicture] = useState(null);
  const [riderName, setRiderName] = useState("");
  const [riderEmail, setRiderEmail] = useState("");
  const [riderProfileID, setRiderProfileID] = useState(0);
  const [updatedProfile, setUpdatedProfile] = useState(0);
  const [authID, setAuthID] = useState(0);
  const [generatedPassword, setGeneratedPassword] = useState(0);

  // Generate a Random Password
  function generatePassword() {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let password = "";

    // Randomly select one character from each category
    password +=
      uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    password +=
      lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    // Generate remaining characters randomly
    const remainingLength = 7 - password.length;
    for (let i = 0; i < remainingLength; i++) {
      const allCharacters =
        uppercaseLetters + lowercaseLetters + numbers + specialCharacters;
      password +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    // Shuffle the password characters
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return password;
  }

  const handleProfilePictureUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!imageResult.canceled) {
      setProfilePicture(imageResult.assets[0].uri);
    }
  };

  useEffect(() => {
    // Generate the Password
    setGeneratedPassword(generatePassword());
  }, []);

  useEffect(() => {
    console.log("Generated Password: " + generatedPassword);
  }, [generatedPassword]);

  const handleSubmit = async () => {
    try {
      const riderRef = db
        .collection("riders")
        .where("phone", "==", phoneNumber);
      const querySnapshot = await riderRef.get();
      const riderIDS = [];

      querySnapshot.forEach((doc) => {
        riderIDS.push(doc.id);
      });

      setRiderProfileID(riderIDS[0]);
      console.log(riderProfileID);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    if (riderProfileID && generatedPassword) {
      auth
        .createUserWithEmailAndPassword(riderEmail, generatedPassword)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log("New User: " + user.uid);
          setAuthID(user.uid);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error Creating User: " + errorMessage);
        });
    }
  }, [riderProfileID, generatedPassword]); // Run when both riderProfileID and generatedPassword change

  // Check if AuthID is Set
  useEffect(() => {
    if (authID) {
      console.log("Generated AuthID: " + authID);
    }
  }, [authID]);

  // Update the User Profile Document
  useEffect(() => {
    if (authID) {
      // Call the function that needs the updated riderProfileID
      var theRiderRef = db.collection("riders").doc(riderProfileID);

      theRiderRef
        .update({
          email: riderEmail,
          name: riderName,
          password: generatedPassword,
          authID: authID,
        })
        .then(() => {
          console.log("Rider Profile Updated Now!");
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [authID]);

  return (
    <SafeAreaView style={tw`flex-1 px-4 pt-10`}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-5`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl ml-4 font-semibold`}>
          Enter Profile Details
        </Text>
      </View>

      {/* Profile Picture */}
      <TouchableOpacity
        style={tw`flex items-center justify-center`}
        onPress={handleProfilePictureUpload}
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={tw`w-40 h-40 rounded-full`}
          />
        ) : (
          <View
            style={tw`w-40 h-40 bg-gray-300 rounded-full items-center justify-center`}
          >
            <Icon type="ionicon" name="add" color="white" size={32} />
          </View>
        )}
      </TouchableOpacity>

      {/* Name Input */}
      <View style={tw`bg-gray-200 rounded-sm p-4 my-4 border border-gray-900`}>
        <TextInput
          style={tw`text-black`}
          placeholder="Enter your Full Name"
          placeholderTextColor="gray"
          value={riderName}
          onChangeText={setRiderName}
        />
      </View>

      {/* Email Address Input */}
      <View style={tw`bg-gray-200 rounded-sm p-4 my-4 border border-gray-900`}>
        <TextInput
          style={tw`text-black`}
          placeholder="Enter your Email Address"
          placeholderTextColor="gray"
          value={riderEmail}
          onChangeText={setRiderEmail}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={tw`bg-yellow-500 rounded-sm py-4 px-8 justify-center items-center`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-gray-900 text-lg font-semibold`}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
