import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ride: {
    rideId: null,
    riderName: null,
    riderId: null,
    driverId: null,
    driverName: null,
    vehicleId: null,
    vehicleLicensePlate: null,
    rideStatus: null,
    origin: null,
    destination: null,
    startTime: null,
    endTime: null,
    travelInfo: null,
    fareWithoutDiscount: null,
    discountApplied: null,
    discountAmount: null,
    totalFareAfterDiscount: null,
    paymentMethod: null,
    driverRating: null,
    userRating: null,
    rideComments: null,
    rideRating: null,
  },
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
