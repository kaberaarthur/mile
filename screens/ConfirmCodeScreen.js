import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

import { db, auth } from "../firebaseConfig";
import firebase from "firebase/compat/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "../slices/userSlice";
import { setPerson, selectPerson } from "../slices/personSlice";
import { ActivityIndicator } from "react-native";

import { useNavigation } from "@react-navigation/native";

const ConfirmCodeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const person = useSelector(selectPerson);

  const { phoneNumber, expectedCode, theRiderProfileID } = route.params;
  const [code, setCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true);
  const [profile, setProfile] = useState([]);
  const [updateProfile, setUpdateProfile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // Format Date Date and Time
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is 0-indexed
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }

  // Check Whether the Document for Whom OTP is being Confirmed Exists,
  // Set Profile Data

  const handleSignIn = () => {
    setIsLoading(true);
    // First check if OTP is Correct
    if (expectedCode == code) {
      console.log("The Code is Correct");

      // Check if authID exists for the given phone number
      const personRef = db
        .collection("riders")
        .where("phone", "==", phoneNumber)
        .where("activeUser", "==", true);

      personRef
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            console.log("User Exists - Log him In");

            const firstDocument = querySnapshot.docs[0].data();
            console.log("Profile Data: ", firstDocument);

            // Sign In With Email and Password
            auth
              .signInWithEmailAndPassword(
                firstDocument["email"],
                firstDocument["password"]
              )
              .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log("USER DOCUMENT: ", firstDocument);

                delete firstDocument.dateRegistered;
                delete firstDocument.otpDate;

                // setUser & setPerson
                dispatch(setPerson(firstDocument));
                dispatch(setUser(firstDocument));
              })
              .catch((error) => {
                // Handle the error here
                console.log("Authentication error: ", error);
                // You can display an error message to the user or take other appropriate actions.
              });
          } else {
            console.log("User does not Exist - Register Him");
            console.log("The New Rider: " + theRiderProfileID);

            // Send the User to Update their Profile Info

            navigation.navigate("UpdateProfileScreen", {
              phoneNumber: phoneNumber,
              theRiderProfileID: theRiderProfileID,
            });
          }
        })
        .catch((error) => {
          console.error("Error querying documents:", error);
          setErrorMessage("Error querying documents:", error);
        });
    } else {
      setErrorMessage("The Code you Entered is Incorrect");
    }

    setIsLoading(false);
  };

  const handleResendCode = () => {
    // Handle resend code logic
    console.log("Resend User Code");
  };

  return (
    <SafeAreaView style={tw`flex-1 px-4 pt-10`}>
      <View style={tw`flex-row items-center mb-5`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl ml-4 font-semibold`}>Enter 6 digit code</Text>
      </View>
      <Text style={tw`text-lg mb-2`}>
        Enter the 6 digit code sent to {phoneNumber}.
      </Text>
      <View style={tw`border border-black rounded-sm px-4 py-2 mb-2`}>
        <TextInput
          style={tw`w-full text-lg`}
          placeholder="Enter code"
          keyboardType="numeric"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          onFocus={() => setIsValidCode(true)}
        />
      </View>
      {!isValidCode && (
        <Text style={tw`text-red-500 mb-2`}>You entered the wrong code</Text>
      )}
      {isLoading ? (
        <TouchableOpacity style={tw`bg-yellow-500 py-2 px-4 rounded-sm`}>
          <ActivityIndicator size="large" color="#030813" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={tw`bg-yellow-500 py-2 px-4 rounded-sm`}
          onPress={handleSignIn}
        >
          <Text style={tw`text-lg font-bold text-center text-black`}>
            Verify
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={tw`text-lg font-bold text-center mt-4`}>Resend Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConfirmCodeScreen;
