// Auth state — current user, loading flags, error message.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/auth.api.js";

/* ───────── Thunks ───────── */

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage || "Not authenticated");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (creds, { rejectWithValue }) => {
    try {
      const res = await authApi.login(creds);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await authApi.register(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.userMessage || "Registration failed");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
  return null;
});

/* ───────── Slice ───────── */

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // start in loading so the splash hangs until /me resolves
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Locally bump the user object after profile edits without re-fetching
    updateUserLocal: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      /* fetchMe */
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      /* login */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* register */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* logout */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateUserLocal } = authSlice.actions;
export default authSlice.reducer;
