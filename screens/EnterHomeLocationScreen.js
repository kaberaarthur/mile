import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const EnterHomeLocationScreen = () => {
  const [locationSelected, setLocationSelected] = useState(false);
  const navigation = useNavigation();

  const handleLocationSet = () => {
    console.log("Home Location is Set");
    navigation.navigate("ProfileScreen");
  };

  return (
    <SafeAreaView style={[tw`bg-white pt-5 h-full`]}>
      <View style={styles.container}>
        <ScrollView>
          <GooglePlacesAutocomplete
            placeholder="Enter your Home location"
            styles={toInputBoxStyles}
            onPress={(data, details = null) => {
              setLocationSelected(true);
              console.log(details.geometry.location);
              console.log(data.description);
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
          />
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.button,
            locationSelected ? styles.enabledButton : styles.disabledButton,
          ]}
          onPress={handleLocationSet}
          disabled={!locationSelected}
        >
          <Text style={styles.buttonText}>Set Home Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterHomeLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 5,
    marginTop: 10,
  },
  enabledButton: {
    backgroundColor: "black",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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
