import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

export default function OneRideIssueScreen({ route }) {
  const navigation = useNavigation();
  const { issue } = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleContactSupport = () => {
    console.log("Contacted support");
    setModalVisible(false);
  };

  return (
    <View style={tw`px-5 py-10`}>
      <View style={tw`flex-row items-center mb-5`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
      </View>
      <Text style={tw`text-lg font-bold mb-2`}>{issue.issue}</Text>
      <Text style={tw`text-base text-gray-500 mb-5`}>{issue.response}</Text>
      <TouchableOpacity
        style={[tw`py-4 px-2 rounded-sm mb-5 items-center`, styles.customColor]}
        onPress={toggleModal}
      >
        <Text style={[tw`text-lg font-medium`]}>Contact Support</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={tw`bg-white p-4 rounded-lg`}>
          <TouchableOpacity
            style={tw`absolute top-2 right-2`}
            onPress={toggleModal}
          >
            <Icon type="ionicon" name="close-outline" color="black" />
          </TouchableOpacity>
          <TextInput
            style={tw`border border-gray-300 p-2 mb-2 mt-8 h-20`}
            multiline={true}
            numberOfLines={4}
            placeholder="Type your message..."
            onChangeText={(text) => setInputValue(text)}
            value={inputValue}
          />
          <View style={tw`flex-row justify-end`}>
            <TouchableOpacity
              style={[
                tw`px-6 py-4 rounded-sm mr-2 font-bold`,
                styles.customColor,
              ]}
              onPress={toggleModal}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tw`px-6 py-4 rounded-sm font-bold`, styles.customColor]}
              onPress={handleContactSupport}
            >
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});
