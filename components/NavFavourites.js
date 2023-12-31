import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setPerson, selectPerson } from "../slices/personSlice";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { ActivityIndicator } from "react-native";

import { setRide, selectRide } from "../slices/rideSlice";
import { setDestination, selectDestination } from "../slices/navSlice";

const NavFavourites = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [selectedId, setSelectedId] = useState("1");

  const [couponType, setCouponType] = useState("");
  const [couponAmount, setCouponAmount] = useState("");
  const [couponPercent, setCouponPercent] = useState("");
  const [couponStatus, setCouponStatus] = useState({ exists: null });

  const person = useSelector(selectPerson);
  const destination = useSelector(selectDestination);
  console.log("Current Person NF: ", person);

  const data = [
    { id: "1", text: "Cash", payment: "Pay when trip ends", icon: "cash" },
    { id: "2", text: "Card", payment: "Pay when trip ends", icon: "card" },
    { id: "3", text: "Wallet", payment: "Pay Instantly", icon: "wallet" },
    {
      id: "4",
      text: "Mpesa (STK-PUSH)",
      payment: "Pay when trip ends",
      icon: "phone-portrait",
    },
  ];

  const selectedItem = data.find((item) => item.id === selectedId);

  const radioButtons = useMemo(
    () =>
      data.map((item) => ({
        id: item.id,
        label: (
          <View style={tw`flex-row justify-between items-center w-full`}>
            <View style={tw`flex-row items-center`}>
              <Icon name={item.icon} type="ionicon" color="black" size={24} />
              <View style={tw`ml-2`}>
                <Text>{item.text}</Text>
                <Text>{item.payment}</Text>
              </View>
            </View>
          </View>
        ),
        value: item,
      })),
    [data]
  );

  // Check if Coupon Code Exists
  const checkPromoCode = async (promoCode) => {
    setIsLoading(true); // set loading state to true

    const couponQuerySnapshot = await db
      .collection("coupons")
      .where("couponTitle", "==", promoCode)
      .get();

    if (!couponQuerySnapshot.empty) {
      const couponData = couponQuerySnapshot.docs[0].data();

      console.log("Coupon data:", couponData); // This will print the coupon data

      setCouponType(couponData.couponType);
      setCouponAmount(couponData.couponAmount);
      setCouponPercent(couponData.couponPercent);

      setCouponStatus({
        exists: true,
        type: couponData.couponType,
        amount: couponData.couponAmount,
        percent: couponData.couponPercent,
      });
    } else {
      setCouponType("");
      setCouponAmount("");
      setCouponPercent("");

      setCouponStatus({
        exists: false,
      });
      console.log("Coupon data: Does Not Exist");
    }

    // Delay setting the loading state to false by 5 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  const handleRideNow = () => {
    navigation.navigate("RideOptionsCard", {
      promoCodeStatus: couponStatus.exists,
      promoCode: couponStatus.exists ? promoCode : null,
      paymentMethod: selectedItem,

      couponType: couponStatus.type ? couponType : null,
      couponAmount: couponStatus.amount ? couponAmount : null,
      couponPercent: couponStatus.percent ? couponPercent : null,
    });
  };

  const handleConfirm = async () => {
    console.log("Selected payment method:", selectedId);

    const person = useSelector(selectPerson);
    console.log("Current Person ROC: ", person);

    const currentRide = useSelector(selectRide);
    console.log("Current Person ROC: ", currentRide);

    await checkPromoCode(promoCode);

    setModalVisible(false);
  };

  const navigation = useNavigation();

  {
    /* 
  useEffect(() => {
    // Check if the 'destination' from Redux is empty or not
    const isDestinationEmpty = !destination || destination.trim() === "";

    // Update the disabled state based on 'destination'
    setDisabled(isDestinationEmpty);
  }, [destination]); // Listen for changes in 'destination'
  */
  }

  const [destState, setDestState] = useState(null);

  // Select the destination state from Redux
  const updatedDestination = useSelector(selectDestination);

  // Use useEffect to observe changes in the destination state
  useEffect(() => {
    // Log the updated destination state whenever it changes
    console.log("The Newest Destination:", updatedDestination);
    setDestState(updatedDestination);
  }, [updatedDestination]);

  if (destState == null) {
    console.log("Destination is Null");
  } else {
    console.log("Destination has been Populated");
  }

  return (
    <View>
      {/* Touchable Opacity */}
      <View style={tw`py-2 px-6`}>
        <TouchableOpacity
          style={tw`border-gray-700 border rounded-sm p-4 bg-yellow-400`}
          onPress={() => {
            setModalVisible(true);
            // setIsLoading(true);
          }}
        >
          <Text style={tw`text-gray-700 text-xs uppercase`}>Paying Via</Text>
          <View style={tw`flex-row justify-between`}>
            <Icon
              name={selectedItem?.icon}
              type="ionicon"
              color="black"
              size={32}
            />
            <View>
              <Text style={tw`text-lg font-semibold`}>
                {selectedItem?.text}
              </Text>
              <Text style={tw`text-sm font-semibold`}>
                {selectedItem?.payment}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <View style={tw`py-4`}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#030813" />
          ) : (
            <TouchableOpacity
              style={
                destState === null
                  ? tw`border-gray-700 border rounded-sm p-4 bg-gray-700 justify-center items-center`
                  : tw`border-gray-700 border rounded-sm p-4 bg-gray-900 justify-center items-center`
              }
              onPress={handleRideNow}
              disabled={destState === null}
            >
              <Text style={tw`text-white uppercase font-bold text-lg`}>
                Ride Now
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={tw`m-4 p-4 bg-yellow-400 rounded-sm`}>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-lg text-gray-900`}>Select Payment Method</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                // setIsLoading(false);
              }}
            >
              <Icon
                name="close-circle-outline"
                type="ionicon"
                color="black"
                size={32}
              />
              {/*<Text style={tw`text-lg`}>X</Text>*/}
            </TouchableOpacity>
          </View>
          <Text style={tw`text-sm text-gray-900 font-semibold`}>
            Choose your preferred payment method
          </Text>

          {/* Payment options */}
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
            style={tw`flex-row justify-start`}
          />

          {/* Promo code entry */}

          <View style={tw`pt-2`}>
            <TextInput
              style={tw`border rounded-sm bg-white p-2`}
              placeholder="Enter Promo Code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>

          {/* Confirm Coupon Button & Check Payment Details */}
          <View style={tw`pt-2`}>
            <TouchableOpacity
              style={tw`bg-gray-900 p-2 rounded-sm justify-center items-center`}
              onPress={handleConfirm}
            >
              <Text style={tw`font-bold text-white text-lg`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NavFavourites;
