import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import NavFavourites from "./NavFavourites";
import { selectDestination, setDestination } from "../slices/navSlice";

const NavigateCard = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [origin, setOrigin] = useState(null);

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

  // Select the destination state from Redux
  const newDestination = useSelector(selectDestination);

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
          setDestination({
            location: result.geometry.location,
            description: item.description,
          })
        );

        setInputText("");

        console.log("Location: ", result.geometry.location);
        console.log("Location Description: ", item.description);
      })
      .catch((error) => {
        console.error("Error fetching place details:", error);
        setOrigin(null);
      });
  };

  // Use useEffect to observe changes in the destination state
  useEffect(() => {
    // Log the updated destination state whenever it changes
    console.log("Updated destination:", newDestination);
  }, [newDestination]);

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/*<Text>Good Evening, John</Text>*/}
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <View style={tw`py-2 px-6`}>
          <TextInput
            style={styles.input}
            onChangeText={setInputText}
            value={inputText}
            placeholder="Enter your destination"
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
        {inputText === "" && <NavFavourites />}
        {/*  Include NavFavourites component */}
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
