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

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#add8e6',
		},
		secondary: {
			main: '#212121',
		},
		background: {
			default: '#ffffff',
			paper: '#f5f5f5',
		},
		text: {
			primary: '#212121',
		},
	},
	typography: {
		fontFamily: 'Comic Sans MS, sans-serif',
	},
});

const HeaderComponent = () => {
	return (
		<ThemeProvider theme={lightTheme}>
			<AppBar position="static" sx={{ bgcolor: lightTheme.palette.primary.main }}>
				<Toolbar>
					<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<Box sx={{ flexGrow: 1 }}>
							<LinkButton to="/">
								<Button sx={{ color: lightTheme.palette.secondary.main }}>Home</Button>
							</LinkButton>
						</Box>
						<Typography variant="h4" sx={{ color: lightTheme.palette.secondary.main, textAlign: 'center', flexGrow: 1 }}>
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
