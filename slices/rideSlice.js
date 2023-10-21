import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ride: {},
};

export const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setRide: (state, action) => {
      state.ride = action.payload;
    },
  },
});

export const { setRide } = rideSlice.actions;

// Selectors => To pull data
export const selectRide = (state) => state.ride.ride;

export default rideSlice.reducer;
