import React, { useState, useEffect } from 'react';
import { Grid, Select, MenuItem, Typography } from '@mui/material';
import Cat from './Cat';
import { toast } from 'react-toastify';

function CollectedCats(props) {
	const [cats, setCats] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		fetch('http://127.0.0.1:5000/getFavouriteCats')
			.then(response => response.json())
			.then(data => {
				setCats(data)
				toast.success("Successfuly Fetched Favourite Cat details.")
			});
	}, [props]);

	const deleteCat = (catDetails) => {
		fetch(`http://127.0.0.1:5000/cats/${catDetails.id}`, { method: 'DELETE' })
			.then(() => setCats(cats.filter(cat => cat.id !== catDetails.id)));
	};

	const editCat = (catId, catDetails) => {
		fetch(`http://127.0.0.1:5000/cats/${catId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(catDetails),
		}).then(() => {
			setCats(cats.map(cat => (cat.id === catId ? { ...cat, ...catDetails } : cat)));
		});
	};

	const handleFilterChange = (e) => {
		setFilter(e.target.value);
	};

	const filteredCats = filter ? cats.filter(cat => cat.breed === filter) : cats;

	return (
		<div>
			<Typography variant="h2">Favourite Cats</Typography>
			<Typography>Total: {cats.length}</Typography>
			<Select value={filter} onChange={handleFilterChange} displayEmpty>
				<MenuItem value="">
					<em>All</em>
				</MenuItem>
				{Array.from(new Set(cats.map(cat => cat.breed))).map(breed => (
					<MenuItem key={breed} value={breed}>{breed}</MenuItem>
				))}
			</Select>
			<Grid container spacing={3}>
				{filteredCats.map(cat => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
						<Cat cat={cat} deleteCat={deleteCat} editCat={editCat} MarkAsUnfavourite={props.MarkAsUnfavourite} />
					</Grid>
				))}
			</Grid>
		</div>
	);
}

export default CollectedCats;
