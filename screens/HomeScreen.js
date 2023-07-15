import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";
import HomeOptions from "../components/HomeOptions";
navigator.geolocation = require("react-native-geolocation-service");
import { useNavigation } from "@react-navigation/native";

import { selectUser, setUser } from "../slices/userSlice";
import { selectPerson, setPerson } from "../slices/personSlice";
import { setRide, selectRide } from "../slices/rideSlice";

import { db, auth } from "../firebaseConfig";

// Current Location - Pending Issue
// Check React Native Maps Documentation

const HomeScreen = () => {
  const dispatch = useDispatch();
  const person = useSelector(selectPerson);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // console.log(person);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      // If still loading, don't do anything.
      return;
    }

    if (!user) {
      console.log("User is not logged in");

      // Redirect to the SignUpScreen
      navigation.navigate("SignUpScreen");
    } else {
      console.log("Current User: ", person);
    }
  }, [user, loading]);

  if (loading) {
    return null; // Or return a loading spinner.
  }

  return (
    <SafeAreaView style={[tw`bg-white h-full`]}>
      <View style={[tw`p-5`]}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={require("../assets/mile.png")}
        />

        <GooglePlacesAutocomplete
          placeholder="Add a pickup location"
          styles={toInputBoxStyles}
          onPress={(data, details = null) => {
            /*
            console.log(details.geometry.location);
            console.log(data.description);
            */

            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );

            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={200}
          /*
          currentLocation={true}
          currentLocationLabel="Current location"
          */
        />

        <NavOptions />

        <HomeOptions />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: "blue",
  },
});

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    borderRadius: 0,
    fontSize: 18,
  },
  textInputContainer: {
    paddingHorizontal: 6,
    paddingBottom: 0,
  },
});
