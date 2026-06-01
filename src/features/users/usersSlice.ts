import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/api/axios";
import type { User, UserFormValues, ViewMode } from "@/types/user";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  searchTerm: string;
  currentPage: number;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  viewMode: "list",
  searchTerm: "",
  currentPage: 1,
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [p1, p2] = await Promise.all([
        api.get("/users?page=1"),
        api.get("/users?page=2"),
      ]);
      return [...p1.data.data, ...p2.data.data] as User[];
    } catch (err: any) {
      return rejectWithValue(err.friendlyMessage || "Failed to load users");
    }
  },
);

export const createUser = createAsyncThunk<User, UserFormValues, { rejectValue: string }>(
  "users/create",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users", values);
      return {
        id: Number(data.id) || Date.now(),
        ...values,
      };
    } catch (err: any) {
      return rejectWithValue(err.friendlyMessage || "Failed to create user");
    }
  },
);

export const updateUser = createAsyncThunk<
  User,
  { id: number; values: UserFormValues },
  { rejectValue: string }
>("users/update", async ({ id, values }, { rejectWithValue }) => {
  try {
    await api.put(`/users/${id}`, values);
    return { id, ...values };
  } catch (err: any) {
    return rejectWithValue(err.friendlyMessage || "Failed to update user");
  }
});

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.friendlyMessage || "Failed to delete user");
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    toggleView(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to load users";
      })
      .addCase(createUser.fulfilled, (s, a) => {
        s.users.unshift(a.payload);
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        const i = s.users.findIndex((u) => u.id === a.payload.id);
        if (i !== -1) s.users[i] = a.payload;
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter((u) => u.id !== a.payload);
      });
  },
});

export const { toggleView, setSearch, setPage } = usersSlice.actions;
export default usersSlice.reducer;
