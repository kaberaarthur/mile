import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

const profile = [
  {
    id: "1",
    email: "kabera@gmail.com",
    emailVerified: true,
    name: "Arthur Kabera",
    phone: "+254790485731",
    rating: 5.0,
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[tw`bg-white h-full`]}>
      <View style={[tw`py-10 px-5`]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-center text-white text-xl`}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
