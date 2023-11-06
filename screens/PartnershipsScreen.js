import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { db, auth } from "../firebaseConfig";
import firebase from "firebase/compat/app";

import { useDispatch, useSelector } from "react-redux";
// import { selectPerson, setPerson } from "../slices/personSlice";
import { selectUser, setUser } from "../slices/userSlice";

const partnerData = {
  id: "1",
  code: "PRT123",
  earnings: [
    { id: "MC120523001", total: 250 },
    { id: "MC011223002", total: 510 },
    { id: "MC010623003", total: 300 },
    { id: "MC171023004", total: 150 },
    { id: "MC120523005", total: 250 },
    { id: "MC011223006", total: 510 },
    { id: "MC010623007", total: 300 },
    { id: "MC171023008", total: 150 },
    { id: "MC120523009", total: 250 },
    { id: "MC0112230010", total: 510 },
    { id: "MC0106230011", total: 300 },
    { id: "MC1710230012", total: 150 },
  ],
};

const PartnershipsScreen = () => {
  // Get Current User 'Riders' ID
  const [userUID, setUserUID] = useState(null);

  // Get the Current User's UID
  useEffect(() => {
    // Define the cleanup function for unsubscribing
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        const uid = user.uid;
        console.log("User UID:", uid);
        setUserUID(uid);
      } else {
        // No user is signed in.
        console.log("No user is signed in.");
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Get User Details from Riders Collection
  const [person, setPerson] = useState(null);
  useEffect(() => {
    if (userUID) {
      // Define the query to get the rider document based on userUID
      const query = db.collection("riders").where("authID", "==", userUID);

      // Subscribe to Firestore updates for the query
      const unsubscribe = query.onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Document matching the condition exists
          const doc = querySnapshot.docs[0]; // Access the first (and only) document
          const riderData = doc.data();
          riderData.documentId = doc.id;
          setPerson(riderData);
          console.log("Rider Document Data:", riderData);
        } else {
          console.log("No matching documents found");
        }
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [userUID]);

  // We now have access to the Referre Code, use that to Reveal Rides Where a Commission was Generated
  // Get Partner Earnings for Current User
  const [partnerEarnings, setPartnerEarnings] = useState([]);

  useEffect(() => {
    // Check if person exists and has a valid documentId
    if (person && person.documentId) {
      // Reference to the Firestore collection
      const db = firebase.firestore();
      const partnerEarningsRef = db.collection("partnerEarnings");

      // Create a query to fetch documents where paid is false and referrer is equal to person.documentId
      const query = partnerEarningsRef
        .where("paid", "==", false)
        .where("referrer", "==", person.documentId);

      // Subscribe to the query and update the state when the data changes
      const unsubscribe = query.onSnapshot((snapshot) => {
        const partnerEarningsData = [];
        snapshot.forEach((doc) => {
          partnerEarningsData.push({ id: doc.id, ...doc.data() });
        });
        setPartnerEarnings(partnerEarningsData);
      });

      // Clean up the subscription when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [person]);

  useEffect(() => {
    // Check if Partner Earnings Exist
    if (partnerEarnings) {
      console.log("Partner Earnings: ", partnerEarnings);
    }
  }, [partnerEarnings]);

  // const person = useSelector(selectPerson);
  const theUser = useSelector((state) => state.user.user);

  const navigation = useNavigation();

  const [totalEarnings, setTotalEarnings] = useState([]);

  // Get Total of All Commissions
  useEffect(() => {
    if (partnerEarnings.length > 0) {
      // Calculate the total partnerCommission
      const total = partnerEarnings.reduce((acc, earning) => {
        // Convert partnerCommission to float, add it to the accumulator, and truncate to a whole number
        return acc + parseFloat(earning.partnerCommission) || 0;
      }, 0);

      // Truncate to a whole number
      const truncatedTotal = Math.trunc(total);

      setTotalEarnings(truncatedTotal);
      console.log("Partner Earnings Total: ", total);
    }
  }, [partnerEarnings]);

  const partnerLink = `https://mile.ke/partners/${theUser["partnerCode"]}`;

  const copyLinkToClipboard = async () => {
    await Clipboard.setStringAsync(partnerLink);
    Alert.alert(
      "Link copied",
      "The partner link has been copied to clipboard."
    );
  };

  const copyCodeToClipboard = async () => {
    await Clipboard.setStringAsync(person.partnerCode);
    Alert.alert(
      "Code copied",
      "The partner code has been copied to clipboard."
    );
  };

  return (
    <View style={tw`flex-1 py-10`}>
      <View style={[tw`h-1/3 items-center justify-center`, styles.customColor]}>
        <TouchableOpacity
          style={tw`absolute left-2 top-2`}
          onPress={() => navigation.goBack()}
        >
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-900 mt-6`}>
          Total Earnings - Ksh. {totalEarnings}
        </Text>
        <Text style={tw`text-sm font-semibold text-gray-900 mt-2`}>
          Partner link:
        </Text>
        <Text style={tw`text-xs font-semibold text-gray-900 mt-1 underline`}>
          {partnerLink}
        </Text>
        <TouchableOpacity
          style={tw`mt-1 bg-white p-2 rounded`}
          onPress={copyLinkToClipboard}
        >
          <Text style={tw`text-sm text-gray-900`}>Copy Link</Text>
        </TouchableOpacity>
        <Text style={tw`text-sm font-semibold text-gray-900 mt-2`}>
          Partner Code: {theUser["partnerCode"]}
        </Text>
        <TouchableOpacity
          style={tw`mt-1 bg-white p-2 rounded`}
          onPress={copyCodeToClipboard}
        >
          <Text style={tw`text-sm text-gray-900`}>Copy Code</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={tw`h-2/3 flex-1 bg-white`}>
        {partnerEarnings.map((earning) => (
          <View
            key={earning.id}
            style={tw`flex-row py-4 px-6 bg-white mt-3 mx-3 rounded-sm shadow-md`}
          >
            <Text style={tw`text-lg text-gray-800`}>
              {"MT" + earning.id.slice(-6)}
            </Text>
            <Text style={tw`text-lg font-bold text-gray-800 ml-auto`}>
              Ksh. {earning.partnerCommission}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});

export default PartnershipsScreen;
