import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BrowserRouter, Routes, Route, Navigation } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [ user, setUser ] = useState(storedUser ? storedUser : null);
  const [ token, setToken ] = useState(storedToken ? storedToken : null);
  const [ movies, setMovies ] = useState([]);
  const [ error, setError ] = useState(null);

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
            releaseYear: movie.ReleaseYear,
            image: movie.Image
          };
        });

        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error('Error fetching movies', error);
        setError('Failed to load movies. Please try again later');
      });
  }, [token]);

  // const similarMovies = selectedMovie ? movies.filter(movie => {
  //   const movieIsSimilar = movie.genre.Name === selectedMovie.genre.Name;
  //   const notSelectedMovie = movie.id !== selectedMovie.id;
  //   return (notSelectedMovie && movieIsSimilar);
  // }) : [];

  return (
    <Row className="justify-content-md-center">
      {!user ? (
        <Col md={5}>
          <LoginView onLoggedIn={(user, token) => {
            setUser(user);
            setToken(token);
          }} />
          <br />
          <SignupView />
        </Col>
      ) : error ? ( 
        <div>{error}</div>
      ) : selectedMovie ? (
        <Col md={8}>
          <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
          <hr />
          <h2>Similar Movies</h2>
          <div>
            {similarMovies.length === 0 ? (
              <div>There are no similar movies in our catalog yet! Please come back soon.</div>
            ) : (
              similarMovies.map((movie) => {
                return (
                  <Col key={movie.id} xs={5} sm={5} md={4} lg={3}>
                    <MovieCard movie={movie} onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)} />
                  </Col>
                )
              })
            )} 
          </div>  
        </Col>
      ) : movies.length === 0 ? (
        <div>The list is empty!</div>
      ) : (
        <>
          {movies.map((movie) => (
            <Col className="mb-5" key={movie.id}  xs={6} sm={4} md={3} lg={2}>
              <MovieCard
                movie={movie} 
                onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)} 
              />
            </Col>
          ))}
          <div className="text-center">
            <Button className="w-auto" onClick={() => {
              setUser(null);
              setToken(null);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }}>
              Logout
            </Button>
          </div>
        </>
      )}
    </Row>
  );
};