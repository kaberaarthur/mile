import React, { useState, useRef } from "react";
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
  const formattedDate = endTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const mapRef = React.useRef(null);

  const onMapLayout = () => {
    mapRef.current.fitToCoordinates(
      [
        { latitude: ride.origin.lat, longitude: ride.origin.long },
        { latitude: ride.destination.lat, longitude: ride.destination.long },
      ],
      {
        animated: true,
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      }
    );
  };

  return (
    <View style={tw`px-5 py-10`}>
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
      </View>

      <Text style={tw`text-lg font-bold mt-5 mb-2`}>
        Ride with {driverFirstName}
      </Text>
      <Text style={tw`mb-5`}>{formattedDate}</Text>

      <MapView style={styles.mapStyle} ref={mapRef} onLayout={onMapLayout}>
        <MapViewDirections
          origin={ride.origin.description}
          destination={ride.destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={6}
          strokeColor="#000"
        />
        <Marker
          coordinate={{
            latitude: ride.origin.lat,
            longitude: ride.origin.long,
          }}
          title="Origin"
        />
        <Marker
          coordinate={{
            latitude: ride.destination.lat,
            longitude: ride.destination.long,
          }}
          title="Destination"
        />
      </MapView>

      <View style={tw`my-5`}>
        <Text style={tw`font-bold mb-2`}>
          Origin: {ride.origin.description}
        </Text>
        <Text style={tw`font-bold mb-2`}>
          Destination: {ride.destination.description}
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
          onPress={() => navigation.navigate("RideIssuesScreen")}
        >
          <Text style={tw`text-black font-bold text-lg`}>Report Ride</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`border-b border-gray-300 my-5`}></View>

      <View>
        <Text style={tw`text-lg font-bold mb-5`}>Payment</Text>
        <View style={tw`flex-row justify-between items-center`}>
          <Icon name="credit-card" size={20} />
          <Text>{ride.paymentType}</Text>
          <Text>Kshs. {ride.cost.toFixed(2)}</Text>
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
