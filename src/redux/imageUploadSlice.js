// redux/uploadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FILE_UPLOAD_URL } from '../constants/imageUpload';

// Thunk to handle the image upload
export const uploadProfileImage = createAsyncThunk(
  'upload/uploadProfileImage',
  async (file, { dispatch,rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // retrive jwt token from local storage
      const jwtToken = localStorage.getItem('jwtToken');

      // Send the file to your Express API endpoint (adjust URL as needed)
      const response = await axios.post(FILE_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwtToken}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          dispatch(setProgress(progress)); // Dispatch the progress value
          // return { progress };
        },
      });
      console.log(`api response`, response.data.uploadResult);
      
      return response.data.uploadResult; // Return Cloudinary URL or any relevant data
    } catch (error) {
      if(error.response && error.response.status === 401){
        alert(error.response.data.message);
      }
      else if(error.response && error.response.status === 403){
        alert(error.response.data.message);
      }
      return rejectWithValue(error.response.data.message);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    loading: false,
    success: false,
    error: null,
    uploadedImageUrl: '',
    progress: 0,
  },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload; // Set the progress value
    },
    resetSuccess:(state)=>{
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.progress = 0;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.uploadedImageUrl = action.payload.secure_url; // Handle Cloudinary URL
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setProgress,resetSuccess } = uploadSlice.actions; // Export the setProgress action
export default uploadSlice.reducer;
