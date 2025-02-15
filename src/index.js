import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { JWT_TOKEN } from './constants/imageUpload';

const jwtTOKEN = JWT_TOKEN; 
localStorage.setItem('jwtToken',jwtTOKEN);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
