import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosInstance";

export const fetchPatientAppointments = createAsyncThunk("appointments/fetchPatient", async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/appointments/patient");
    return data.data.appointments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
  }
});

export const fetchDoctorAppointments = createAsyncThunk("appointments/fetchDoctor", async (params = {}, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/appointments/doctor", { params });
    return data.data.appointments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
  }
});

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
