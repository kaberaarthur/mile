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
  console.log("Logged Out User");
};

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[tw`bg-white pt-5 h-full`]}>
      <View style={[tw`pt-5 px-5 flex-row justify-between items-center`]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={tw`p-3 rounded-full`}
        >
          <Icon type="font-awesome" name="chevron-left" color="black" />
        </TouchableOpacity>
        <Text style={tw`text-base font-bold`}>Profile</Text>
        <Icon type="font-awesome" name="pencil" color="black" />
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
        <Text style={tw`text-center text-2xl font-bold`}>{user.name}</Text>
        <Text style={tw`text-center text-base text-gray-600`}>
          {user.phone}
        </Text>
        <Text style={tw`text-center text-base text-gray-600`}>
          {user.email}
        </Text>
      </View>

      <View style={tw`my-5 border-b border-gray-500`} />
      <View style={[tw`px-5`]}>
        <Text style={tw`text-sm font-bold text-gray-800`}>
          Favorite locations
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EnterHomeLocationScreen")}
        >
          <View
            style={[tw`flex-row items-center py-4 border-b border-gray-100`]}
          >
            <Icon type="ionicon" name="home-outline" color="#9ca3af" />
            <Text style={tw`ml-2 text-gray-400 text-lg`}>
              Enter home location
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EnterWorkLocationScreen")}
        >
          <View style={[tw`flex-row items-center py-4`]}>
            <Icon type="ionicon" name="briefcase-outline" color="#9ca3af" />
            <Text style={tw`ml-2 text-gray-400 text-lg`}>
              Enter work location
            </Text>
          </View>
        </TouchableOpacity>
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
