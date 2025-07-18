import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

//   similarMovies.map((movie) => {
//                 return (
//                   <Col key={movie.id} xs={5} sm={5} md={4} lg={3}>
//                     <MovieCard movie={movie} onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)} />
//                   </Col>

  return (
    <BrowserRouter>
		<NavigationBar user={user} onLoggedOut={() => {
			setUser(null);
			setToken(null);
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			}} />
      	<Row className="justify-content-md-center">
			<Routes>
				<Route
					path="/signup"
					element={
						<>
							{user ? (
								<Navigate to="/" />
							) : (
								<Col md={5}>
									<SignupView />
								</Col>
							)}
						</>
					}
				/>
				<Route
					path="/login"
					element={
						<>
							{user ? (
								<Navigate to="/" />
							) : (
								<Col md={5}>
									<LoginView onLoggedIn={(user, token) => {
										setUser(user);
										setToken(token); 
									}} />
								</Col>
							)}
						</>
					}
				/>
				<Route
					path="/movies/:movieId"
					element={
						<>
							{!user ? (
								<Navigate to="/login" replace />
							) : movies.length === 0 ? (
								<Col>The list is empty!</Col>
							) : (
								<MovieView movies={movies} />
							)}
						</>
					}
				/>
				<Route
					path="/"
					element={
						<>
							{!user ? (
								<Navigate to="/login" replace />
							) : movies.length === 0 ? (
								<Col>The list is empty!</Col>
							) : (
								<>
									{movies.map((movie) => (
										<Col className="mb-4" key={movie.id} xs={6} sm={4} md={3} lg={2}>
											<MovieCard movie={movie} />
										</Col>
									))}
								</>
							)}
						</>
					}
				/>
			</Routes>
    	</Row>
	</BrowserRouter>
  );
};