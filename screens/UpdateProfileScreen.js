import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { db, auth } from "../firebaseConfig";
import firebase from "firebase/compat/app";

import { setUser } from "../slices/userSlice";
import { setPerson } from "../slices/personSlice";

const UpdateProfileScreen = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();

  const { phoneNumber, theRiderProfileID } = route.params;
  const [profilePicture, setProfilePicture] = useState(null);
  const [riderName, setRiderName] = useState("");
  const [riderEmail, setRiderEmail] = useState("");
  const [riderReferrer, setRiderReferrer] = useState("");

  const [riderProfileID, setRiderProfileID] = useState(0);
  const [updatedProfile, setUpdatedProfile] = useState(0);
  const [authID, setAuthID] = useState(0);
  const [lastNumber, setLastNumber] = useState(0);
  const [generatedPassword, setGeneratedPassword] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const isEmailValid = (email) => {
    // This regular expression checks if the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Generate a Random Password (9 characters)
  function generatePassword() {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()|}{[]:;?";

    let password = "";

    // Randomly select one character from each category
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    password +=
      uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    password +=
      lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    // Generate remaining characters randomly
    const remainingLength = 9 - password.length;
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

  // Create a Unique Number for Partner Code
  function generateUniqueCode(authID) {
    // Extract the last 3 digits of authID
    const last3Digits = authID.slice(-2);

    // Get the current date and time
    const currentDate = new Date();

    // Get the day of the week as a number (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = currentDate.getDay();

    // Get the hour, minute, and second
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();

    // Create the unique code by combining the extracted values
    const uniqueCode = `MTL${dayOfWeek}${hour}${minute}${second}${last3Digits}`;

    return uniqueCode;
  }

  function removePlusSign(inputString) {
    // Use the replace method with a regular expression to remove '+'
    const resultString = inputString.replace(/\+/g, "");
    return resultString;
  }

  // STEPS
  // 1. Generate a password
  // 2. Create a User using Email and Password
  // 3. Store the data in the Rider Profile Document

  const handleSubmit = async () => {
    setIsLoading(true);

    console.log(
      "Created New Partner Code: " + "MTL" + removePlusSign(phoneNumber)
    );
    // const pCode = generateUniqueCode(phoneNumber);

    if (riderName && isEmailValid(riderEmail)) {
      console.log(theRiderProfileID);

      // Generate a Password
      // setGeneratedPassword(generatePassword());
      // console.log(generatedPassword);

      const newPassword = generatePassword();

      // Create User With Email and Password

      auth
        .createUserWithEmailAndPassword(riderEmail, newPassword)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log("New User: " + user.uid);
          setAuthID(user.uid);

          pCode = generateUniqueCode(user.uid);

          console.log("Created New Partner Code: " + pCode);

          // Define the fields to update
          const updatedData = {
            authID: user.uid,
            email: riderEmail,
            name: riderName,
            activeUser: true,
            password: newPassword,
            referralCode: riderReferrer,
            partnerCode: pCode,
          };

          // Update the Rider Profile
          db.collection("riders")
            .doc(theRiderProfileID)
            .update(updatedData)
            .then(() => {
              console.log("Update the Rider Profile");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log("Error Creating User: " + errorMessage);
        });
    } else {
      // Show an error message or prevent submission
      setSubmitError("Enter Correct Email Address and Name");
    }

    setIsLoading(false);
  };

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
      <View style={tw`bg-gray-200 rounded-sm p-4 my-2 border border-gray-900`}>
        <TextInput
          style={tw`text-black`}
          placeholder="Enter your Full Name"
          placeholderTextColor="gray"
          value={riderName}
          onChangeText={setRiderName}
        />
      </View>

      {/* Email Address Input */}
      <View style={tw`bg-gray-200 rounded-sm p-4 my-2 border border-gray-900`}>
        <TextInput
          style={tw`text-black`}
          placeholder="Enter your Email Address"
          placeholderTextColor="gray"
          value={riderEmail}
          onChangeText={setRiderEmail}
        />
      </View>

      {/* Referral Code Input */}
      <View style={tw`bg-gray-200 rounded-sm p-4 my-2 border border-gray-900`}>
        <TextInput
          style={tw`text-black`}
          placeholder="Referral Code"
          placeholderTextColor="gray"
          value={riderReferrer}
          onChangeText={setRiderReferrer}
        />
      </View>
      <View>
        <Text style={tw`text-red-600 text-lg font-semibold`}>
          {submitError}
        </Text>
      </View>

      {/* Submit Button */}
      {isLoading ? (
        <TouchableOpacity
          style={tw`bg-yellow-500 rounded-sm py-4 px-8 justify-center items-center`}
        >
          <ActivityIndicator size="large" color="#030813" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={tw`bg-yellow-500 rounded-sm py-4 px-8 justify-center items-center`}
          onPress={handleSubmit}
          disabled={!riderName || !isEmailValid(riderEmail)} // Disable based on conditions
        >
          <Text style={tw`text-gray-900 text-lg font-semibold`}>Submit</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
