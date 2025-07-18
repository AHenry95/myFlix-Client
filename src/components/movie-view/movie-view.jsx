import PropTypes from 'prop-types';
import Button from "react-bootstrap/Button";
import "./movie-view.scss";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <img src={movie.image} className="movie-poster"/>
      </div> 
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

      <Button variant="primary" onClick={onBackClick}>Back</Button>
    </div>
  )
}

MovieView.PropTypes = {
  movie: PropTypes.shape({
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
  }).isRequired,
  onBackClick: PropTypes.func.isRequired
};