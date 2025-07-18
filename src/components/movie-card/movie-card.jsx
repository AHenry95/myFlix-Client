import PropTypes from 'prop-types';
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./movie-card.scss";

export const MovieCard = ({ movie }) => {
	return (
		<Link to={`/movies/${encodeURIComponent(movie.id)}`}>
			<Card className="h-100 movie-card">
				<Card.Img variant="top" src={movie.image} className="w-100" style={{ height: '250px', objectFit: 'fill' }}/>
				<Card.Body>
					<Card.Title>{movie.title}</Card.Title>
				</Card.Body>
			</Card>
		</Link>
	);
	};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired
};