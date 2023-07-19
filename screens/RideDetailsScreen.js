import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";

export default function RideDetails({ route }) {
  const navigation = useNavigation();
  const { ride } = route.params;
  const driverFirstName = ride.driverName.split(" ")[0];
  const endTime = new Date(ride.endTime);

  /*
  const formattedDate = endTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  */

  // Convert Date to Human Friendly Date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };

    // Get the date and month
    let formattedDate = date.toLocaleDateString("en-US", options);
    formattedDate = formattedDate.replace(",", ""); // Remove comma after the day

    // Determine the ordinal suffix
    const day = date.getDate();
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) {
      suffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      suffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      suffix = "rd";
    }

    // Replace the day with the day + suffix
    formattedDate = formattedDate.replace(
      new RegExp(day + " "),
      day + suffix + " "
    );

    // Get the time in 24-hour format
    const time =
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2);

    // Combine the date and time
    return `${formattedDate} at ${time}`;
  }

  useEffect(() => {
    console.log("Ride Data: " + JSON.stringify(formatDate(ride.endTime)));
    console.log(
      "Longitude Destination: " + ride.rideDestination[0].location["lng"]
    );
  }, [ride]);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const mapRef = React.useRef(null);

  const onMapLayout = () => {
    mapRef.current.fitToCoordinates(
      [
        {
          latitude: ride.rideOrigin[0].location["lat"],
          longitude: ride.rideOrigin[0].location["lng"],
        },
        {
          latitude: ride.rideDestination[0].location["lat"],
          longitude: ride.rideDestination[0].location["lng"],
        },
      ],
      {
        animated: true,
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      }
    );
  };

  return (
    <View style={tw`px-5 py-10`}>
      <View
        style={tw`flex-row items-center`}
        onPress={() => navigation.navigate("ActivityScreen")}
      >
        <TouchableOpacity>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
      </View>

      <Text style={tw`text-lg font-bold mt-5 mb-2`}>
        Ride with {ride.driverName}
      </Text>
      <Text style={tw`mb-5`}>{formatDate(ride.endTime)}</Text>

      <MapView style={styles.mapStyle} ref={mapRef} onLayout={onMapLayout}>
        <MapViewDirections
          origin={ride.rideOrigin[0].description}
          destination={ride.rideDestination[0].description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={6}
          strokeColor="#000"
        />
        <Marker
          coordinate={{
            latitude: ride.rideOrigin[0].location["lat"],
            longitude: ride.rideOrigin[0].location["lng"],
          }}
          title="Origin"
        />
        <Marker
          coordinate={{
            latitude: ride.rideDestination[0].location["lat"],
            longitude: ride.rideDestination[0].location["lng"],
          }}
          title="Destination"
        />
      </MapView>

      <View style={tw`my-5`}>
        <Text style={tw`font-bold mb-2`}>
          Origin: {ride.rideOrigin[0].description}
        </Text>
        <Text style={tw`font-bold mb-2`}>
          Destination: {ride.rideDestination[0].description}
        </Text>
      </View>

      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          style={[tw`py-4 px-4 rounded-sm`, styles.customColor]}
          onPress={toggleModal}
        >
          <Text style={tw`text-black font-bold text-lg`}>Contact Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-gray-200 py-4 px-4 rounded-sm`}
          onPress={() => navigation.navigate("ReportIssueScreen")}
        >
          <Text style={tw`text-black font-bold text-lg`}>Report Ride</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`border-b border-gray-300 my-5`}></View>

      <View>
        <Text style={tw`text-lg font-bold mb-5`}>Payment</Text>
        <View style={tw`flex-row justify-between items-center`}>
          <Icon name="credit-card" size={20} />
          <Text>{ride.paymentMethod["text"]}</Text>
          <Text>Kshs. {ride.totalClientPays.toFixed(2)}</Text>
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={tw`bg-white p-5 rounded-lg`}>
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <Text style={tw`text-lg font-bold`}>Contact Options</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="close" size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={tw`flex-row items-center mb-5`}>
            <Icon
              type="ionicon"
              name="send-outline"
              size={20}
              color="#6b7280"
            />
            <Text style={tw`ml-5`}>Send in app SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center mb-5`}
            onPress={() => Linking.openURL(`tel:${ride.driverPhone}`)} // assuming ride.driverPhoneNumber contains the phone number
          >
            <Icon name="phone" size={20} color="#6b7280" />
            <Text style={tw`ml-5`}>Call driver by phone</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: "25%",
  },
  customColor: {
    backgroundColor: "#F5B800",
  },
});
