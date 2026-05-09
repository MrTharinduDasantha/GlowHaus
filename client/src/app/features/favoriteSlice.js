// Customer's favourite services.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { favoriteApi } from "../../api/favorite.api.js";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await favoriteApi.list();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

export const addFavorite = createAsyncThunk(
  "favorites/add",
  async (serviceId, { rejectWithValue }) => {
    try {
      const res = await favoriteApi.add(serviceId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

export const removeFavorite = createAsyncThunk(
  "favorites/remove",
  async (serviceId, { rejectWithValue }) => {
    try {
      await favoriteApi.remove(serviceId);
      return serviceId;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

const initialState = {
  list: [], // [{ _id, service: {...} }]
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        // Append only if not already present (idempotent on the server)
        if (!state.list.find((f) => f._id === action.payload._id)) {
          state.list.push(action.payload);
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (f) => String(f.service?._id || f.service) !== String(action.payload),
        );
      });
  },
});

/* Quick helper selector — used by FavoriteButton */
export const selectIsFavorited = (serviceId) => (state) =>
  state.favorites.list.some(
    (f) => String(f.service?._id || f.service) === String(serviceId),
  );

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
