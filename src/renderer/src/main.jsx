
// import './assets/main.css'

import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Dashboard from './Extras/dashboard/Dashboard';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  {/* <ThemeProvider theme={theme}> */}
      
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    {/* <CssBaseline /> */}
    <App />
     

    {/* <Dashboard /> */}
  {/* </ThemeProvider> */}
  ,
</React.StrictMode>,
)
