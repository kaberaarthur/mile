import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";

import {
  selectDestination,
  selectOrigin,
  setTravelTimeInformation,
} from "../slices/navSlice";
import { setRide, selectRide } from "../slices/rideSlice";

import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { Image } from "react-native";

const markerImage = require("../assets/taxi-marker.png");

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom and Fit to Markers - This Feature isn't working perfectly ATM
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });

    console.log("Origin:", origin);
    console.log("Destination:", destination);
  }, [origin, destination]);

  // Calculate Time Taken + Distance
  useEffect(() => {
    if (!origin || !destination) return;

    // Encode URI Components
    const encodedDestination = encodeURIComponent(destination.description);
    const encodedOrigin = encodeURIComponent(origin.description);

    const getTravelTime = async () => {
      // const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodedOrigin}&destinations=${encodedDestination}&key=${GOOGLE_MAPS_APIKEY}`;
      // console.log(URL);

      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodedOrigin}&destinations=${encodedDestination}&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
          console.log(data.rows[0].elements[0]);

          dispatch(
            setRide({
              travelInfo: data.rows[0].elements[0],
            })
          );
        });
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="terrain"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin && destination && (
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="black"
        />
      )}

      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Origin"
          description={origin.description}
          identifier="origin"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerView}>
            <Image source={markerImage} style={styles.markerImage} />
          </View>
        </Marker>
      )}

      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  marker: {
    position: "absolute",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerImage: {
    width: 20,
    height: 55,
    transform: [{ rotate: "165deg" }],
  },
});

export default Map;
