import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosInstance";

export const fetchDoctors = createAsyncThunk("doctors/fetchDoctors", async (params = {}, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/doctors/search", { params });
    return data.data.doctors;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch doctors");
  }
});

export const fetchBestDoctors = createAsyncThunk("doctors/fetchBestDoctors", async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/doctors/best");
    return data.data.doctors;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch best doctors");
  }
});

export const fetchDoctorDetail = createAsyncThunk("doctors/fetchDoctorDetail", async (doctorId, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`/doctors/${doctorId}`);
    return data.data.doctor;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch doctor detail");
  }
});

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    bestDoctors: [],
    selectedDoctor: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBestDoctors.fulfilled, (state, action) => {
        state.bestDoctors = action.payload;
      })
      .addCase(fetchDoctorDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default doctorSlice.reducer;
