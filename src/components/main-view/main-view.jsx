import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [ user, setUser ] = useState(storedUser ? storedUser : null);
  const [ token, setToken ] = useState(storedToken ? storedToken : null);
  const [ movies, setMovies ] = useState([]);
  const [ error, setError ] = useState(null);
  const [ selectedMovie, setSelectedMovie ] = useState(null);

  useEffect(() => {
    if (!token) {
      return
    }

    fetch('https://myflix-ah-72292705dfa8.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
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
  }, [token]);

  if (!user) {
    return (
      <>
        <LoginView onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
        }} />
        <br />
        <SignupView />
      </>
    )
  }

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
      <button onClick={() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }}>
        Logout
      </button>
    </div>
  );
};