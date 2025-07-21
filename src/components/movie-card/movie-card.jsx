import PropTypes from 'prop-types';
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./movie-card.scss";

export const MovieCard = ({ movie, user, token, onFavoriteUpdate }) => {
	const [ isFavorite, setIsFavorite ] = useState(
		user && user.Favorites ? user.Favorites.includes(movie.id) : false
	);

	const handleFavoriteClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const method = isFavorite ? 'DELETE' : 'POST';

		const url = isFavorite 
			? `https://myflix-ah-72292705dfa8.herokuapp.com/users/${user.Email}/${encodeURIComponent(movie.title)}` 
			
			: `https://myflix-ah-72292705dfa8.herokuapp.com/users/${user.Username}/movies/${movie.title}`
		;

		fetch(url, {
			method: method,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error. Status: ${response.status}`);
				}
				return response.json();
			})
			.then((updatedUser) => {
				setIsFavorite(!isFavorite);
				if (onFavoriteUpdate) {
					onFavoriteUpdate(updatedUser);
				}
			})
			.catch((error) => {
				console.error("Error updating favorite:", error);
			});
	};


	return (
		<Card className="h-100 movie-card">
			<Link to={`/movies/${encodeURIComponent(movie.id)}`} className="text-decoration-none">
				<Card.Img variant="top" src={movie.image} className="w-100" style={{ height: '250px', objectFit: 'fill' }}/>
				<Card.Body>
					<Card.Title>{movie.title}</Card.Title>
				</Card.Body>
			</Link>

			<Button
				variant={isFavorite ? "danger" : "outline-danger"}
          		size="sm"
          		className="position-absolute"
          		style={{ top: '10px', right: '10px', borderRadius: '50%', width: '40px', height: '40px' }}
          		onClick={handleFavoriteClick}
			>
          		{isFavorite ? "♥" : "♡"}
			</Button>
		</Card>
	);
	};

MovieCard.propTypes = {
	movie: PropTypes.shape({
		title: PropTypes.string.isRequired,
		id: PropTypes.string.isRequied, 
		image: PropTypes.string.isRequired
	}).isRequired,
	user: PropTypes.shape({
		Email: PropTypes.string.isRequired,
		Username: PropTypes.string.isRequired,
		Favorites: PropTypes.array
	}).isRequired,
	token: PropTypes.string.isRequired,
	onFavoriteUpdate: PropTypes.func.isRequired
};
