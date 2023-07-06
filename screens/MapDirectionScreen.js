import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Image, Text } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import tw from "tailwind-react-native-classnames";

const origin = { latitude: -1.2850204, longitude: 36.8259191 };
const destination = { latitude: -1.2195761, longitude: 36.88842440000001 };

const driverDetails = {
  name: "Vusi Thembekwayo",
  car: "KCM 354S, Honda Fit, White",
  profilePicture: require("../assets/profile.jpg"),
};

const MapDirectionsScreen = () => {
  const [minutes, setMinutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [travelMinutes, setTravelMinutes] = useState(null);

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
          console.log(data.rows[0].elements[0].duration.text);
        }
      } catch (error) {
        console.error("Error calculating travel time:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateMinutes();
  }, []);

  return (
    <View style={tw`flex-1`}>
      <View style={styles.container}>
        <MapView
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
            strokeWidth={3}
            strokeColor="blue"
          />
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
});

export default MapDirectionsScreen;
