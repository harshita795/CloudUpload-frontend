// components/ProfileImageUpload.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetSuccess, uploadProfileImage } from '../redux/imageUploadSlice';
import '../styles/loader.css';

const ProfileImageUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading, success, uploadedImageUrl, progress } = useSelector(
    (state) => state.upload
  );

  const validateFile = (file) => {
    const validFormats = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/tiff',
      'image/bmp',
      'image/svg',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validFormats.includes(file?.type)) {
      return 'Unsupported format. Only jpeg, png, gif, webp, tiff, bmp, svg are allowed.';
    }

    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit.';
    }

    return '';
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setError('');
      return;
    }
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      dispatch(resetSuccess());
    } else {
      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      dispatch(uploadProfileImage(file));
    }
  };

  return (
    <div className="container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? <div className="spinner"></div> : 'Upload'}
      </button>
      {success && <img src={uploadedImageUrl} alt="Profile" width="150" />}
    </div>
  );
};

export default ProfileImageUpload;
