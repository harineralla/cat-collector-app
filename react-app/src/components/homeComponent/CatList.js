import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Cat from './Cat';
import { toast } from 'react-toastify';

function CatList({ AddtoFavourite, trigger }) {
	const [cats, setCats] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [breedSearch, setBreedSearch] = useState('');
	const catsPerPage = 8;

	const fetchCats = (breed = '') => {
		setIsLoading(true);
		let url = `http://127.0.0.1:5000/cats?page=${currentPage}&per_page=${catsPerPage}`;
		if (breed) {
			url += `&breed=${breed}`;
		}
		fetch(url)
			.then(response => response.json())
			.then(data => {
				setCats(data);
				toast.success("Successfully fetched cat details.");
				setIsLoading(false);
			})
			.catch(() => {
				setIsLoading(false);
				toast.error("Failed to fetch cat details.");
			});
	};

	useEffect(() => {
		fetchCats(breedSearch);
	}, [currentPage, trigger]);

	const nextPage = () => setCurrentPage(currentPage + 1);
	const prevPage = () => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);

	const handleSearchChange = (e) => {
		setSearch(e.target.value);
	};

	const handleSearch = () => {
		setBreedSearch(search);
		setCurrentPage(1);
		fetchCats(search);
	};

	const AddCatToFavourite = (catDetails) => {
		AddtoFavourite(catDetails);
	};


	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<TextField
					label="Search cats by breed"
					value={search}
					onChange={handleSearchChange}
					fullWidth
					margin="normal"
				/>
				<IconButton onClick={handleSearch} style={{ marginLeft: '10px' }}>
					<SearchIcon />
				</IconButton>
			</div>
			<Grid container spacing={3}>
				{cats.map(cat => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={cat.api_id}>
						<Cat cat={cat} AddtoFavourite={AddCatToFavourite} />
					</Grid>
				))}
			</Grid>
			<div style={{ marginTop: '20px' }}>
				<Button onClick={prevPage} disabled={currentPage === 1} style={{ marginRight: '10px' }}>Previous</Button>
				<Button onClick={nextPage} disabled={cats.length < catsPerPage || cats.length === 0}>Next</Button>
			</div>
		</div>
	);
}

export default CatList;