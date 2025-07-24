import { useState, useEffect, useMemo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [ user, setUser ] = useState(storedUser ? storedUser : null);
  const [ token, setToken ] = useState(storedToken ? storedToken : null);
  const [ movies, setMovies ] = useState([]);
  const [ error, setError ] = useState(null);
  const [ userList, setUserList ] = useState(null);

  // States for Filter 
  const [ searchTerm, setSearchTerm ] = useState("");
  const [ selectedGenre, setSelectedGenre ] = useState("");
  const [ selectedDirector, setSelectedDirector ] = useState("");
  const [ selectedYear, setSelectedYear] = useState("");
  const [ sortBy, setSortBy ] = useState("title"); 
  const [ showFilters, setShowFilters ] = useState(false);

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

	const handleUserUpdate = (updatedUser) => {
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	}

	const handleLogout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		setMovies([]);
	}

	const uniqueGenres = useMemo(() => {
		const genres = movies.map(movie => movie.genre.Name);
		return [...new Set(genres)].sort();
	}, [movies]); 

	const uniqueDirectors= useMemo(() => {
		const directors = movies.map(movie => movie.director.Name);
		return [...new Set(directors)].sort();
	}, [movies]);

	const uniqueYears = useMemo(() => {
		const years = movies.map(movie => movie.releaseYear);
		return [...new Set(years)].sort((a,b) => b - a);
	}, [movies]);

	const filteredAndSortedMovies = useMemo(() => {
		let filtered = movies.filter(movie => {
			const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesGenre = !selectedGenre || movie.genre.Name === selectedGenre;
			const matchesDirector = !selectedDirector || movie.director.Name === selectedDirector;
			const matchesYear = !selectedYear || movie.releaseYear === selectedYear;

			return matchesSearch && matchesGenre && matchesDirector && matchesYear;
		});

		filtered.sort((a, b) => {
			switch (sortBy) {
				case "title":
					return a.title.localeCompare(b.title);
				case "year":
					return b.releaseYear - a.releaseYear;
				case "director":
					return a.director.Name.localeCompare(b.director.Name);
				default:
					return 0;
			}
		});
		
		return filtered;
	}, [movies, searchTerm, selectedGenre, selectedDirector, selectedYear, sortBy]);

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedGenre("");
		setSelectedDirector("");
		setSelectedYear("");
		setSortBy("");
	};

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
				{/* --- MovieView ---*/}
				<Route
					path="/movies/:movieId"
					element={
						<>
							{!user ? (
								<Navigate to="/login" replace />
							) : movies.length === 0 ? (
								<Col>The list is empty!</Col>
							) : (
								<MovieView 
									movies={movies}
									user={user}
									token={token}
									onFavoriteUpdate={handleUserUpdate}
									MovieCard={MovieCard}
								/>
							)}
						</>
					}
				/>
				{/* --- Main View --- */}
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
									<Col xs={12} className="mb-4">
										<div className="bg-light border rounded-3 shadow-sm">
											{/* Filter Toggler */}
											<div className = "d-flex justify-content-between align-items-center p-3 border-bottom">
												<div className="d-flex align-items-center">
													<h6 className="mb-0 me-3">Filter & Sort</h6>
													<small className="text-muted">
														{filteredAndSortedMovies.length} of {movies.length} movies
														{(searchTerm || selectedGenre || selectedDirector || selectedYear || sortBy !== "title") && (
															<span className="badge bg-primary ms-2">Filtered</span>
														)}
													</small>
												</div>
												<Button
													variant="outline-secondary"
													size="sm"
													onClick={( setShowFilters(!showFilters))}
													className="d-flex align-items-center"
												>
													{showFilters ? (
														<span className="me-1">Hide</span>
													) : (
														<span className="me-1">Show</span>
													)}
												</Button>
											</div>

											{showFilters && (
												<div className="p-3">
													<Row className="align-items-end g-2"></Row>
												</div>
											)}
										</div>
									</Col>
								</>
							)}
						</>
					}
				/>
				<Route
					path="/users/:username"
					element={
						<>
							{!user ? (
								<Navigate to="/login" replace />
							) : (
								<Col>
									<ProfileView 
										token={token}
										movies={movies}
										onUserUpdate={handleUserUpdate}
										MovieCard={MovieCard}
										onLogout={handleLogout}
									/>
								</Col>
							)}
						</>
					}
				/>	
			</Routes>
    	</Row>
	</BrowserRouter>
  );
};