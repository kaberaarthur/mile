import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";

const riderLocation = {
  description: "Garden City Mall, Thika Road, Nairobi, Kenya",
  location: { lat: -1.2324833, lng: 36.8787799 },
};

const driverLocation = {
  description: "TRM - Thika Road Mall, Nairobi, Kenya",
  location: { lat: -1.2195761, lng: 36.88842440000001 },
};

const driverDetails = {
  name: "Ben Kitili",
  car: "KCM 354S, Honda Fit, White",
  profilePicture: require("../assets/profile.jpg"),
};

const WaitDriverScreen = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(["driver", "rider"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  }, []);

  return (
    <View style={tw`flex-1`}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={tw`h-3/4`}
        mapType="terrain"
        initialRegion={{
          latitude: riderLocation.location.lat,
          longitude: riderLocation.location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marker for the driver */}
        <Marker
          coordinate={driverLocation.location}
          title="Driver Location"
          description={driverDetails.car}
          identifier="driver"
        />

        {/* Marker for the rider */}
        <Marker
          coordinate={riderLocation.location}
          title="Your Location"
          description={riderLocation.description}
          identifier="rider"
        />

        {/* Path to show route */}
        <MapViewDirections
          origin={driverLocation.location}
          destination={riderLocation.location}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="blue"
        />
      </MapView>

      {/* Driver Info */}
      <SafeAreaView style={tw`h-1/4 bg-white p-4`}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={driverDetails.profilePicture}
          />
        </View>
        <Text style={tw`text-lg text-gray-900`}>{driverDetails.name}</Text>
        <Text style={tw`text-gray-900`}>{driverDetails.car}</Text>
        {/* Placeholder for dynamically calculated time */}
        <Text style={tw`text-gray-900`}>Driver arriving in X minutes</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    ...tw`rounded-full border-4`,
    borderColor: "#F5B800",
    overflow: "hidden",
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
});

export default WaitDriverScreen;
