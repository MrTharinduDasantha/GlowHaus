// Stylist catalog + detail.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stylistApi } from "../../api/stylist.api.js";

export const fetchStylists = createAsyncThunk(
  "stylists/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await stylistApi.list(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

export const fetchStylistById = createAsyncThunk(
  "stylists/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await stylistApi.getById(id);
      return res.data.data; // { stylist, services }
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

const initialState = {
  list: [],
  current: null, // { stylist, services }
  loading: false,
  error: null,
};

const stylistSlice = createSlice({
  name: "stylists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStylists.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchStylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStylistById.pending, (state) => {
        state.loading = true;
        state.current = null;
      })
      .addCase(fetchStylistById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchStylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stylistSlice.reducer;
