import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectPerson, setPerson } from "../slices/personSlice";
import { db } from "../firebaseConfig";

const EditProfileScreen = () => {
  const person = useSelector(selectPerson);
  const navigation = useNavigation();
  const firstUser = useSelector((state) => state.user.user);
  const [userName, setName] = useState(firstUser["name"]); // Initialize with existing name

  // Inside your component

  const dispatch = useDispatch();

  const updateProfile = () => {
    const updatedName = userName.trim();

    if (updatedName) {
      db.collection("riders")
        .where("authID", "==", firstUser["authID"])
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref
              .update({
                name: updatedName,
              })
              .then(() => {
                console.log("Profile successfully updated!");
                // Dispatch an action to update the person state in Redux store
                /*
                dispatch(
                  setPerson({
                    ...person, // take all existing fields from person
                    name: updatedName, // override the name field
                  })
                );
                */
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
      <TouchableOpacity
        style={[tw`mt-5 py-3 px-6 rounded-sm items-center`, styles.customColor]}
        onPress={updateProfile}
        disabled={!userName}
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
