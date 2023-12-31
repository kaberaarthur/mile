import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import tw from "tailwind-react-native-classnames";

const TestScreen = () => {
  const [origin, setOrigin] = useState({
    description: "TRM - Thika Road Mall, Nairobi, Kenya",
    location: { lat: -1.2195761, lng: 36.88842440000001 },
  });

  const [destination, setDestination] = useState({
    description: "Juja City Mall, Kalimoni, Kenya",
    location: { lat: -1.1177451, lng: 37.00892689999999 },
  });

  const [newTravelTimeInfo, setNewTravelTimeInfo] = useState(null);
  const [error, setError] = useState(null);

  // The logic to fetch travel time information
  const getTravelTime = async () => {
    try {
      const encodedOrigin = encodeURIComponent(origin.description);
      const encodedDestination = encodeURIComponent(destination.description);
      const GOOGLE_MAPS_APIKEY = "AIzaSyD0kPJKSOU4qtXrvddyAZFHeXQY2LMrz_M"; // Replace with your API key

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodedOrigin}&destinations=${encodedDestination}&key=${GOOGLE_MAPS_APIKEY}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();

      setNewTravelTimeInfo(data.rows[0].elements[0]);

      console.log(
        "##### Travel Time Info - Test Screen: ",
        data.rows[0].elements[0],
        "#####"
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      // Handle error condition
    }
  };

  useEffect(() => {
    if (origin && destination) {
      getTravelTime();
    }
  }, [origin, destination]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Test Screen</Text>
      <Text>Ride Options Card Origin: {JSON.stringify(origin)}</Text>
      <Text>Ride Options Card Destination: {JSON.stringify(destination)}</Text>
      <Text>
        Travel Time Info:{" "}
        {newTravelTimeInfo ? JSON.stringify(newTravelTimeInfo) : "No data"}
      </Text>
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}

      {/* Display error */}
      <Button title="Fetch Travel Time" onPress={getTravelTime} />
    </View>
  );
};

export default TestScreen;
