import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const WalletScreen = () => {
  const navigation = useNavigation();
  const balance = 0;

  return (
    <View style={tw`bg-white py-10 px-5 flex-1`}>
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl ml-4`}>My Wallet</Text>
      </View>
      <View
        style={[
          tw`h-1/3 items-center justify-center mt-5 rounded-sm bg-gray-200`,
        ]}
      >
        <Text style={tw`text-lg`}>Mile Balance</Text>
        <Text style={tw`text-4xl font-bold`}>Ksh {balance}</Text>
        {balance === 0 && (
          <>
            <View style={tw`w-full h-0.5 bg-gray-300 my-3`} />
            <Text style={tw`text-sm px-3`}>
              You have no funds at the moment, click below to add funds.
            </Text>
          </>
        )}
      </View>
      <View style={tw`mt-5 font-bold`}>
        <TouchableOpacity style={tw`bg-green-600 py-4 rounded-sm mb-2`}>
          <Text style={tw`text-center text-white`}>Add funds using Mpesa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-black py-4 rounded-sm`}>
          <Text style={tw`text-center text-white`}>
            Add funds using Credit/Debit Card
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});

export default WalletScreen;
