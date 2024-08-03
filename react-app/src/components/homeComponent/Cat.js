import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper } from '@mui/material';
import './Cat.css';

const editModalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%', 
	maxHeight: '80vh', 
	overflowY: 'auto', 
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	display: 'flex',
	flexDirection: 'column',
	gap: '16px',
};

const detailsModalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '70%', 
	maxHeight: '80vh', 
	overflowY: 'auto',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	display: 'flex',
	flexDirection: 'column',
	gap: '16px',
};

function Cat({ cat, AddtoFavourite, deleteCat, editCat, MarkAsUnfavourite }) {
	const [isEditing, setIsEditing] = useState(false);
	const [isViewingDetails, setIsViewingDetails] = useState(false);
	const [catDetails, setCatDetails] = useState({ ...cat });

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		editCat(catDetails.id, catDetails);
		setIsEditing(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCatDetails(prevDetails => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleCloseEdit = () => {
		setIsEditing(false);
	};

	const handleViewDetails = () => {
		setIsViewingDetails(true);
	};

	const handleCloseDetails = () => {
		setIsViewingDetails(false);
	};

	const convertKeyToLabel = (key) => {
		return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
	};

	const detailsArray = Object.keys(cat).map(key => ({
		label: convertKeyToLabel(key),
		value: cat[key] !== undefined && cat[key] !== null ? cat[key].toString() : 'N/A'
	}));

	return (
		<div className="cat-card">
			<img src={cat.url} alt="cat" className="cat-image" />
			<div className="button-container">
				<button onClick={handleViewDetails} className="view-button">View Details</button>
				{AddtoFavourite && <button onClick={() => AddtoFavourite(cat)} className="collect-button">Add to Favourites</button>}
				{MarkAsUnfavourite && <button onClick={() => MarkAsUnfavourite(cat)} className="collect-button">Remove From Favourites</button>}
				{deleteCat && <button onClick={() => deleteCat(cat)} className="delete-button">Delete</button>}
				{editCat && <button onClick={handleEdit} className="edit-button">Edit</button>}
			</div>

			<Modal open={isEditing} onClose={handleCloseEdit}>
				<Box sx={editModalStyle}>
					<Typography variant="h6" component="h2">
						Edit Cat Details
					</Typography>
					<Box sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
						{Object.keys(catDetails).map((key) => (
							<TextField
								key={key}
								label={convertKeyToLabel(key)}
								value={catDetails[key] || ''}
								name={key}
								onChange={handleChange}
								fullWidth
								margin="normal"
								disabled={key === 'id'}
							/>
						))}
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
						<Button variant="contained" color="primary" onClick={handleSave}>
							Save Changes
						</Button>
						<Button variant="contained" color="secondary" onClick={handleCloseEdit}>
							Cancel Changes
						</Button>
					</Box>
				</Box>
			</Modal>

			<Modal open={isViewingDetails} onClose={handleCloseDetails}>
				<Box sx={detailsModalStyle}>
					<img src={cat.url} alt="cat" className="cat-image-pop-up" style={{ maxWidth: '100%' }} />
					<Typography variant="h6" component="h2">
						Cat Details
					</Typography>
					{detailsArray.map((detail, index) => (
						<Paper key={index} sx={{ padding: '16px', minHeight: '80px', maxHeight: '120px', overflowY: 'auto' }}>
							<Typography variant="subtitle1" component="h3">
								{detail.label}
							</Typography>
							<Typography variant="body2">
								{detail.value}
							</Typography>
						</Paper>
					))}
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
						<Button variant="contained" color="primary" onClick={handleCloseDetails}>
							Close
						</Button>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}

export default Cat;
