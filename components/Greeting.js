import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";

const Greeting = () => {
  const user = useSelector(selectUser);

  // Limit the name to just the first name entered
  const getFirstWord = (str) => str.split(" ")[0];
  const userName = getFirstWord(user.name);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      let greetingText = "";

      if (currentHour >= 5 && currentHour < 12) {
        greetingText = "Good Morning ";
      } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good Afternoon ";
      } else {
        greetingText = "Good Evening ";
      }

      setGreeting(greetingText);
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60 * 1000); // Update greeting every minute

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <Text style={tw`text-center py-5 text-xl`}>
      {greeting}, {userName}
    </Text>
  );
};

export default Greeting;
