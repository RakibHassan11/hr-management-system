// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Admin {
  id: number;
  full_name: string;
  email: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  admin: localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo')!)
    : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const loginSuperAdmin = createAsyncThunk(
  'auth/loginSuperAdmin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Construct the endpoint URL using the base URL from the .env file
      const endpoint = `${import.meta.env.VITE_API_URL}/auth/super-admin/login`;
      const response = await axios.post(endpoint, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.data.success) {
        const { access, admin } = response.data.data;
        // Persist admin info and token to localStorage
        localStorage.setItem('adminInfo', JSON.stringify(admin));
        localStorage.setItem('token', access.token);
        return { admin, token: access.token };
      } else {
        return rejectWithValue(response.data.message || 'Failed to log in');
      }
    } catch (error: any) {
      console.error('Login error:', error.response ? error.response.data : error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to log in'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Export setCredentials to allow manually setting the credentials if needed
    setCredentials: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
