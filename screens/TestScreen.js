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

const TestScreen = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [predictions, setPredictions] = useState([]);
  // const [origin, setOrigin] = useState(null);

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

export default TestScreen;
