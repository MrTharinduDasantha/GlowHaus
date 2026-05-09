// Redux Toolkit store — six feature slices.
// Auth state survives a page reload because it's re-fetched via authApi.getMe()
// on app mount, so we don't need redux-persist.

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import serviceReducer from "./features/serviceSlice.js";
import stylistReducer from "./features/stylistSlice.js";
import bagReducer from "./features/bagSlice.js";
import bookingReducer from "./features/bookingSlice.js";
import favoriteReducer from "./features/favoriteSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    stylists: stylistReducer,
    bag: bagReducer,
    booking: bookingReducer,
    favorites: favoriteReducer,
  },
  // Allow non-serializable values like Date objects in booking state
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});
