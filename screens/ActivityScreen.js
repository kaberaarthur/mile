import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";

const ActivityScreen = () => {
  return (
    <SafeAreaView style={[tw`bg-white h-full`]}>
      <View style={[tw`py-10 px-5`]}>
        <Text>ActivityScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({});
