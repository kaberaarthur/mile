import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import { FlatList } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import {
  selectTravelTimeInformation,
  selectDestination,
  selectOrigin,
} from "../slices/navSlice";
import { setPerson, selectPerson } from "../slices/personSlice";
import { setRide, selectRide } from "../slices/rideSlice";

import { db, auth } from "../firebaseConfig";
import firebase from "firebase/compat/app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Round off Price to Nearest Ten
function roundToNearestTen(number) {
  return Math.round(number / 10) * 10;
}

// Calculate price based on coupon type
function calculatePrice(price, couponType, couponAmount, couponPercent) {
  if (couponType === "amount") {
    return price - couponAmount;
  } else if (couponType === "percent") {
    const discount = (price * couponPercent) / 100;
    return price - discount;
  } else {
    return price;
  }
}

// Calculate deduction based on coupon type
function calculateDeduction(price, couponType, couponAmount, couponPercent) {
  if (couponType === "amount") {
    return couponAmount;
  } else if (couponType === "percent") {
    return (price * couponPercent) / 100;
  } else {
    return 0;
  }
}

const data = [
  {
    id: "Standard-Ride",
    title: "Standard Ride",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Comfort-Ride",
    title: "Comfort Ride",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Luxury-Ride",
    title: "Luxury Ride",
    multiplier: 1.5,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "Queens-Ride",
    title: "Queens Ride",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
  {
    id: "Premium",
    title: "Premium",
    multiplier: 2.2,
    image: "https://links.papareact.com/7pf",
  },
];

const RideOptionsCard = ({ route }) => {
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

  const [person, setPerson] = useState(null);

  // Get the Curr User's Rider Data
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

  const dispatch = useDispatch();

  const {
    promoCodeStatus,
    promoCode,
    paymentMethod,
    couponType,
    couponAmount,
    couponPercent,
  } = route.params;

  console.log(
    "PromoCode & PromoStatus: " +
      promoCode +
      " - " +
      promoCodeStatus +
      " - " +
      paymentMethod.id +
      " - " +
      couponType
  );

  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  const [totalData, setTotalData] = useState(null);
  const [deductionData, setDeductionData] = useState(null);
  const [afterDeductionData, setAfterDeductionData] = useState(null);

  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  // const person = useSelector(selectPerson);
  // console.log("Current Person ROC: ", person);

  const currentRide = useSelector(selectRide);
  console.log("Current Person ROC: ", currentRide);

  // Generate TimeStamp
  const currentTimestamp = new Date();

  // Transform Arrays
  const originObj = [origin];
  const destinationObj = [destination];
  const travelTimeInformationObj = [travelTimeInformation];

  // Get User Data
  const firstUser = useSelector((state) => state.user.user);

  const loading = false;

  if (loading) {
    return null; // Or return a loading spinner.
  }

  const handlePress = async () => {
    console.log("Person Data Rider ID: ", person.documentId);

    // Check type of Coupon if It Exists and Add it Below
    const deduction = roundToNearestTen(
      calculateDeduction(
        30 *
          parseInt(travelTimeInformation?.duration.text.replace(/ mins/, "")) *
          selected.multiplier,
        couponType,
        couponAmount,
        couponPercent
      )
    );

    // Calculate the Total Price
    const theGrandTotal = roundToNearestTen(
      calculatePrice(
        30 *
          parseInt(travelTimeInformation?.duration.text.replace(/ mins/, "")) *
          selected.multiplier,
        couponType,
        couponAmount,
        couponPercent
      )
    );

    // Calculate Price if there are Deductions
    const totalWithDeductions = roundToNearestTen(
      parseInt(theGrandTotal) - parseInt(deduction)
    );

    // Create a date formatted like - YYYY-MM-DDTHH:mm:ss
    function createFormattedDate() {
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 19);
      return formattedDate;
    }

    // Define a reference to the Firestore collection "rides"
    const ridesCollection = db.collection("rides");

    // Define the query to check if a document with the specified conditions exists
    const query = ridesCollection
      .where("rideStatus", "==", "1")
      .where("riderId", "==", person["authID"])
      .limit(1);

    // Execute the query to get the matching documents
    const querySnapshot = await query.get();

    if (!querySnapshot.empty) {
      // If a matching document exists, update its data
      const doc = querySnapshot.docs[0]; // Access the first (and only) document
      const rideDocRef = doc.ref;

      // Define the data you want to update in the existing document
      const updateData = {
        couponCode: promoCode,
        couponSet: promoCodeStatus,
        couponType: couponType,
        couponAmount: couponAmount,
        couponPercent: couponPercent,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        discountPercent: "",
        discountSet: false,
        driverId: "",
        driverName: "",
        driverPhone: "",
        driverRating: "",
        endTime: "",
        paymentMethod: paymentMethod,
        rideDestination: destinationObj,
        rideLevel: selected.title,
        rideOrigin: originObj,
        rideStatus: "1",
        rideTravelInformation: travelTimeInformationObj,
        riderId: person.authID,
        riderName: person.name,
        riderPhone: person.phone,
        riderRating: 4.5,
        startTime: "",
        totalDeduction: deduction,
        totalClientPays: totalWithDeductions,
        totalFareBeforeDeduction: theGrandTotal,
        vehicleBrand: "",
        vehicleCC: "",
        vehicleId: "",
        vehicleLicense: "",
        vehicleName: "",
      };

      await rideDocRef.update(updateData);

      // Remove the 'dateCreated' property from rideData before dispatching
      delete updateData.dateCreated;

      console.log("Empty Ride Document Updated!");

      // Dispatch ride data to the store
      const rideId = rideDocRef.id;
      updateData.documentId = rideId; // Add the document ID to your data
      dispatch(setRide(updateData)); // Dispatch the data to the store

      // Try This
      const rideData = updateData;

      // Navigate to WaitDriverScreen and pass rideData as a parameter
      navigation.navigate("MapDirectionScreen", { rideData });
    } else {
      // If no matching document exists, create a new one
      const rideDocRef = ridesCollection.doc(); // Create a new document reference

      // Define the data for the new document
      const rideData = {
        couponCode: promoCode,
        couponSet: promoCodeStatus,
        couponType: couponType,
        couponAmount: couponAmount,
        couponPercent: couponPercent,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        discountPercent: "",
        discountSet: false,
        driverId: "",
        driverName: "",
        driverPhone: "",
        driverRating: "",
        endTime: "",
        paymentMethod: paymentMethod,
        rideDestination: destinationObj,
        rideLevel: selected.title,
        rideOrigin: originObj,
        rideStatus: "1",
        rideTravelInformation: travelTimeInformationObj,
        riderId: person.authID,
        riderName: person.name,
        riderPhone: person.phone,
        riderRating: 4.5,
        startTime: "",
        totalDeduction: deduction,
        totalClientPays: totalWithDeductions,
        totalFareBeforeDeduction: theGrandTotal,
        vehicleBrand: "",
        vehicleCC: "",
        vehicleId: "",
        vehicleLicense: "",
        vehicleName: "",
      };

      // Set the new document data
      await rideDocRef.set(rideData);
      // Remove the 'dateCreated' property from rideData before dispatching
      delete rideData.dateCreated;

      console.log("Document successfully written!");

      // Dispatch ride data to the store
      const rideId = rideDocRef.id;
      rideData.documentId = rideId; // Add the document ID to your data
      dispatch(setRide(rideData)); // Dispatch the data to the store

      // Navigate to WaitDriverScreen and pass rideData as a parameter
      navigation.navigate("MapDirectionScreen", { rideData });
    }
  };

  return (
    <View style={tw`bg-white flex-grow`}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("NavigateCard")}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={handlePress}
            disabled={!selected}
            style={tw`bg-black py-3 m-3 
        ${!selected && "bg-gray-300"}`}
          >
            <Text style={tw`text-center text-white text-xl`}>
              Confirm {selected?.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { id, title, multiplier, image }, item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={tw`flex-row justify-between items-center px-6 ${
              id === selected?.id && "bg-gray-200"
            }`}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
              }}
              source={{ uri: image }}
            />
            <View style={tw`-ml-6`}>
              <Text style={tw`text-xl font-semibold`}>{title}</Text>
              <Text>{travelTimeInformation?.duration.text} - Travel time</Text>
            </View>
            <Text style={tw`text-base font-bold`}>
              Kshs.
              {roundToNearestTen(
                calculatePrice(
                  30 *
                    parseInt(
                      travelTimeInformation?.duration.text.replace(/ mins/, "")
                    ) *
                    multiplier,
                  couponType,
                  couponAmount,
                  couponPercent
                )
              )}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
