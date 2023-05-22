import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const ridesData = [
  {
    id: 1,
    userID: 101,
    driverID: 201,
    driverName: "John Njau",
    driverPhone: "+254792456432",
    origin: {
      lat: 40.7128,
      long: -74.006,
      description: "34 Elm Street, New York",
    },
    destination: {
      lat: 40.7831,
      long: -73.9712,
      description: "200 Central Park West, New York",
    },
    startTime: "2023-05-01T09:00:00",
    endTime: "2023-05-01T09:35:00",
    cost: 180,
    paymentType: "Cash",
    minutes: 35,
    numberPlate: "KAB 123A",
  },
  {
    id: 2,
    userID: 101,
    driverID: 202,
    driverName: "Arthur Kabera",
    driverPhone: "+254790485731",
    origin: {
      lat: 40.7831,
      long: -73.9712,
      description: "200 Central Park West, New York",
    },
    destination: {
      lat: 40.7484,
      long: -73.9857,
      description: "350 5th Avenue, New York",
    },
    startTime: "2023-05-02T13:00:00",
    endTime: "2023-05-02T13:25:00",
    cost: 375,
    paymentType: "Mpesa",
    minutes: 25,
    numberPlate: "KBD 456B",
  },
  {
    id: 3,
    userID: 101,
    driverID: 203,
    driverName: "Purity Njoroge",
    driverPhone: "+254703557082",
    origin: {
      lat: 40.7484,
      long: -73.9857,
      description: "350 5th Avenue, New York",
    },
    destination: {
      lat: 40.761,
      long: -73.9773,
      description: "20 W 50th Street, New York",
    },
    startTime: "2022-11-03T18:00:00",
    endTime: "2022-11-03T18:20:00",
    cost: 560,
    paymentType: "Card",
    minutes: 20,
    numberPlate: "KCF 789C",
  },
  {
    id: 4,
    userID: 101,
    driverID: 204,
    driverName: "Sarah Lee",
    driverPhone: "+254790485766",
    origin: {
      lat: 40.761,
      long: -73.9773,
      description: "20 W 50th Street, New York",
    },
    destination: {
      lat: 40.7282,
      long: -73.9946,
      description: "120 E 13th Street, New York",
    },
    startTime: "2022-01-04T10:00:00",
    endTime: "2022-01-04T10:45:00",
    cost: 180,
    paymentType: "Cash",
    minutes: 45,
    numberPlate: "KDG 682D",
  },
];

const ActivityScreen = () => {
  const navigation = useNavigation();

  const groupedRides = {};

  ridesData.forEach((ride) => {
    const monthYear = new Date(ride.startTime).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!groupedRides[monthYear]) {
      groupedRides[monthYear] = [];
    }

    groupedRides[monthYear].push(ride);
  });

  return (
    <View style={tw`px-5 pt-10 flex-1`}>
      <View style={tw`flex-row items-center pb-3 mb-1`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute left-0`}
        >
          <Icon type="font-awesome" name="chevron-left" color="#1f2937" />
        </TouchableOpacity>
        <Text style={tw`text-xl ml-8`}>Activity</Text>
      </View>
      <ScrollView style={tw`flex-1`}>
        {Object.keys(groupedRides).map((monthYear) => (
          <View key={monthYear}>
            <Text style={tw`text-lg font-bold mt-3 mb-2`}>{monthYear}</Text>
            {groupedRides[monthYear].map((ride) => (
              <TouchableOpacity
                key={ride.id}
                onPress={() =>
                  navigation.navigate("RideDetailsScreen", { ride })
                }
              >
                <View style={tw`flex-row items-center mb-4`} key={ride.id}>
                  <View
                    style={[
                      tw`items-center justify-center rounded-full p-2`,
                      styles.customColor,
                    ]}
                  >
                    <Icon type="ionicon" name="car-outline" color="black" />
                  </View>
                  <View style={tw`ml-4`}>
                    <Text style={tw`text-lg text-gray-900 font-semibold`}>
                      {ride.destination.description.length > 18
                        ? ride.destination.description.substring(0, 18) + "..."
                        : ride.destination.description}
                    </Text>
                    <Text style={tw`text-sm px-2 py-1 rounded-lg`}>
                      {new Date(ride.endTime).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text style={tw`text-lg text-gray-900 ml-auto font-bold`}>
                    Ksh{ride.cost.toFixed(0)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});
