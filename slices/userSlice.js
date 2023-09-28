// userSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  status: "idle", // Add a status field to track the async operation
  error: null, // Add an error field to store potential errors
};

// Define an asynchronous action using createAsyncThunk
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userData, thunkAPI) => {
    try {
      // Your asynchronous code here
      const dateRegistered = userData.dateRegistered.toDate();
      const otpDate = userData.otpDate.toDate();

      // Return the data to be stored in the state
      return {
        ...userData,
        dateRegistered,
        otpDate,
      };
    } catch (error) {
      // Handle any errors and reject the promise if needed
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading"; // Set status to loading while the async action is in progress
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set status to succeeded when the async action is complete
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed"; // Set status to failed if there's an error
        state.error = action.error.message; // Store the error message
      });
  },
});

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
