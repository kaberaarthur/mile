import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const ConfirmCodeScreen = ({ navigation, route }) => {
  const { phoneNumber, expectedCode } = route.params;
  const [code, setCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true);

  const handleSignIn = () => {
    if (code === expectedCode.toString()) {
      navigation.navigate("HomeScreen");
    } else {
      setIsValidCode(false);
    }
  };

  const handleResendCode = () => {
    // Handle resend code logic
  };

  return (
    <SafeAreaView style={tw`flex-1 p-4`}>
      <View style={tw`flex-row items-center mb-5`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            type="ionicon"
            name="arrow-back-outline"
            color="white"
            containerStyle={tw`bg-black p-2 rounded-full`}
          />
        </TouchableOpacity>
        <Text style={tw`text-xl ml-4 font-semibold`}>Enter 4 digit code</Text>
      </View>
      <Text style={tw`text-lg mb-2`}>
        Enter the 4 digit code sent to {phoneNumber}.
      </Text>
      <View style={tw`border border-black rounded-sm px-4 py-2 mb-2`}>
        <TextInput
          style={tw`w-full text-lg`}
          placeholder="Enter code"
          keyboardType="numeric"
          maxLength={4}
          value={code}
          onChangeText={setCode}
          onFocus={() => setIsValidCode(true)}
        />
      </View>
      {!isValidCode && (
        <Text style={tw`text-red-500 mb-2`}>You entered the wrong code</Text>
      )}
      <TouchableOpacity
        style={tw`bg-yellow-500 py-2 px-4 rounded-sm`}
        onPress={handleSignIn}
      >
        <Text style={tw`text-lg font-bold text-center text-black`}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={tw`text-lg font-bold text-center mt-4`}>Resend Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConfirmCodeScreen;
