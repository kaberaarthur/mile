import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/navSlice";
import userReducer from "./slices/userSlice";
import rideReducer from "./slices/rideSlice";
import personReducer from "./slices/personSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    user: userReducer,
    ride: rideReducer,
    person: personReducer,
  },
});
