import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Admin {
  id: number;
  full_name: string;
  email: string;
}

interface UserInfo {
  username: string;
  email: string;
  password?: string;
}

interface AuthState {
  admin: Admin | null;
  adminToken: string | null;
  adminRefreshToken: string | null;
  isAuthenticatedAdmin: boolean;
  loadingAdmin: boolean;
  errorAdmin: string | null;
  user: UserInfo | null;
  userToken: string | null;
  userRefreshToken: string | null;
  isAuthenticatedUser: boolean;
  loadingUser: boolean;
  errorUser: string | null;
}

const initialState: AuthState = {
  admin: localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo')!)
    : null,
  adminToken: localStorage.getItem('token') || null,
  adminRefreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticatedAdmin: !!localStorage.getItem('token'),
  loadingAdmin: false,
  errorAdmin: null,
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,
  userToken: localStorage.getItem('token_user') || null,
  userRefreshToken: localStorage.getItem('refreshToken_user') || null,
  isAuthenticatedUser: !!localStorage.getItem('token_user'),
  loadingUser: false,
  errorUser: null,
};

export const loginSuperAdmin = createAsyncThunk(
  'auth/loginSuperAdmin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/auth/super-admin/login`;
      const response = await axios.post(endpoint, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.data.success) {
        const { access, refresh, admin } = response.data.data;
        localStorage.setItem('adminInfo', JSON.stringify(admin));
        localStorage.setItem('token', access.token);
        localStorage.setItem('refreshToken', refresh.token);
        return { admin, token: access.token, refreshToken: refresh.token };
      } else {
        return rejectWithValue(response.data.message || 'Failed to log in');
      }
    } catch (error: any) {
      console.error('Login error:', error.response ? error.response.data : error);
      return rejectWithValue(error.response?.data?.message || 'Failed to log in');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        const { access, refresh, profile: user } = response.data.data;
        localStorage.setItem('userInfo', JSON.stringify(user));
        localStorage.setItem('token_user', access.token);
        localStorage.setItem('refreshToken_user', refresh.token);
        return { user, token: access.token, refreshToken: refresh.token };
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

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async ({ isAdmin }: { isAdmin: boolean }, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = isAdmin ? state.auth.adminRefreshToken : state.auth.userRefreshToken;
      const email = isAdmin ? state.auth.admin.email : state.auth.user.email;
      const password = isAdmin ? state.auth.admin.password : state.auth.user.password;

      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const endpoint = isAdmin
        ? 'https://api.allinall.social/api/otz-hrm/auth/super-admin/login'
        : 'https://api.allinall.social/api/otz-hrm/auth/login';

      const response = await axios.post(
        endpoint,
        { email, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        const { access, refresh } = response.data.data;
        if (isAdmin) {
          localStorage.setItem('token', access.token);
          localStorage.setItem('refreshToken', refresh.token); 
          dispatch(setAdminCredentials({ adminToken: access.token, adminRefreshToken: refresh.token }));
        } else {
          localStorage.setItem('token_user', access.token);
          localStorage.setItem('refreshToken_user', refresh.token); 
          dispatch(setUserCredentials({ userToken: access.token, userRefreshToken: refresh.token }));
        }
        return { token: access.token, refreshToken: refresh.token };
      } else {
        return rejectWithValue(response.data.message || 'Failed to refresh token');
      }
    } catch (error: any) {
      console.error('Refresh token error:', error.response ? error.response.data : error);
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
    }
  }
);

interface DecodedToken {
  exp: number;
  iat: number;
  type: string;
}

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const validateAuthState = createAsyncThunk(
  'auth/validateAuthState',
  async ({ isAdmin }: { isAdmin: boolean }, { dispatch, getState }) => {
    const state = getState() as { auth: AuthState };
    const token = isAdmin ? state.auth.adminToken : state.auth.userToken;
    const refreshToken = isAdmin ? state.auth.adminRefreshToken : state.auth.userRefreshToken;

    if (!token || !isTokenValid(token)) {
      if (refreshToken) {
        await dispatch(refreshAccessToken({ isAdmin }));
        const newState = getState() as { auth: AuthState };
        const newToken = isAdmin ? newState.auth.adminToken : newState.auth.userToken;
        return !!newToken;
      }
      dispatch(isAdmin ? logoutAdmin() : logoutUser());
      return false;
    }
    return true;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      state.admin = action.payload.admin || null;
      state.adminToken = action.payload.adminToken || null;
      state.adminRefreshToken = action.payload.adminRefreshToken || null;
      state.isAuthenticatedAdmin = !!action.payload.adminToken;
    },
    setUserCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.userToken = action.payload.userToken || null;
      state.userRefreshToken = action.payload.userRefreshToken || null;
      state.isAuthenticatedUser = !!action.payload.userToken;
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.adminRefreshToken = null;
      state.isAuthenticatedAdmin = false;
      state.loadingAdmin = false;
      state.errorAdmin = null;
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    logoutUser: (state) => {
      state.user = null;
      state.userToken = null;
      state.userRefreshToken = null;
      state.isAuthenticatedUser = false;
      state.loadingUser = false;
      state.errorUser = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token_user');
      localStorage.removeItem('refreshToken_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loadingAdmin = true;
        state.errorAdmin = null;
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loadingAdmin = false;
        state.admin = action.payload.admin;
        state.adminToken = action.payload.token;
        state.adminRefreshToken = action.payload.refreshToken;
        state.isAuthenticatedAdmin = true;
        state.errorAdmin = null;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loadingAdmin = false;
        state.errorAdmin = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loadingUser = true;
        state.errorUser = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
        state.userRefreshToken = action.payload.refreshToken;
        state.isAuthenticatedUser = true;
        state.errorUser = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingUser = false;
        state.errorUser = action.payload as string;
      })
      .addCase(refreshAccessToken.pending, (state, action) => {
        const isAdmin = action.meta.arg.isAdmin;
        if (isAdmin) {
          state.loadingAdmin = true;
          state.errorAdmin = null;
        } else {
          state.loadingUser = true;
          state.errorUser = null;
        }
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const isAdmin = action.meta.arg.isAdmin;
        if (isAdmin) {
          state.loadingAdmin = false;
          state.adminToken = action.payload.token;
          state.adminRefreshToken = action.payload.refreshToken;
          state.isAuthenticatedAdmin = true;
          state.errorAdmin = null;
        } else {
          state.loadingUser = false;
          state.userToken = action.payload.token;
          state.userRefreshToken = action.payload.refreshToken;
          state.isAuthenticatedUser = true;
          state.errorUser = null;
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        const isAdmin = action.meta.arg.isAdmin;
        if (isAdmin) {
          state.loadingAdmin = false;
          state.errorAdmin = action.payload as string;
          state.admin = null;
          state.adminToken = null;
          state.adminRefreshToken = null;
          state.isAuthenticatedAdmin = false;
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        } else {
          state.loadingUser = false;
          state.errorUser = action.payload as string;
          state.user = null;
          state.userToken = null;
          state.userRefreshToken = null;
          state.isAuthenticatedUser = false;
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token_user');
          localStorage.removeItem('refreshToken_user');
        }
      });
  },
});

export const { setAdminCredentials, setUserCredentials, logoutAdmin, logoutUser } = authSlice.actions;
export default authSlice.reducer;