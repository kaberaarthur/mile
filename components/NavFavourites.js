import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setPerson, selectPerson } from "../slices/personSlice";
import { useNavigation } from "@react-navigation/native";

const NavFavourites = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  /*
  const person = useSelector(selectPerson);
  console.log("Current Person NF: ", person);
  */

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

  const [selectedId, setSelectedId] = useState("1");
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

  const handleConfirm = () => {
    console.log("Selected payment method:", selectedId);
    console.log("Promo code entered:", promoCode ? true : false, promoCode);
    setModalVisible(false);
  };

  const navigation = useNavigation();

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
          <TouchableOpacity
            style={tw`border-gray-700 border rounded-sm p-4 bg-gray-900 justify-center items-center`}
            onPress={() =>
              navigation.navigate("RideOptionsCard", {
                promoCodeStatus: promoCode ? true : false,
                promoCode: promoCode,
                paymentMethod: selectedItem,
              })
            }

            // Set the Store
          >
            <Text style={tw`text-white uppercase font-bold text-lg`}>
              Ride Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={tw`m-4 p-4 bg-yellow-400 rounded-sm`}>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-lg text-gray-900`}>Select Payment Method</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
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

          {/* Confirm button */}
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
