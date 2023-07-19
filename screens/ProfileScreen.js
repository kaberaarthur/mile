import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
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

const handleLogout = () => {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("User Signed Out Successfully");
    })
    .catch((error) => {
      // An error happened.
      console.log("Error Occurred Signing Out User: " + error.message);
    });
};

const ProfileScreen = () => {
  const person = useSelector(selectPerson);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[tw`bg-white pt-5 h-full`]}>
      <View style={[tw`pt-5 px-5 flex-row justify-between items-center`]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={tw`p-3 rounded-full`}
        >
          <Icon type="font-awesome" name="chevron-left" color="#1f2937" />
        </TouchableOpacity>
        <Text style={tw`text-base font-bold`}>Profile</Text>
        <Icon
          type="font-awesome"
          name="pencil"
          color="#1f2937"
          onPress={() => navigation.navigate("EditProfileScreen")}
        />
      </View>
      <View style={[tw`flex-1 items-center justify-center`]}>
        <Image
          source={user.imageUrl}
          style={[
            tw`w-24 h-24 mb-4`,
            {
              borderRadius: 100,
            },
          ]}
        />
        <Text style={tw`text-center text-2xl font-bold text-gray-800`}>
          {person.name}
        </Text>
        <Text style={tw`text-center text-base text-gray-600`}>
          {person.phone}
        </Text>
        <Text style={tw`text-center text-base text-gray-600`}>
          {person.email}
        </Text>
      </View>

      <View style={tw`my-5 border-b border-gray-500`} />
      <View style={[tw`px-5 pb-10`]}>
        <TouchableOpacity onPress={handleLogout}>
          <View
            style={[tw`flex-row items-center py-4 border-b border-gray-100`]}
          >
            <Icon type="font-awesome" name="sign-out" color="#9ca3af" />
            <Text style={tw`ml-2 text-gray-400 text-lg`}>Logout</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DeleteAccountScreen")}
        >
          <View style={[tw`flex-row items-center py-4`]}>
            <Icon type="font-awesome" name="trash-o" color="#9ca3af" />
            <Text style={tw`ml-2 text-gray-400 text-lg `}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
