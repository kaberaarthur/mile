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
import { useNavigation } from "@react-navigation/native";

import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import tw from "tailwind-react-native-classnames";

import { selectRide } from "../slices/rideSlice";
import { db, auth } from "../firebaseConfig";
import { ActivityIndicator } from "react-native";

/*
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
*/

const driverDetails = {
  name: "Vusi Thembekwayo",
  car: "KCM 354S, Honda Fit, White",
  profilePicture: require("../assets/profile.jpg"),
};

const MapDirectionsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [travelMinutes, setTravelMinutes] = useState(null);
  const mapRef = useRef(null);
  const [fetchedDocument, setFetchedDocument] = useState(null); // State to store the fetched document
  const [rideStatus, setRideStatus] = useState(null); // State to store the fetched document
  const [liveRideData, setLiveRideData] = useState(null); // State to store the fetched document

  const [driverName, setDriverName] = useState(null);
  const [driverPhone, setDriverPhone] = useState(null);
  const [driverCar, setDriverCar] = useState(null);

  function cropString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength - 3) + "...";
    }
  }

  // Access rideData from the navigation params
  const rideData = route.params.rideData;
  /*
  console.log(
    "Ride Data from the Route Params:",
    rideData["rideDestination"][0]["location"]
  );
  */

  const origin = {
    latitude: rideData["rideOrigin"][0]["location"]["lat"],
    longitude: rideData["rideOrigin"][0]["location"]["lng"],
    description: rideData["rideOrigin"][0]["description"],
  };

  const destination = {
    latitude: rideData["rideDestination"][0]["location"]["lat"],
    longitude: rideData["rideDestination"][0]["location"]["lng"],
    description: rideData["rideDestination"][0]["description"],
  };

  // Get the Firestore Document
  useEffect(() => {
    // Define a function to fetch the document
    const fetchRideDocument = async () => {
      if (rideData && rideData.documentId) {
        try {
          const rideDocRef = db.collection("rides").doc(rideData.documentId);
          const docSnapshot = await rideDocRef.get();
          if (docSnapshot.exists) {
            // Document found, store it in the state
            setFetchedDocument(docSnapshot.data());
          } else {
            console.log("Document does not exist");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    // Call the function to fetch the document
    fetchRideDocument();
  }, [rideData]);

  useEffect(() => {
    // Define a function to subscribe to Firestore updates
    const subscribeToFirestore = () => {
      if (rideData && rideData.documentId) {
        const rideDocRef = db.collection("rides").doc(rideData.documentId);

        // Subscribe to Firestore updates
        const unsubscribe = rideDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            // Document found, update the rideStatus in the state
            setRideStatus(doc.data().rideStatus);
            // Add the document ID to the data
            const dataWithId = doc.data();
            dataWithId.rideId = doc.id;

            setLiveRideData(dataWithId);
          } else {
            console.log("Document does not exist");
          }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      }
    };

    // Call the function to subscribe to Firestore updates
    subscribeToFirestore();
  }, [rideData]);

  useEffect(() => {
    if (liveRideData) {
      console.log("Live Ride Data: ", liveRideData);

      setDriverCar(
        liveRideData["vehicleBrand"] +
          ", " +
          liveRideData["vehicleName"] +
          ", " +
          liveRideData["vehicleLicense"]
      );
      setDriverName(liveRideData["driverName"]);
      setDriverPhone(liveRideData["driverPhone"]);
    }
  }, [liveRideData]);

  useEffect(() => {
    async function calculateTravelMinutes() {
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
      }
    }

    calculateTravelMinutes();
  }, [rideData]);

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
            latitude: rideData["rideOrigin"][0]["location"]["lat"],
            longitude: rideData["rideOrigin"][0]["location"]["lng"],
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
                <Text style={tw`text-gray-900 text-xs`}>Origin</Text>
                <Text style={tw`text-gray-900 text-sm font-bold`}>
                  {cropString(rideData["rideOrigin"][0]["description"], 20)}
                </Text>
              </View>
            </TouchableOpacity>
          </Marker>

          {/* Destination Marker */}
          <Marker coordinate={destination}>
            <TouchableOpacity style={tw`bg-yellow-400 p-2 rounded-sm`}>
              <View>
                <Text style={tw`text-gray-900 text-xs`}>Destination</Text>
                <Text style={tw`text-gray-900 text-sm font-bold`}>
                  {cropString(
                    rideData["rideDestination"][0]["description"],
                    20
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          </Marker>
        </MapView>
      </View>

      {/* Driver Info */}
      <SafeAreaView style={tw`h-1/4 bg-white p-4`}>
        {rideStatus === "2" && (
          <View>
            <View style={[styles.driverInfoContainer, tw``]}>
              <View style={styles.profileImageContainer}>
                <Image
                  style={styles.profileImage}
                  source={driverDetails.profilePicture}
                />
              </View>
              <View style={styles.driverDetailsContainer}>
                <Text style={tw`text-lg text-gray-900 font-bold`}>
                  {driverName}
                </Text>
                <Text style={tw`text-gray-900 font-semibold`}>
                  {driverPhone}
                </Text>
                <Text style={tw`text-gray-900 font-semibold`}>{driverCar}</Text>
                <Text style={tw`text-gray-900 text-lg`}>
                  {travelMinutes
                    ? `Arriving in ${"5 Mins"}`
                    : "Calculating travel time..."}
                </Text>
              </View>
            </View>
            <View style={[styles.driverInfoContainer, tw``]}>
              <TouchableOpacity
                style={tw`border-gray-700 border rounded-sm py-4 px-10 bg-yellow-400 justify-center items-center w-full`}
                onPress={() => {
                  console.log("Contact Driver pressed");
                  navigation.navigate("ChatScreen", { liveRideData });
                }}
              >
                <Text style={tw`text-gray-900 uppercase font-bold text-sm`}>
                  {/* Add a Link to Contact Driver Page */}
                  Contact Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {rideStatus === "1" && (
          <View style={[styles.driverInfoContainer, tw``]}>
            <TouchableOpacity
              style={tw`border-gray-700 border rounded-sm py-4 px-10 bg-yellow-400 justify-center items-center w-full`}
            >
              <ActivityIndicator size="large" color="#000" />
              <Text style={tw`text-gray-900 uppercase font-bold text-sm`}>
                Locating Driver
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
