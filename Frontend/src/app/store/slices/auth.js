import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

const User = { id: "", name: "", email: "" };
const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
const initial = { user: User, token: getInitialToken() };

export const loginThunk = createAsyncThunk("auth/login", async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  localStorage.setItem("token", data.token);
  // Persist user id for components that need quick access
  if (data?.user?.id) localStorage.setItem("userId", data.user.id);
  return data;
});

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    logout(s) {
      s.user = null;
      s.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
    });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
