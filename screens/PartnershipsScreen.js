import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";

const PartnershipsScreen = () => {
  return (
    <SafeAreaView style={[tw`bg-white h-full`]}>
      <View style={[tw`py-10 px-5`]}>
        <Text>PartnershipsScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default PartnershipsScreen;

const styles = StyleSheet.create({});
