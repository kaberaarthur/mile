import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import HomeOptions from "../components/HomeOptions";
import { setDestination, setOrigin } from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { setUser } from "../slices/userSlice";
import { setPerson } from "../slices/personSlice";
import { setRide, selectRide } from "../slices/rideSlice";
import { fetchUserData, selectUser } from "../slices/userSlice";

import { db, auth } from "../firebaseConfig";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [predictions, setPredictions] = useState([]);

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  // const [origin, setOrigin] = useState(null);

  // Take User Credentials
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Check if there is a logged in User
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
      console.log("Current User Here: ", user.uid);

      // Get the Profile using user.uid
      // Query for the document with the specified field value
      db.collection("riders")
        .where("authID", "==", user.uid)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // There should be only one matching document, so we access it using .docs[0]
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            // Handle the document data here
            console.log("Rider Document data:", data);
            setUserData(data);

            const { dateRegistered, otpDate, ...userDataWithoutDates } = data;

            console.log("Withour Dates: ", userDataWithoutDates);

            // Dispatch the data directly to the store
            dispatch(fetchUserData(userDataWithoutDates));
          } else {
            console.log("No matching documents found");
          }
        })
        .catch((error) => {
          console.error("Error querying for document: ", error);
        });
    }
  }, [user, loading]);

  // Inside your component
  const firstUser = useSelector((state) => state.user.user);

  if (firstUser && Object.keys(firstUser).length > 0) {
    // Data is available, you can use it here
    console.log("User data from the Redux store:", firstUser);
  } else {
    // Data is still loading or not available
    console.log("Data is still loading or not available");
  }

  useEffect(() => {
    if (inputText.trim() !== "") {
      const encodedInput = encodeURIComponent(inputText);

      fetch(
        `https://mile-cab-app.uc.r.appspot.com/get_full_place_data?input_text=${encodedInput}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.json();
        })
        .then((data) => {
          setPredictions(data.predictions || []);
        })
        .catch((error) => {
          console.error("Error fetching predictions:", error);
          setPredictions([]);
        });
    } else {
      setPredictions([]);
    }
  }, [inputText]);

  const handleItemPress = (item) => {
    fetch(
      `https://mile-cab-app.uc.r.appspot.com/get_place_details?place_id=${item.place_id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        const result = data.result || {};

        dispatch(
          setOrigin({
            location: result.geometry.location,
            description: item.description,
          })
        );

        setInputText("");

        dispatch(setDestination(null));

        console.log("Location: ", result.geometry.location);
        console.log("Location Description: ", item.description);
      })
      .catch((error) => {
        console.error("Error fetching place details:", error);
        setOrigin(null);
      });
  };

  return (
    <SafeAreaView style={[tw`bg-white h-full pt-10`]}>
      <View style={[tw`p-5`]}>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 20,
            paddingHorizontal: 10,
          }}
          onChangeText={setInputText}
          value={inputText}
          placeholder="Where to?"
        />

        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                  paddingVertical: 10,
                }}
              >
                <Text>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No places found</Text>}
        />
      </View>

      <NavOptions />
      {inputText === "" && <HomeOptions />}
    </SafeAreaView>
  );
};

export default HomeScreen;
