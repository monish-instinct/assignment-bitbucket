import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axios";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/login", creds);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }
    return data.token as string;
  } catch (err: any) {
    return rejectWithValue(err.friendlyMessage || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") localStorage.removeItem("token");
    },
    hydrateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Login failed";
      });
  },
});

export const { logout, hydrateToken } = authSlice.actions;
export default authSlice.reducer;
