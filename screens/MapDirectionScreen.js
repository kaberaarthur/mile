import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import tw from "tailwind-react-native-classnames";

import { setRide, selectRide } from "../slices/rideSlice";

const origin = {
  latitude: -1.2850204,
  longitude: 36.8259191,
  description: "Moi Avenue, next to Ambassadeur Hotel, Nairobi, Kenya",
};
const destination = {
  latitude: -1.2195761,
  longitude: 36.88842440000001,
  description: "QVJQ+58H, Thika Rd, Nairobi, Kenya",
};

const driverDetails = {
  name: "Vusi Thembekwayo",
  car: "KCM 354S, Honda Fit, White",
  profilePicture: require("../assets/profile.jpg"),
};

const MapDirectionsScreen = () => {
  const [minutes, setMinutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [travelMinutes, setTravelMinutes] = useState(null);
  const mapRef = useRef(null);

  const ride = useSelector(selectRide);
  console.log("Ride Data: ", ride);

  useEffect(() => {
    const calculateMinutes = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_APIKEY}`
        );
        const data = await response.json();
        const travelMinutes = data.rows[0].elements[0].duration.text;

        if (travelMinutes.length > 0) {
          setTravelMinutes(travelMinutes);
        }
      } catch (error) {
        console.error("Error calculating travel time:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateMinutes();
  }, []);

  useEffect(() => {
    // Fit map to markers after it's loaded
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, []);

  return (
    <View style={tw`flex-1`}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="black"
          />

          {/* Origin Marker */}
          <Marker coordinate={origin}>
            <TouchableOpacity style={tw`bg-yellow-400 p-2 rounded-sm`}>
              <View>
                <Text style={tw`text-gray-900 text-xs`}>Driver Location</Text>
                <Text style={tw`text-gray-900 text-sm font-bold`}>
                  Tabby House, Thika
                </Text>
              </View>
            </TouchableOpacity>
          </Marker>

          {/* Destination Marker */}
          <Marker coordinate={destination}>
            <TouchableOpacity style={tw`bg-yellow-400 p-2 rounded-sm`}>
              <View>
                <Text style={tw`text-gray-900 text-xs`}>Your Location</Text>
                <Text style={tw`text-gray-900 text-sm font-bold`}>
                  TRM Drive, Thika Road
                </Text>
              </View>
            </TouchableOpacity>
          </Marker>
        </MapView>
      </View>

      {/* Driver Info */}
      <SafeAreaView style={tw`h-1/4 bg-white p-4`}>
        <View style={[styles.driverInfoContainer, tw``]}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={driverDetails.profilePicture}
            />
          </View>
          <View style={styles.driverDetailsContainer}>
            <Text style={tw`text-lg text-gray-900 font-bold`}>
              {driverDetails.name}
            </Text>
            <Text style={tw`text-gray-900 font-semibold`}>
              {driverDetails.car}
            </Text>

            {loading ? (
              <Text style={tw`text-gray-900`}>Calculating travel time...</Text>
            ) : (
              <Text style={tw`text-gray-900 text-lg`}>
                Driver arriving in {travelMinutes}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  driverInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profileImageContainer: {
    ...tw`rounded-full border-4`,
    borderColor: "#F5B800",
    overflow: "hidden",
    width: 80,
    height: 80,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  driverDetailsContainer: {
    marginLeft: 8,
    paddingLeft: 12,
  },
  markerButton: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MapDirectionsScreen;
