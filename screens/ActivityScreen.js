import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { selectPerson, setPerson } from "../slices/personSlice";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebaseConfig";

const ActivityScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const person = useSelector(selectPerson);
  // const groupedRides = {};
  const [groupedRides, setGroupedRides] = useState({});

  const [rides, setRides] = useState([]);

  // Fetch the Rides from Firestore
  useEffect(() => {
    setIsLoading(true);

    // console.log("Person AuthID: " + person.authID);
    // Fetch data from Firestore based on the person data
    db.collection("rides")
      .where("riderId", "==", person.authID) // Adjust the condition as per your requirement
      .get()
      .then((querySnapshot) => {
        const ridesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRides(ridesData);
      })
      .catch((error) => {
        console.error("Error getting rides:", error);
      });
  }, [person]);

  // Group the Data in Accordance to Months
  useEffect(() => {
    let newGroupedRides = {};
    rides.forEach((ride) => {
      const monthYear = new Date(ride.dateCreated).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!newGroupedRides[monthYear]) {
        newGroupedRides[monthYear] = [];
      }

      newGroupedRides[monthYear].push(ride);

      // console.log(ride.dateCreated);
    });

    setGroupedRides(newGroupedRides); // update the state
  }, [rides]);

  useEffect(() => {
    // console.log("Grouped Rides:", JSON.stringify(groupedRides));
    setIsLoading(false);
  }, [groupedRides]);

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
      {isLoading ? (
        <SafeAreaView style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold mt-3 mb-2`}>Loading Rides...</Text>
          <Text>
            <ActivityIndicator />
          </Text>
        </SafeAreaView>
      ) : (
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
                  <View
                    style={tw`flex-row items-center mb-4 bg-white px-5 py-2`}
                    key={ride.id}
                  >
                    <View
                      style={[
                        tw`items-center justify-center rounded-full p-2`,
                        styles.customColor,
                      ]}
                    >
                      <Icon type="ionicon" name="car-outline" color="black" />
                    </View>
                    <View style={tw`ml-4 pt-4`}>
                      <Text style={tw`text-sm text-gray-900 font-semibold`}>
                        {ride.rideOrigin[0].description.length > 18
                          ? ride.rideOrigin[0].description.substring(0, 18) +
                            "..."
                          : ride.rideOrigin[0].description}
                      </Text>
                      <Text style={tw`text-sm text-gray-900 font-semibold`}>
                        {ride.rideDestination[0].description.length > 18
                          ? ride.rideDestination[0].description.substring(
                              0,
                              18
                            ) + "..."
                          : ride.rideDestination[0].description}
                      </Text>
                      <Text style={tw`text-sm px-2 py-1 rounded-lg`}>
                        {
                          ride.endTime
                          /*new Date(ride.endTime).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      */
                        }
                      </Text>
                    </View>
                    <Text style={tw`text-lg text-gray-900 ml-auto font-bold`}>
                      Ksh{ride.totalClientPays.toFixed(0)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});
