import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  status: "idle",
  error: null,
};

// Define an asynchronous action using createAsyncThunk
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userData, thunkAPI) => {
    try {
      // Your asynchronous code here

      // Return the data to be stored in the state
      return userData;
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
