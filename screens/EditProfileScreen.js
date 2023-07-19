import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectPerson, setPerson } from "../slices/personSlice";
import { db, auth } from "../firebaseConfig";

const user = {
  id: "1",
  email: "kabera@gmail.com",
  emailVerified: true,
  name: "Arthur Kabera",
  phone: "+254790485731",
  rating: 5.0,
  imageUrl: require("../assets/profile.jpg"),
};

const EditProfileScreen = () => {
  const person = useSelector(selectPerson);
  const navigation = useNavigation();
  const [userEmail, setEmail] = useState(person.email);
  const [userName, setName] = useState(person.name);

  const dispatch = useDispatch();

  const updateProfile = () => {
    const updatedEmail = userEmail.trim();
    const updatedName = userName.trim();

    if (updatedEmail || updatedName) {
      db.collection("riders")
        .where("authID", "==", person.authID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref
              .update({
                email: updatedEmail,
                name: updatedName,
              })
              .then(() => {
                console.log("Profile successfully updated!");
                // Dispatch an action to update the person state in Redux store
                dispatch(
                  setPerson({
                    ...person, // take all existing fields from person
                    email: updatedEmail, // override the email field
                    name: updatedName, // override the name field
                  })
                );
                navigation.goBack();
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  return (
    <View style={tw`py-10 px-5`}>
      <View style={tw`flex-row items-center justify-center`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute left-0`}
        >
          <Icon type="font-awesome" name="chevron-left" color="#1f2937" />
        </TouchableOpacity>
        <Text style={tw`font-bold text-lg text-gray-900 ml-2`}>
          Edit Profile
        </Text>
      </View>
      <View>
        <Text style={tw`text-lg text-gray-600 mt-4`}>Name</Text>
        <TextInput
          style={tw`border border-gray-300 mt-2 p-2 rounded-sm`}
          value={userName}
          onChangeText={setName}
        />
      </View>
      <View>
        <Text style={tw`text-lg text-gray-600 mt-4`}>Email Address</Text>
        <TextInput
          style={tw`border border-gray-300 mt-2 p-2 rounded-sm`}
          value={userEmail}
          onChangeText={setEmail}
        />
      </View>
      <TouchableOpacity
        style={[tw`mt-5 py-3 px-6 rounded-sm items-center`, styles.customColor]}
        onPress={updateProfile}
      >
        <Text style={tw`text-gray-900 font-bold text-lg`}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});
