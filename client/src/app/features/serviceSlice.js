// Service catalog state — list, filters, featured, currently-viewed detail.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serviceApi } from "../../api/service.api.js";

export const fetchServices = createAsyncThunk(
  "services/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await serviceApi.list(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

export const fetchFeaturedServices = createAsyncThunk(
  "services/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const res = await serviceApi.getFeatured();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

export const fetchServiceById = createAsyncThunk(
  "services/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await serviceApi.getById(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage);
    }
  },
);

const initialState = {
  list: [],
  total: 0,
  pages: 1,
  featured: [],
  current: null, // currently-viewed service detail
  filters: {
    search: "",
    category: "",
    sort: "newest",
    page: 1,
  },
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { search: "", category: "", sort: "newest", page: 1 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.list = action.payload.services;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.loading = false;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedServices.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.current = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, setPage, clearFilters } = serviceSlice.actions;
export default serviceSlice.reducer;
