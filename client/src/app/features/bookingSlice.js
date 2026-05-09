// In-flight booking selections — stylist, date, time slot, promo.
// Cleared automatically on successful checkout.

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStylist: null, // { _id, name, profilePhoto, ... }
  selectedDate: null, // ISO string "YYYY-MM-DD"
  selectedTime: null, // "HH:mm"
  promo: null, // { code, discount, newTotal } from validate response
  step: 1, // booking flow step (1: bag, 2: stylist+date, 3: summary)
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStylist: (state, action) => {
      state.selectedStylist = action.payload;
      // Stylist change invalidates the previously chosen slot
      state.selectedTime = null;
    },
    setDate: (state, action) => {
      state.selectedDate = action.payload;
      state.selectedTime = null;
    },
    setTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    setPromo: (state, action) => {
      state.promo = action.payload;
    },
    clearPromo: (state) => {
      state.promo = null;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setStylist,
  setDate,
  setTime,
  setPromo,
  clearPromo,
  setStep,
  resetBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
