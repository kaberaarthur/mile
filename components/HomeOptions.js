import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const data = [
  {
    id: "1",
    icon: "wallet",
    title: "My Wallet",
    description: "Check available funds in your wallet",
    screen: "WalletScreen",
  },
  {
    id: "2",
    icon: "people",
    title: "Partnerships",
    description: "Invite friends and get discounts",
    screen: "PartnershipsScreen",
  },
  {
    id: "3",
    icon: "person",
    title: "Profile",
    description: "Profile information and details",
    screen: "ProfileScreen",
  },
  {
    id: "4",
    icon: "list",
    title: "Activity",
    description: "View your ride history",
    screen: "ActivityScreen",
  },
];

const HomeOptions = () => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { title, description, icon, screen } }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(screen)}
          style={tw`flex-row items-center p-2`}
        >
          <Icon
            style={tw`mr-4 rounded-full bg-gray-300 p-3`}
            name={icon}
            type="ionicon"
            color="white"
            size={18}
          />
          <View>
            <Text style={tw`font-semibold text-lg`}>{title}</Text>
            <Text style={tw`text-gray-500`}>{description}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default HomeOptions;

const styles = StyleSheet.create({});
