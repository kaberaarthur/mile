import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

const partnerData = {
  id: "1",
  code: "PRT123",
  earnings: [
    { id: "MC120523001", total: 250 },
    { id: "MC011223002", total: 510 },
    { id: "MC010623003", total: 300 },
    { id: "MC171023004", total: 150 },
    { id: "MC120523005", total: 250 },
    { id: "MC011223006", total: 510 },
    { id: "MC010623007", total: 300 },
    { id: "MC171023008", total: 150 },
    { id: "MC120523009", total: 250 },
    { id: "MC0112230010", total: 510 },
    { id: "MC0106230011", total: 300 },
    { id: "MC1710230012", total: 150 },
  ],
};

const PartnershipsScreen = () => {
  const navigation = useNavigation();
  const totalEarnings = partnerData.earnings.reduce(
    (sum, earning) => sum + earning.total,
    0
  );
  const partnerLink = `https://mile.ke/partners/${partnerData.code}`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(partnerLink);
    Alert.alert(
      "Link copied",
      "The partner link has been copied to clipboard."
    );
  };

  return (
    <View style={tw`flex-1 py-10`}>
      <View style={[tw`h-1/3 items-center justify-center`, styles.customColor]}>
        <TouchableOpacity
          style={tw`absolute left-2 top-2`}
          onPress={() => navigation.goBack()}
        >
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-900 mt-6`}>
          Total Earnings - Ksh. {totalEarnings}
        </Text>
        <Text style={tw`text-sm font-semibold text-gray-900 mt-2`}>
          Partner link:
        </Text>
        <Text
          style={[
            tw`text-xs font-semibold text-gray-900 mt-1 underline`,
            { textDecorationColor: "gray" },
          ]}
          onPress={copyToClipboard}
        >
          {`https://example.com/${partnerData.code}`}
        </Text>
        <Text style={tw`text-sm font-semibold text-gray-900 mt-1`}>
          Partner Code: {partnerData.code}
        </Text>
      </View>
      <ScrollView style={tw`h-2/3 flex-1 bg-white`}>
        {partnerData.earnings.map((earning) => (
          <View
            key={earning.id}
            style={tw`flex-row py-4 px-6 bg-white mt-3 mx-3 rounded-sm shadow-md`}
          >
            <Text style={tw`text-lg text-gray-800`}>{earning.id}</Text>
            <Text style={tw`text-lg font-bold text-gray-800 ml-auto`}>
              Ksh. {earning.total}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});

export default PartnershipsScreen;
