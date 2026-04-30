import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosInstance";

const getErrorMessage = (error, fallback) => {
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach backend server. Please check API URL and that backend is running.";
  }
  return error?.message || fallback;
};

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch profile"));
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Logout failed"));
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
