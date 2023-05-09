import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      let greetingText = "";

      if (currentHour >= 5 && currentHour < 12) {
        greetingText = "Good Morning";
      } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good Afternoon";
      } else {
        greetingText = "Good Evening";
      }

      setGreeting(greetingText);
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60 * 1000); // Update greeting every minute

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return <Text style={tw`text-center py-5 text-xl`}>{greeting}, Arthur</Text>;
};

export default Greeting;
