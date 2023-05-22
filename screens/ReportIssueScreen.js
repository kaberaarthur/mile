import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

export default function ReportIssueScreen() {
  const navigation = useNavigation();

  const issues = [
    {
      issue: "Driver took a poor route",
      response:
        "To avoid traffic or certain road conditions, your driver may choose a longer route. You can also discuss the preferred route with driver before starting the ride. If the final peicw is different from the estimated one, please contact our Support team through this article by using the app.",
    },
    {
      issue: "My driver was rude",
      response:
        "We are sorry to hear that you weren't happy with the service you received! Thankyou for reporting this to us. We promise to take necessary action to maintain the high standard of service.",
    },
    // Add more issues and responses here...
  ];

  return (
    <View style={tw`px-5 py-10`}>
      <View style={tw`flex-row items-center mb-5`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl ml-4 font-semibold`}>Ride Issues</Text>
      </View>

      <Text style={tw`text-lg mb-5`}>
        Browse common ride-related issues and get in touch with our support team
        below.
      </Text>

      {issues.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={tw`mb-5`}
          onPress={() =>
            navigation.navigate("OneRideIssueScreen", { issue: item })
          }
        >
          <View key={index} style={tw`mb-5`}>
            <View
              style={tw`flex-row justify-between items-center border-b border-gray-400 pb-2`}
            >
              <Text style={tw`font-bold text-base`}>{item.issue}</Text>
              <Icon
                type="ionicon"
                name="chevron-forward-outline"
                color="black"
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
