import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cat from './Cat';

function CollectedCats() {
	const [cats, setCats] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		axios.get('http://localhost:5000/cats')
			.then(response => setCats(response.data))
			.catch(error => console.error('Error fetching data: ', error));
	}, []);

	const deleteCat = (catId) => {
		axios.delete(`http://localhost:5000/cats/${catId}`)
			.then(() => setCats(cats.filter(cat => cat.id !== catId)))
			.catch(error => console.error('Error deleting cat: ', error));
	};

	const editCat = (catId, newUrl) => {
		axios.put(`http://localhost:5000/cats/${catId}`, { url: newUrl })
			.then(() => {
				setCats(cats.map(cat => (cat.id === catId ? { ...cat, url: newUrl } : cat)));
			})
			.catch(error => console.error('Error updating cat: ', error));
	};

	const handleFilterChange = (e) => {
		setFilter(e.target.value);
	};

	const filteredCats = filter ? cats.filter(cat => cat.breed === filter) : cats;

	return (
		<div>
			<h2>Collected Cats</h2>
			<p>Total: {cats.length}</p>
			<select value={filter} onChange={handleFilterChange}>
				<option value="">All</option>
				{/* Add an option for each unique breed */}
				{Array.from(new Set(cats.map(cat => cat.breed))).map(breed => (
					<option key={breed} value={breed}>{breed}</option>
				))}
			</select>
			{filteredCats.map(cat => (
				<Cat key={cat.id} cat={cat} deleteCat={deleteCat} editCat={editCat} />
			))}
		</div>
	);
}

export default CollectedCats;
