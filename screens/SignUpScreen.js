import React from "react";
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

import { db } from "../firebaseConfig";
// import { auth } from "../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import firebase from "firebase/compat/app";

const SignUpScreen = () => {
  const generateRandomCode = () => {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleSignIn = () => {
    const expectedCode = generateRandomCode();
    navigation.navigate("ConfirmCodeScreen", {
      phoneNumber: phoneNumber,
      expectedCode: expectedCode,
    });
  };

  const handleSignInWithGoogle = () => {
    // console.log("Sin Up Initiated");

    const auth = getAuth;
    const provider = new GoogleAuthProvider();

    const email = "arthurkabera@gmail.com";
    const password = "N0p4$$w0rd*";

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
        console.log("User: " + user);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..

        console.log("Error: " + errorMessage);
      });
  };

  const handleSignInWithFacebook = () => {
    // Handle sign in with Facebook logic
    db.collection("cities")
      .where("capital", "==", false)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const handleTermsAndConditions = () => {
    Linking.openURL("https://mile.ke");
  };

  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center`}>
      <View style={tw`w-4/5`}>
        <Text style={tw`text-2xl font-bold text-center`}>
          Enter your number
        </Text>
        <View style={tw`border border-black rounded-sm mt-2`}>
          <TextInput
            style={tw`w-full px-4 py-2`}
            placeholder="+254 7** *** ***"
          />
        </View>
        <TouchableOpacity
          style={[tw`rounded-sm mt-4 px-4 py-2`, styles.customColor]}
          onPress={handleSignIn}
        >
          <Text style={tw`text-black text-lg text-center`}>Sign in</Text>
        </TouchableOpacity>
        <View style={tw`flex-row items-center mt-4`}>
          <View style={tw`flex-grow h-px bg-gray-400 w-1/3`} />
          <Text style={tw`text-gray-400 mx-2`}>OR</Text>
          <View style={tw`flex-grow h-px bg-gray-400 w-1/3`} />
        </View>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-4 border border-black rounded-sm mt-4`}
          onPress={handleSignInWithGoogle}
        >
          <Icon name="google" type="font-awesome" color="#DB4437" />
          <Text style={tw`ml-2 text-lg`}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-4 border border-black rounded-sm mt-2`}
          onPress={handleSignInWithFacebook}
        >
          <Icon name="facebook-square" type="font-awesome" color="#3b5998" />
          <Text style={tw`ml-2 text-lg`}>Sign in with Facebook</Text>
        </TouchableOpacity>
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
