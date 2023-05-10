import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";

const WalletScreen = () => {
  return (
    <SafeAreaView style={[tw`bg-white h-full`]}>
      <View style={[tw`py-10 px-5`]}>
        <Text>WalletScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({});
