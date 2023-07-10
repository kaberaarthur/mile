import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import tw from "tailwind-react-native-classnames";

const NavFavourites = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const radioButtons = useMemo(
    () => [
      {
        id: "cash",
        label: "Cash\nPay when trip ends",
        value: "cash",
      },
      {
        id: "card",
        label: "Card\nPay when trip ends",
        value: "card",
      },
      {
        id: "wallet",
        label: "Wallet\nPay Instantly",
        value: "wallet",
      },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState("cash");

  const handleConfirm = () => {
    console.log("Selected payment method:", selectedId);
    console.log("Promo code entered:", promoCode ? true : false, promoCode);
    setModalVisible(false);
  };

  return (
    <View>
      {/* Touchable Opacity */}
      <View style={tw`py-2 px-6`}>
        <TouchableOpacity
          style={tw`border-gray-700 border rounded-sm p-4 bg-yellow-400`}
          onPress={() => setModalVisible(true)}
        >
          <Text style={tw`text-gray-700 text-xs uppercase`}>Paying Via</Text>
          <View style={tw`flex-row justify-between`}>
            <Ionicons name="cash" size={24} color="black" />
            <View>
              <Text style={tw`text-lg font-semibold`}>Payment Method</Text>
              <Text style={tw`text-sm font-semibold`}>When to Pay</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <View style={tw`py-4`}>
          <TouchableOpacity
            style={tw`border-gray-700 border rounded-sm p-4 bg-gray-900 justify-center items-center`}
          >
            <Text
              style={tw`text-white uppercase font-bold text-lg`}
              onPress={() => console.log("Ride Now")}
            >
              Ride Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={tw`m-4 p-4 bg-white rounded-sm`}>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-lg text-gray-900`}>Select Payment Method</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={tw`text-lg`}>X</Text>
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

          {/* Confirm button */}
          <View style={tw`pt-2`}>
            <TouchableOpacity
              style={tw`bg-yellow-400 p-2 rounded-sm justify-center items-center`}
              onPress={handleConfirm}
            >
              <Text style={tw`font-bold text-gray-900 text-lg`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NavFavourites;
