import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Cat.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const editModalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	maxHeight: '80vh',
	overflowY: 'auto',
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: '10px',
	p: 4,
	display: 'flex',
	flexDirection: 'row',
	gap: '16px',
};

const detailsModalStyle = {
	position: 'relative',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	maxHeight: '80vh',
	overflowY: 'auto',
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: '10px',
	p: 4,
	display: 'flex',
	flexDirection: 'row',
	gap: '16px',
};

function Cat({ cat, AddtoFavourite, deleteCat, editCat, MarkAsUnfavourite }) {
	const [isEditing, setIsEditing] = useState(false);
	const [isViewingDetails, setIsViewingDetails] = useState(false);
	const [catDetails, setCatDetails] = useState({ ...cat });
	const [isFavourite, setIsFavourite] = useState(false);

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

	const handleFavouriteToggle = () => {
		setIsFavourite(!isFavourite);
		AddtoFavourite(cat);
	};

	const detailsArray = Object.keys(cat)
		.filter(key => !key.toLowerCase().includes('url'))
		.map(key => ({
			label: convertKeyToLabel(key),
			value: cat[key] !== undefined && cat[key] !== null ? cat[key].toString() : 'N/A'
		}));

	useEffect(() => {
		AOS.init({ duration: 1000 });
	}, []);

	return (
		<div className="cat-card" data-aos="fade-up">
			<img src={cat.url} alt="cat" className="cat-image" data-aos="zoom-in" />
			<div className="button-container">
				<button onClick={handleViewDetails} className="view-button">
					<VisibilityIcon />
				</button>
				{AddtoFavourite && (
					<button
						onClick={handleFavouriteToggle}
						className={`collect-button ${isFavourite ? 'filled' : ''}`}
					>
						{isFavourite ? <StarIcon /> : <StarBorderIcon />} 
					</button>
				)}
				{MarkAsUnfavourite && (
					<button onClick={() => MarkAsUnfavourite(cat)} className="collect-button">
						<FavoriteIcon /> Remove From Favourites
					</button>
				)}
				{deleteCat && (
					<button onClick={() => deleteCat(cat)} className="delete-button">
						<DeleteIcon /> Delete
					</button>
				)}
				{editCat && (
					<button onClick={handleEdit} className="edit-button">
						<EditIcon /> Edit
					</button>
				)}
			</div>

			<Modal open={isEditing} onClose={handleCloseEdit} data-aos="fade-in">
				<Box sx={editModalStyle}>
					<Box sx={{ flex: 1 }}>
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
					<Box sx={{ flex: 1, textAlign: 'center' }}>
						<img src={cat.url} alt="cat" className="cat-image-pop-up" style={{ maxWidth: '60%', borderRadius: '10px' }} />
						<Typography variant="body1" component="p" sx={{ mt: 2 }}>
							{cat.description}
						</Typography>
					</Box>
				</Box>
			</Modal>

			<Modal open={isViewingDetails} onClose={handleCloseDetails} data-aos="fade-in">
				<Box sx={detailsModalStyle}>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h6" component="h2">
							Cat Details
						</Typography>
						{detailsArray.map((detail, index) => (
							detail.label !== 'Description' && (
								<Paper key={index} sx={{ padding: '16px', minHeight: '80px', maxHeight: '120px', overflowY: 'auto', mb: 2 }}>
									<Typography variant="subtitle1" component="h3">
										{detail.label}
									</Typography>
									<Typography variant="body2">
										{detail.value}
									</Typography>
								</Paper>
							)
						))}
					</Box>
					<Box sx={{ position: 'absolute', top: 16, right: 18 }}>
						<Button variant="contained" color="secondary" onClick={handleCloseDetails}>
							X
						</Button>
					</Box>
					<Box sx={{ flex: 1, textAlign: 'center' }}>
						<img src={cat.url} alt="cat" className="cat-image-pop-up" style={{ maxWidth: '80%', borderRadius: '10px' }} />
						<Typography variant="body1" component="p" sx={{ mt: 2 }}>
							{cat.description}
						</Typography>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}

export default Cat;
