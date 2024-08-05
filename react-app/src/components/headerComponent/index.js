import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const LinkButton = styled(Link)({
	textDecoration: 'none',
	color: 'inherit',
});

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


const HeaderComponent = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<AppBar 
                position="static" 
                sx={{ 
                    background: 'rgba(18, 18, 18, 0.7)', // Transparent dark background
                    backdropFilter: 'blur(10px)', // Blur effect
                    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)' // Subtle border
                }}
            >
				<Toolbar>
					<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<Box sx={{ flexGrow: 1 }}>
							<LinkButton to="/">
								<Button sx={{ color: darkTheme.palette.secondary.main }}>Home</Button>
							</LinkButton>
						</Box>
						<Typography 
                            variant="h4" 
                            sx={{ 
                                color: darkTheme.palette.text.primary, 
                                textAlign: 'center', 
                                flexGrow: 1 
                            }}
                        >
							Cat Collector Application
						</Typography>
						<Box sx={{ flexGrow: 1 }} />
					</Box>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
};

export default HeaderComponent;
