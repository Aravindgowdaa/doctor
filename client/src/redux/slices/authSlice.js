import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosInstance";

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
