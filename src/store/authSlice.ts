import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/api';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: 'superadmin' | 'teamlead' | 'hr' | 'user';
  designation?: string;
  name?: string;
  full_name?: string;
  department?: string;
}

interface AuthState {
  user: UserInfo | null;
  userToken: string | null;
  userRefreshToken: string | null;
  isAuthenticatedUser: boolean;
  loadingUser: boolean;
  errorUser: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,
  userToken: localStorage.getItem('token_user') || null,
  userRefreshToken: localStorage.getItem('refreshToken_user') || null,
  isAuthenticatedUser: !!localStorage.getItem('token_user'),
  loadingUser: false,
  errorUser: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password?: string; mockRoles?: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.loginUser(credentials);
      if (response.success) {
        const { access, refresh, profile: user } = response.data;
        if (user) {
          localStorage.setItem('userInfo', JSON.stringify(user));
        }
        localStorage.setItem('token_user', access.token);
        localStorage.setItem('refreshToken_user', refresh.token);
        return { user, token: access.token, refreshToken: refresh.token };
      } else {
        return rejectWithValue(response.message || 'Failed to log in');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue('Failed to log in');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.userRefreshToken;
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await authApi.refreshToken();

      if (response.success) {
        const { access, refresh } = response.data;
        localStorage.setItem('token_user', access.token);
        localStorage.setItem('refreshToken_user', refresh.token);
        dispatch(setUserCredentials({ userToken: access.token, userRefreshToken: refresh.token }));
        return { token: access.token, refreshToken: refresh.token };
      } else {
        return rejectWithValue(response.message || 'Failed to refresh token');
      }
    } catch (error: any) {
      console.error('Refresh token error:', error);
      return rejectWithValue('Failed to refresh token');
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
  async (_, { dispatch, getState }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.userToken;
    const refreshToken = state.auth.userRefreshToken;

    if (!token || !isTokenValid(token)) {
      if (refreshToken) {
        await dispatch(refreshAccessToken());
        const newState = getState() as { auth: AuthState };
        return !!newState.auth.userToken;
      }
      dispatch(logoutUser());
      return false;
    }
    return true;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.userToken = action.payload.userToken || null;
      state.userRefreshToken = action.payload.userRefreshToken || null;
      state.isAuthenticatedUser = !!action.payload.userToken;
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
      .addCase(loginUser.pending, (state) => {
        state.loadingUser = true;
        state.errorUser = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.user = action.payload.user as UserInfo;
        state.userToken = action.payload.token;
        state.userRefreshToken = action.payload.refreshToken;
        state.isAuthenticatedUser = true;
        state.errorUser = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingUser = false;
        state.errorUser = action.payload as string;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loadingUser = true;
        state.errorUser = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.userToken = action.payload.token;
        state.userRefreshToken = action.payload.refreshToken;
        state.isAuthenticatedUser = true;
        state.errorUser = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loadingUser = false;
        state.errorUser = action.payload as string;
        state.user = null;
        state.userToken = null;
        state.userRefreshToken = null;
        state.isAuthenticatedUser = false;
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token_user');
        localStorage.removeItem('refreshToken_user');
      });
  },
});

export const { setUserCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;