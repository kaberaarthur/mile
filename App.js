import { StatusBar } from "expo-status-bar";
import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";

import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ConfirmCodeScreen from "./screens/ConfirmCodeScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import MapScreen from "./screens/MapScreen";
import EatScreen from "./screens/EatScreen";
import WaitDriverScreen from "./screens/WaitDriverScreen";

import ActivityScreen from "./screens/ActivityScreen";
import RideDetailsScreen from "./screens/RideDetailsScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";
import OneRideIssueScreen from "./screens/OneRideIssueScreen";

import ProfileScreen from "./screens/ProfileScreen";
import WalletScreen from "./screens/WalletScreen";
import PartnershipsScreen from "./screens/PartnershipsScreen";

import DeleteAccountScreen from "./screens/DeleteAccountScreen";
import EnterWorkLocationScreen from "./screens/EnterWorkLocationScreen";
import EnterHomeLocationScreen from "./screens/EnterHomeLocationScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MapDirectionScreen from "./screens/MapDirectionScreen";

import TestScreen from "./screens/TestScreen";

// 1) Setup Redux - Complete

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
            <Stack.Navigator>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ConfirmCodeScreen"
                component={ConfirmCodeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UpdateProfileScreen"
                component={UpdateProfileScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="EatScreen"
                component={EatScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="WaitDriverScreen"
                component={WaitDriverScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ActivityScreen"
                component={ActivityScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="RideDetailsScreen"
                component={RideDetailsScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ReportIssueScreen"
                component={ReportIssueScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OneRideIssueScreen"
                component={OneRideIssueScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="WalletScreen"
                component={WalletScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="PartnershipsScreen"
                component={PartnershipsScreen}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="DeleteAccountScreen"
                component={DeleteAccountScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="EnterHomeLocationScreen"
                component={EnterHomeLocationScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="EnterWorkLocationScreen"
                component={EnterWorkLocationScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="EditProfileScreen"
                component={EditProfileScreen}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="MapDirectionScreen"
                component={MapDirectionScreen}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="TestScreen"
                component={TestScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
