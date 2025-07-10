import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [ movies, setMovies ] = useState([]);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    fetch('https://myflix-ah-72292705dfa8.herokuapp.com/movies')
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.Title,
            director: movie.Director,
            genre: movie.Genre,
            description: movie.Description,
            actors: movie.Actors,
            releaseYear: movie.ReleaseYear
          };
        });

        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error('Error fetching movies', error);
        setError('Failed to load movies. Please try again later');
      });
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (error) {
    return <div>{error}</div>;
  }

  if (selectedMovie) {
    let similarMovies = movies.filter(movie => {
      const movieIsSimilar = movie.genre.Name === selectedMovie.genre.Name;
      const notSelectedMovie = movie.id !== selectedMovie.id;
      return (notSelectedMovie && movieIsSimilar);
    });

    return (
    <>
      <MovieView 
        movie={selectedMovie} 
        onBackClick={() => setSelectedMovie(null)}
      />
      <hr />
      <h2>Similar Movies</h2>
      <ul>
        {similarMovies.length === 0 ? (
          <li>There are no similar movies in our catalog yet! Please chcek back soon.</li>
        ) : (
          similarMovies.map((movie) => {
            return (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  onMovieClick={(newSelectedMovie) => {
                    setSelectedMovie(newSelectedMovie);
                  }}
                />
              </li>
            )
          })
        )}
      </ul>
    </>
    )
  }

  if (movies.length === 0) {
    return <div>The list is empty</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};