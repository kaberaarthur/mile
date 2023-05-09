import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import { FlatList } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTravelTimeInformation } from "../slices/navSlice";

// Round off Price to Nearest Ten
function roundToNearestTen(number) {
  return Math.round(number / 10) * 10;
}

const data = [
  {
    id: "Standard-Ride",
    title: "Standard Ride",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Comfort-Ride",
    title: "Comfort Ride",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Luxury-Ride",
    title: "Luxury Ride",
    multiplier: 1.5,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "Queens-Ride",
    title: "Queens Ride",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "Premium",
    title: "Premium",
    multiplier: 2.2,
    image: "https://links.papareact.com/7pf",
  },
];

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  return (
    <View style={tw`bg-white flex-grow`}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("NavigateCard")}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            disabled={!selected}
            style={tw`bg-black py-3 m-3 
        ${!selected && "bg-gray-300"}`}
          >
            <Text style={tw`text-center text-white text-xl`}>
              Confirm {selected?.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { id, title, multiplier, image }, item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={tw`flex-row justify-between items-center px-6 ${
              id === selected?.id && "bg-gray-200"
            }`}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
              }}
              source={{ uri: image }}
            />
            <View style={tw`-ml-6`}>
              <Text style={tw`text-xl font-semibold`}>{title}</Text>
              <Text>{travelTimeInformation?.duration.text} - Travel time</Text>
            </View>
            <Text style={tw`text-base font-bold`}>
              Kshs.
              {roundToNearestTen(
                30 *
                  parseInt(
                    travelTimeInformation?.duration.text.replace(/ mins/, "")
                  ) *
                  multiplier
              )}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
