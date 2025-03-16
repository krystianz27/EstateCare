import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  role: "owner" | "tenant" | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ role: "owner" | "tenant" | null }>,
    ) => {
      if (action.payload && action.payload.role) {
        state.isAuthenticated = true;
        state.role = action.payload.role;
        console.log("Role authSlice:", state.role);
      } else {
        console.log("Error: role is undefined or missing");
        state.role = null;
      }
    },

    setLogout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { setAuth, setLogout } = authSlice.actions;
export default authSlice.reducer;
