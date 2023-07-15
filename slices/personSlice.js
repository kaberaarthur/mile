import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  person: {
    dateRegistered: null,
    email: null,
    name: null,
    language: null,
    phone: null,
    authID: null,
    otpDate: null,
    otpCode: null,
    password: null,
    signedIn: false,
  },
};

export const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPerson: (state, action) => {
      state.person = action.payload;
    },
  },
});

export const { setPerson } = personSlice.actions;

// Selectors => To pull data
export const selectPerson = (state) => state.person.person;

export default personSlice.reducer;
