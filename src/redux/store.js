// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './imageUploadSlice';

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
  },
});
