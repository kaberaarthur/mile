import React, { useState, useEffect } from "react";
import { View, SafeAreaView, TextInput, FlatList, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

const TestScreen = () => {
  const [inputText, setInputText] = useState("");
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (inputText.trim() !== "") {
      // Encode input text for URL
      const encodedInput = encodeURIComponent(inputText);

      // API call
      fetch(
        `https://mile-cab-app.uc.r.appspot.com/get_place_suggestions?input_text=${encodedInput}`
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
          console.error("Error fetching suggestions:", error);
          setPredictions([]);
        });
    } else {
      setPredictions([]);
    }
  }, [inputText]);

  return (
    <SafeAreaView style={[tw`bg-white pt-20 px-5`]}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        onChangeText={(text) => setInputText(text)}
        value={inputText}
        placeholder="Enter place..."
      />
      <FlatList
        data={predictions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              paddingVertical: 10,
            }}
          >
            <Text>{item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No places found</Text>}
      />
    </SafeAreaView>
  );
};

export default TestScreen;
