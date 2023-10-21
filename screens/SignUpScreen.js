import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { db, auth } from "../firebaseConfig";
import firebase from "firebase/compat/app";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [riderProfileID, setRiderProfileID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Redirect to HomeScreen when a user is logged in
      navigation.navigate("HomeScreen");
    }
  }, [user, navigation]);

  const generateRandomCode = () => {
    const min = 100000; // Minimum 4-digit number
    const max = 999999; // Maximum 4-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const [phoneNumber, setPhoneNumber] = useState("");

  const sendOTP = () => {
    console.log("Sending OTP Now");
  };

  const handleSignIn = () => {
    setIsLoading(true);

    const expectedCode = generateRandomCode();

    // Check if Phone Number is empty
    if (phoneNumber) {
      db.collection("riders")
        .where("phone", "==", phoneNumber)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // No existing document found, proceed with creating a new one
            const newRiderRef = db.collection("riders").doc();
            newRiderRef
              .set({
                dateRegistered: firebase.firestore.FieldValue.serverTimestamp(),
                email: "",
                name: "",
                language: "en",
                phone: phoneNumber,
                authID: "",
                otpDate: firebase.firestore.FieldValue.serverTimestamp(),
                otpCode: expectedCode,
                password: "",
                activeUser: false,
              })
              .then(() => {
                console.log("Document successfully written!");
                console.log("OTP: " + expectedCode);

                // Send the OTP Code
                sendOTP();

                // New Document ID
                const newDocumentId = newRiderRef.id;
                setRiderProfileID(newDocumentId);
                console.log("Rider Profile ID: " + newDocumentId);

                // Navigate to Confirm Code Screen Here
                navigation.navigate("ConfirmCodeScreen", {
                  phoneNumber: phoneNumber,
                  expectedCode: expectedCode,
                  theRiderProfileID: newDocumentId,
                });
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });
          } else {
            // Existing document found, update the otpCode
            querySnapshot.forEach((doc) => {
              db.collection("riders")
                .doc(doc.id)
                .update({
                  otpCode: expectedCode,
                })
                .then(() => {
                  console.log("Document successfully updated!");
                  console.log("OTP: " + expectedCode);

                  // Write the Code to send the OTP Here
                  sendOTP();

                  // Rider Profile Document ID
                  setRiderProfileID(doc.id);
                  console.log("Rider Profile ID: " + doc.id);

                  // Navigate to Confirm Code Screen Here
                  navigation.navigate("ConfirmCodeScreen", {
                    phoneNumber: phoneNumber,
                    expectedCode: expectedCode,
                    theRiderProfileID: doc.id,
                  });
                })
                .catch((error) => {
                  console.error("Error updating document: ", error);
                });
            });
          }
        })
        .catch((error) => {
          console.error("Error querying documents: ", error);
        });
    }

    setIsLoading(false);
  };

  const handleTermsAndConditions = () => {
    Linking.openURL("https://mile.ke");
  };

  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center`}>
      <View style={tw`w-4/5`}>
        <Text style={tw`text-2xl font-bold text-center`}>
          Enter your Phone Number
        </Text>
        <View style={tw`border border-black rounded-sm mt-2`}>
          <TextInput
            style={tw`w-full px-4 py-2`}
            placeholder="+254 7** *** ***"
            onChangeText={(text) => setPhoneNumber(text)} // Update the state variable when the input changes
          />
        </View>
        {isLoading ? (
          <TouchableOpacity
            style={[tw`rounded-sm mt-4 px-4 py-2`, styles.customColor]}
          >
            <ActivityIndicator size="large" color="#030813" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[tw`rounded-sm mt-4 px-4 py-2`, styles.customColor]}
            onPress={handleSignIn}
          >
            <Text style={tw`text-black text-lg text-center`}>Sign in</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`p-4 absolute bottom-0`}>
        <Text style={tw`text-sm text-gray-800`}>
          By creating an account or logging in, you agree to our{" "}
          <Text style={tw`underline`} onPress={handleTermsAndConditions}>
            Terms & Conditions
          </Text>{" "}
          and{" "}
          <Text style={tw`underline`} onPress={handleTermsAndConditions}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});

export default SignUpScreen;
