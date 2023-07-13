import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import tw from "tailwind-react-native-classnames";

const NavFavourites = () => {
  /* Start of Update Profile Code */
  const handleSubmit = () => {
    // Manually create the User Profile Using Email and Password
    console.log(phoneNumber);

    var riderRef = db.collection("riders").where("phone", "==", phoneNumber);
    const riderIDS = [];

    riderRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          riderIDS.push(doc.id);
          setRiderProfileID(riderIDS["0"]);
        });
        console.log(riderProfileID);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    // Update the Rider Profile with New Data
    if (riderProfileID) {
      var theRiderRef = db.collection("riders").doc(riderProfileID);

      theRiderRef
        .update({
          email: riderEmail,
          name: riderName,
          password: generatePassword(),
        })
        .then(() => {
          console.log("Rider Profile Updated Now!");
        })
        .then(() => {
          // Get Peofile Data
          console.log("Rider ID: " + riderProfileID);

          var docRef = db.collection("riders").doc(riderProfileID);

          docRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("New Rider Data:", doc.data());
                setUpdatedProfile(doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .then(() => {
              // Create a User With Email and Password
              console.log("Start Create User");
              console.log(
                updatedProfile["email"] + " " + updatedProfile["password"]
              );
              auth
                .createUserWithEmailAndPassword(
                  updatedProfile["email"],
                  updatedProfile["password"]
                )
                .then((userCredential) => {
                  // Signed in
                  var user = userCredential.user;
                  // ...
                  console.log("New User: " + user.uid);
                  setAuthID(user.uid);
                })
                .then(() => {
                  // Update the User Profile + Store with User Data
                  var theRiderRef = db.collection("riders").doc(riderProfileID);

                  theRiderRef
                    .update({
                      authID: authID,
                    })
                    .then(() => {
                      console.log("AuthID has been added!");
                    })
                    .catch((error) => {
                      console.log("Error Adding AuthID:", error);
                    });
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // ..

                  console.log("Error Creating User: " + errorMessage);
                });
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    } else {
      console.log("Did not Update Profile");
    }
  };
  /* End of Update Profile Code */
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
