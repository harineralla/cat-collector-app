import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './index';
import HeaderComponent from '../headerComponent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#121212', // Dark background
        },
        secondary: {
            main: '#ff4081', // Pink
        },
        background: {
            default: '#121212', // Dark background
            paper: '#1c1c1c', // Slightly lighter dark
        },
        text: {
            primary: '#ffffff', // White text
            secondary: '#b0bec5', // Light grey text
        },
    },
    typography: {
        fontFamily: 'Comic Sans MS, sans-serif',
    },
});

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={darkTheme}>
                <div className="app-container">
                    <HeaderComponent />
                    <Container
                        component="main"
                        sx={{
                            flexGrow: 1,
                            background: 'rgba(18, 18, 18, 0.7)', // Transparent dark background
                            backdropFilter: 'blur(20px)', // Stronger blur
                            borderRadius: '8px',
                            paddingTop: '20px',
                            marginTop: '20px',
                            boxShadow: '0 16px 18px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    >
                        <CssBaseline />
                        <Routes>
                            <Route path="/" exact element={<HomePage />} />
                        </Routes>
                    </Container>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark" // Match the theme to dark
                    />
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
