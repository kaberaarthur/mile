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
  const expectedCode = generateRandomCode();

  const [phoneNumber, setPhoneNumber] = useState(null);

  const sendOTP = (phoneNumber, expectedCode) => {
    console.log("Phone Number: " + phoneNumber);
    console.log("OTP Code: " + expectedCode);

    // Create a reference to the "otps" collection
    const otpsCollection = db.collection("otps");

    // Create a new document with phoneNumber, expectedCode, and a timestamp
    otpsCollection
      .add({
        phone: phoneNumber,
        otp: expectedCode,
        date: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    // setPhoneNumber(phoneNumber)

    // Check if Phone Number is empty
    if (phoneNumber) {
      // Send the OTP Code
      sendOTP(phoneNumber, expectedCode);

      await db
        .collection("riders")
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
                  // sendOTP();

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

  const [phoneError, setPhoneError] = useState(false);

  const isValidPhoneNumber = (phone) => {
    // Regular expression to match a valid phone number format
    const phonePattern = /^\+254\d{9}$/;

    if (!phone || !phone.match(phonePattern)) {
      return false;
      setPhoneError(true);
    }

    return true;
    setPhoneError(false);
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
            placeholder="+2547123456**"
            onChangeText={(text) => {
              setPhoneNumber(text); // Update the state variable when the input changes
              setPhoneError(false); // Clear any previous phone error
            }}
          />
        </View>
        {phoneError && (
          <Text style={tw`text-red-500 text-sm text-center`}>
            Invalid phone number format. Please enter a valid phone number.
          </Text>
        )}

        {isLoading ? (
          <TouchableOpacity
            style={[tw`rounded-sm mt-4 px-4 py-2`, styles.customColor]}
          >
            <ActivityIndicator size="large" color="#030813" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[tw`rounded-sm mt-4 px-4 py-2`, styles.customColor]}
            onPress={() => {
              if (isValidPhoneNumber(phoneNumber)) {
                handleSignIn();
              } else {
                setPhoneError(true);
              }
            }}
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
