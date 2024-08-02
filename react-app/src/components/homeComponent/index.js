import React, { useState } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CatList from './CatList';
import CollectedCats from './CollectedCats';

const HomePage = () => {
	const [trigger, setTrigger] = useState(true);

	const AddtoFavourite = async (cat) => {
		let res = await fetch(`http://127.0.0.1:5000/cats/${cat.id}/favorite`, {
			method: 'POST', // Specify the method as POST
			headers: {
				'Content-Type': 'application/json' // Specify the content type as JSON
			},
			body: {} // Convert the newCat object to a JSON string
		})
		toast.success("Successfully added cat to favourites")
		setTrigger(!trigger)
	}

	const MarkAsUnfavourite = async (cat) => {
		let res = await fetch(`http://127.0.0.1:5000/cats/${cat.id}/unfavorite`, {
			method: 'POST', // Specify the method as POST
			headers: {
				'Content-Type': 'application/json' // Specify the content type as JSON
			},
			body: {} // Convert the newCat object to a JSON string
		})
		toast.success("Successfully remove cat from favourites")
		setTrigger(!trigger)
	}


	return (
		<Container>
			<Typography variant="h3" gutterBottom>Cat Collector APP</Typography>
			<CatList AddtoFavourite={AddtoFavourite} trigger={trigger} />
			{/* <Typography variant="h1" gutterBottom>SEPARATIO</Typography> */}
			<CollectedCats cats={trigger} MarkAsUnfavourite={MarkAsUnfavourite} />
		</Container>
	);
};

export default HomePage;
