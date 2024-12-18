import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: null,
  email: null,
  full_name: null,
  is_verified: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user_id, email, full_name, is_verified } = action.payload;
      state.user_id = user_id;
      state.email = email;
      state.full_name = full_name;
      state.is_verified = is_verified;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user_id = null;
      state.email = null;
      state.full_name = null;
      state.is_verified = false;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;