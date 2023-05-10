import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Modal from "react-native-modal";
import { CheckBox } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const reasons = [
  { id: 1, text: "I am no longer using my account" },
  { id: 2, text: "The service is too expensive" },
  { id: 3, text: "I want to change my phone number" },
  { id: 4, text: "I don't understand how the service works" },
  { id: 5, text: "Mile is not available in my city" },
  { id: 6, text: "Other" },
];

const DeleteAccountScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [checkedReasons, setCheckedReasons] = useState({});
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeleteAccount = () => {
    const selectedReasons = Object.keys(checkedReasons)
      .filter((id) => checkedReasons[id])
      .map((id) => reasons.find((reason) => reason.id === parseInt(id)));

    console.log("Selected reasons:", selectedReasons);

    console.log("Account has been deleted.");
    toggleModal();

    navigation.navigate("HomeScreen");
  };

  const renderItem = ({ item }) => (
    <View>
      <CheckBox
        title={item.text}
        textStyle={tw`text-gray-900`}
        containerStyle={tw`bg-white border-0 py-6`}
        onPress={() => {
          setCheckedReasons({
            ...checkedReasons,
            [item.id]: !checkedReasons[item.id],
          });
        }}
        checked={checkedReasons[item.id] || false}
      />
    </View>
  );

  return (
    <SafeAreaView style={[tw`py-10 px-5 h-full`, styles.container]}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`font-bold text-lg text-gray-900`}>Delete account</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
          <Text style={tw`text-2xl font-bold text-gray-900`}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={tw`text-base text-gray-600 mt-4 pb-4`}>
        We're really sorry to see you go. Are you sure you want to delete your
        account? Once you confirm, your data will be deleted.
      </Text>
      <FlatList
        data={reasons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={tw``}>
        <TouchableOpacity
          style={[tw`mt-5 py-3 px-6 rounded-sm`, styles.customColor]}
          onPress={toggleModal}
        >
          <Text style={tw`text-gray-900 font-bold text-center text-lg`}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={[tw`p-5 rounded-sm bg-white`]}>
          <Text style={tw`font-bold text-lg`}>
            Delete your Mile account permanently?
          </Text>
          <Text style={tw`text-gray-600 mt-4 text-base`}>
            You'll lose all your data and order history on Mile App.
          </Text>
          <TouchableOpacity
            style={[
              tw`mt-5 py-3 px-6 rounded-sm items-center`,
              styles.customColor,
            ]}
            onPress={handleDeleteAccount}
          >
            <Text style={tw`text-gray-900 font-bold`}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-gray-200 mt-3 py-3 px-6 rounded-sm items-center`}
            onPress={toggleModal}
          >
            <Text style={tw`text-gray-900 font-bold`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});
