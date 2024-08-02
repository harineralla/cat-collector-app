import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './index';
import HeaderComponent from '../headerComponent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#ffcc80',
		},
		secondary: {
			main: '#90caf9',
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
		text: {
			primary: '#212121',
		},
	},
	typography: {
		fontFamily: 'Comic Sans MS, sans-serif',
	},
});

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={lightTheme}>
                <div className="app-container">
                    <HeaderComponent />
                    <Container component="main" sx={{ flexGrow: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', paddingTop: '40px' }}>
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
                        theme="light"
                    />
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
