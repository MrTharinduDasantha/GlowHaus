// Service "bag" / cart — selected services before booking.
// Persists to localStorage so a refresh doesn't lose the user's selections.

import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "glowhaus_bag";

const loadBag = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveBag = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silent — quota exceeded etc shouldn't crash the app
  }
};

const initialState = {
  items: loadBag(), // [{ _id, name, price, duration, image }]
};

const bagSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    addToBag: (state, action) => {
      const service = action.payload;
      // Prevent duplicates
      if (!state.items.find((i) => i._id === service._id)) {
        state.items.push(service);
        saveBag(state.items);
      }
    },
    removeFromBag: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveBag(state.items);
    },
    clearBag: (state) => {
      state.items = [];
      saveBag(state.items);
    },
  },
});

/* ───── Selectors ───── */
export const selectBagItems = (state) => state.bag.items;
export const selectBagTotal = (state) =>
  state.bag.items.reduce((sum, i) => sum + i.price, 0);
export const selectBagDuration = (state) =>
  state.bag.items.reduce((sum, i) => sum + i.duration, 0);
export const selectBagCount = (state) => state.bag.items.length;

export const { addToBag, removeFromBag, clearBag } = bagSlice.actions;
export default bagSlice.reducer;
