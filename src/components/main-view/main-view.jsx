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
									{/* --- Filter Controls --- */}
									<Col>
										<Card>
											<Card.Header>
												<h5 className="mb-0">Filter & Sort Movies</h5>
											</Card.Header>
											<Card.Body>
												<Row>
													<Col md={6} lg={3} className="mb-3">
														<Form.Group>
															<Form.Label>Search</Form.Label>
															<Form.Control
																type="text"
																placeholder="Enter movie title"
																value={searchTerm}
																onChange={(e) => setSearchTerm(e.target.value)}
																className="custom-form-control"
															/>
														</Form.Group>
													</Col>

													{/* --- Genre Filter --- */}
													<Col md={6} lg={2} className="mb-3">
														<Form.Group>
															<Form.Label>Genre</Form.Label>
															<Form.Select
																value={selectedGenre}
																onChange={(e) => setSelectedGenre(e.target.value)}
																className="custom-form-control"
															>
																<option value="">All Genres</option>
																{uniqueGenres.map((genre) => (
																	<option key={genre} value={genre}>
																		{genre}
																	</option>
																))}
															</Form.Select>
														</Form.Group>
													</Col>

													{/* --- Director Filter --- */}
													<Col md={6} lg={2} className="mb-3">
														<Form.Group>
															<Form.Label>Director</Form.Label>
															<Form.Select
																value={selectedDirector}
																onChange={(e) => setSelectedDirector(e.target.value)}
																className="custom-form-control"
															>
																<option value="">All Directors</option>
																{uniqueDirectors.map((director) => (
																	<option key={director}  value={director}>
																		{director}
																	</option>
																))}
															</Form.Select>
														</Form.Group>
													</Col>

													{/* --- Year Filter --- */}
													<Col md={6} lg={2} className="mb-3">
														<Form.Group>
															<Form.Label>Release Year</Form.Label>
															<Form.Select
																value={selectedYear}
																onChange={(e) => setSelectedYear(e.target.value)}
																className="custom-form-control"
															>
																<option value="">All Years</option>
																{uniqueYears.map((year) => (
																	<option key={year} value={year}>
																		{year}
																	</option>
																))}
															</Form.Select>
														</Form.Group>
													</Col>

													{/* --- Sort Options --- */}
													<Col md={6} lg={2} className="mb-3">
														<Form.Group>
															<Form.Label>Sort By</Form.Label>
															<Form.Select
																value={sortBy}
																onChange={(e) => setSortBy(e.target.value)}
																className="custom-form-control"
															>
																<option value="title">Title (A-Z)</option>
																<option value="year">Release Year</option>
																<option value="director">Director (A-Z)</option>
															</Form.Select>
														</Form.Group>
													</Col>

													<Col md={6} lg={2} className="mb-3 d-flex align-items-end">
														<Button
															variant="outline-secondary"
															onClick={clearFilters}
															className="w-100"
														>
															Clear
														</Button>
													</Col>
												</Row>

												<Row>
													<Col>
														<small className="text-muted">
															Showing {filteredAndSortedMovies.length} of {movies.length} movies
															{(searchTerm || selectedGenre || selectedDirector || selectedYear ) && (
																<span className="ms-2">
																	(filtered)
																</span>
															)}
														</small>
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</Col>
									{filteredAndSortedMovies.length === 0 ? (
										<Col xs={12} className="text-center">
											<p>No movies match your current filters. Try adjusting your search criteria.</p>
										</Col>
									) : (
										filteredAndSortedMovies.map((movie) => (
											<Col className="mb-4" key={movie.id} xs={6} sm={4} md={3} lg={2}>
												<MovieCard 
													movie={movie}
													user={user}
													token={token}
													onFavoriteUpdate={handleUserUpdate}
												/>
											</Col>
										))
									)}
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