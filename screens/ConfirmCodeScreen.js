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

import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";

const ConfirmCodeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { phoneNumber, expectedCode } = route.params;
  const [code, setCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true);
  const [profileDocuments, setProfileDocuments] = useState("");
  const [profileID, setProfileID] = useState("");
  const [updateProfile, setUpdateProfile] = useState("");

  const handleSignIn = () => {
    const authIDSArray = [];

    console.log(phoneNumber);
    // Check if authID exists for the given phone number
    const personRef = db
      .collection("riders")
      .where("phone", "==", phoneNumber)
      .where("authID", "!=", ""); // Check for non-empty authID field

    personRef
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            setProfileID(doc.id);
            setProfileDocuments(doc.data());
          });
        } else {
          console.log("No Documents Found/");
          setUpdateProfile(true);
        }
      })
      .catch((error) => {
        console.error("Error querying documents:", error);
      });
  };

  useEffect(() => {
    // Generate the Password
    if (profileID && profileDocuments) {
      console.log("Profile ID: " + profileID);
      console.log("Profile Documents: " + profileDocuments["email"]);

      // Sign In With Email and Password
      auth
        .signInWithEmailAndPassword(
          profileDocuments["email"],
          profileDocuments["password"]
        )
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log("USER ID: " + user.uid);

          // Dispatch to User Store
          dispatch(setUser(profileDocuments));

          navigation.navigate("HomeScreen");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log("Error Occurred Signing In User");
        });
    }
  }, [profileID, profileDocuments]);

  useEffect(() => {
    // Generate the Password
    if (updateProfile) {
      console.log("Profile to Get Updated");

      navigation.navigate("UpdateProfileScreen", {
        phoneNumber: phoneNumber,
        expectedCode: expectedCode,
      });
    }
  }, [updateProfile]);

  const handleResendCode = () => {
    // Handle resend code logic
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
      <TouchableOpacity
        style={tw`bg-yellow-500 py-2 px-4 rounded-sm`}
        onPress={handleSignIn}
      >
        <Text style={tw`text-lg font-bold text-center text-black`}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={tw`text-lg font-bold text-center mt-4`}>Resend Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConfirmCodeScreen;
