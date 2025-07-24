import PropTypes from 'prop-types';
import { useParams, Link } from "react-router";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useState } from "react";
import "./movie-view.scss";

export const MovieView = ({ movies, user, token, onFavoriteUpdate, MovieCard }) => {
	const { movieId } = useParams();
	const movie = movies.find((m) => m.id === movieId);

	const [ isFavorite, setIsFavorite ] = useState(
		user && user.Favorites ? user.Favorites.includes(movie?.id) : false
	);

	const handleFavoriteClick = () => {
		const method = isFavorite ? 'DELETE' : 'POST';

		fetch(`https://myflix-ah-72292705dfa8.herokuapp.com/users/${user.Username}/movies/${movie.id}`, {
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
				console.error("Error updating favorites", error);
			})
	};
	
	const similarMovies = movies.filter(m => {
    	const movieIsSimilar = m.genre.Name === movie.genre.Name;
    	const notSelectedMovie = m.id !== movie.id;
    	return (notSelectedMovie && movieIsSimilar);
  });

  	return (
    <div>
      	<div>
        	<img src={movie.image} className="movie-poster"/>
		</div> 
		<Button
			variant={isFavorite ? "danger" : "outline-danger"}
          	size="sm"
          	onClick={handleFavoriteClick}
			className="mb-2"
		>
			{isFavorite ? "Added to Favorites" : "Add Favorite" }
		</Button>
		<div>
			<span>Title: </span>
			<span>{movie.title}</span>
		</div>
		<div>
			<span>Director: </span>
			<span>{movie.director.Name}</span>
		</div>
		<div>
			<span>Genre: </span>
			<span>{movie.genre.Name}</span>
		</div>
		<div>
			<span>Description: </span>
			<span>{movie.description}</span>
		</div>
		<div>
			<span>Actors: </span>
			<ul>
			{movie.actors.length === 0 ? (
				<li>This movie features no actors! How strange!</li>
			) : (
				movie.actors.map((actor) => <li key={actor._id}>{actor.name}</li>)
			)}
			</ul>
		</div>
		<div>
			<span>Release Year: </span>
			<span>{movie.releaseYear}</span>
		</div>
		<Link to="/">
			<Button variant="primary">Back</Button>
		</Link>

		<Row className="mt-4 justify-content-center" >
            <Col className="w-100">
                <Card >
                    <Card.Header>
                        <h3>Similar Movies</h3>
                    </Card.Header>
                    <Card.Body>
                        {similarMovies.length === 0 ? (
                            <div>We don't have any similar movies yet! Please check back soon.</div>
                        ) : (
                        <Row>
                            {similarMovies.map((similarMovie) => (
                                <Col key={similarMovie.id} xs={6} sm={4} md={3} lg={2} className="mb-3">
                                    <MovieCard 
										movie={similarMovie}
										user={user}
										token={token}
										onFavoriteUpdate={onFavoriteUpdate}      
									/>
                                </Col>
                            ))}
                        </Row>
                    )}
                    </Card.Body>
                </Card>             
            </Col>
        </Row>
	</div>
  )
}

MovieView.PropTypes = {
	movies: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		director: PropTypes.shape({
			name: PropTypes.string.isRequired,
			bio: PropTypes.string,
			BirthYear: PropTypes.string
    	}).isRequired, 
    	genre: PropTypes.shape({
      		name: PropTypes.string.isRequired,
      		description: PropTypes.string.isRequired
      	}).isRequired,
    	description: PropTypes.string.isRequired,
    	actors: PropTypes.arrayOf(PropTypes.shape({
      		name: PropTypes.string.isRequired,
      		birthYear: PropTypes.string
      	})),
    	releaseYear: PropTypes.string.isRequired
	})).isRequired,

	token: PropTypes.string.isRequired,
	onFavoriteUpdate: PropTypes.string.isRequired,
	MovieCard: PropTypes.elementType.isRequired
};
