import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectPerson, setPerson } from "../slices/personSlice";
import { db, auth } from "../firebaseConfig";
import { ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const firstUser = useSelector((state) => state.user.user);
  const [userName, setName] = useState(firstUser["name"]);
  const [person, setPerson] = useState(null);
  const [userUID, setUserUID] = useState(null);
  const [image, setImage] = useState(null);

  const [downloadURL, setDownloadURL] = useState(null);
  const [imageError, setImageError] = useState("");
  const [photo, setPhoto] = useState("");
  const [licenseFileName, setLicenseFileName] = useState("");

  const handleImageSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("Permission to access media library is required!");
      return;
    }

    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        console.log(pickerResult.assets[0].uri);

        const imageUri = pickerResult.assets[0].uri;
        const userUid = auth.currentUser.uid;
        const timestamp = new Date().getTime();

        // Extract file extension from the image's URI
        const fileExtension = imageUri.split(".").pop();
        const filename = `${userUid}-${timestamp}-lc.${fileExtension}`;

        setPhoto(pickerResult.assets[0].uri);
        setLicenseFileName(filename);
        console.log("File Name: " + filename);

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = firebase
          .storage()
          .ref()
          .child(`documents/profile-pictures/${filename}`);

        try {
          await storageRef.put(blob);
          console.log("Image uploaded successfully");

          // Get the download URL of the uploaded file
          const downloadURL = await storageRef.getDownloadURL();
          console.log("Download URL:", downloadURL);

          // Now you can use the downloadURL as needed, for example, store it in a state
          setDownloadURL(downloadURL);
        } catch (error) {
          console.error("Error uploading image: ", error);
          setImageError(error.message);
        }
      }
    } catch (error) {
      console.error("Error handling image: ", error);
      // You should handle the error here, such as displaying an error message to the user.
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log("User UID:", uid);
        setUserUID(uid);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userUID) {
      const query = db.collection("riders").where("authID", "==", userUID);
      const unsubscribe = query.onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const riderData = doc.data();
          riderData.documentId = doc.id;
          setPerson(riderData);
          console.log("Rider Document Data:", riderData);
        } else {
          console.log("No matching documents found");
        }
      });

      return () => unsubscribe();
    }
  }, [userUID]);

  const dispatch = useDispatch();

  const updateProfile = async (documentId) => {
    const updatedName = userName.trim();

    if (updatedName) {
      db.collection("riders")
        .doc(documentId)
        .update({
          name: updatedName,
        })
        .then(async () => {
          console.log("Name successfully updated!");

          if (image) {
            const userUid = auth.currentUser.uid;
            const timestamp = new Date().getTime();
            const fileExtension = image.split(".").pop();
            const filename = `${userUid}-${timestamp}-profile.${fileExtension}`;

            const response = await fetch(image);
            const blob = await response.blob();

            console.log("Filename: ", filename);

            const storageRef = firebase
              .storage()
              .ref()
              .child(`documents/profile-pictures/${filename}`);

            storageRef.put(blob);
            console.log("Image uploaded successfully");

            /*

            try {
              await storageRef.put(blob);
              console.log("Image uploaded successfully");

              const downloadURL = await storageRef.getDownloadURL();
              console.log("Download URL:", downloadURL);

              db.collection("riders")
                .doc(documentId)
                .update({
                  profilePicture: downloadURL,
                })
                .then(() => {
                  console.log("Profile picture updated successfully");
                  navigation.goBack();
                })
                .catch((error) => {
                  console.error("Error updating profile picture: ", error);
                });
            } catch (error) {
              console.error("Error uploading image: ", error);
            }
            */
          } else {
            navigation.goBack();
          }
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  return (
    <SafeAreaView style={tw`py-10 px-5`}>
      <View style={tw`flex-row items-center justify-center`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute left-0`}
        >
          <Icon type="font-awesome" name="chevron-left" color="#1f2937" />
        </TouchableOpacity>
        <Text style={tw`font-bold text-lg text-gray-900 ml-2`}>
          Edit Profile
        </Text>
      </View>
      <View>
        {person ? (
          <>
            <TouchableOpacity onPress={handleImageSelect}>
              <View style={[tw`items-center mt-4`]}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={[
                      tw`w-24 h-24 mb-4`,
                      {
                        borderRadius: 100,
                      },
                    ]}
                  />
                ) : (
                  <Image
                    source={{ uri: person.profilePicture }}
                    style={[
                      tw`w-24 h-24 mb-4`,
                      {
                        borderRadius: 100,
                      },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <View style={tw`text-center`}>
            <ActivityIndicator size="large" color="#030813" />
          </View>
        )}
        {person ? (
          <Text style={tw`text-lg text-gray-600 mt-4`}>
            Name: {person.documentId}
          </Text>
        ) : null}
        <TextInput
          style={tw`border border-gray-300 mt-2 p-2 rounded-sm`}
          value={userName}
          onChangeText={setName}
        />
      </View>

      {person ? (
        <TouchableOpacity
          style={[
            tw`mt-5 py-3 px-6 rounded-sm items-center`,
            styles.customColor,
          ]}
          onPress={() => updateProfile(person.documentId)}
          disabled={!userName || !person.documentId}
        >
          <Text style={tw`text-gray-900 font-bold text-lg`}>
            Update Profile
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={tw`text-center`}>
          <ActivityIndicator size="large" color="#030813" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  customColor: {
    backgroundColor: "#F5B800",
  },
});
