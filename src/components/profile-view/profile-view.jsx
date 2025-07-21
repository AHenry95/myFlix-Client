import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col , Card, Button, Modal, Alert, Form } from "react-bootstrap";
import { PropTypes } from "prop-types";

export const ProfileView = ({ token, movies, onUserUpdate, MovieCard, onLogout }) => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [ userProfile, setUserProfile ] = useState(null);
    const [ favoriteMovies, setFavoriteMovies ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const [ formData, setFormData ] = useState({
        Name: "",
        Username: "",
        Email: "",
        Birthdate: "",
        Password: ""
    });

    useEffect(() => {
        if (!token) {
            return;
        }

        fetch('https://myflix-ah-72292705dfa8.herokuapp.com/users', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if(!response.ok) {
                    throw new Error(`Http error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const foundUser = data.find(u => u.Username === username);

                // Checks if the user could not be found/
                if(!foundUser){
                    setError("User not found")
                    return
                }

                //Sets the userProfile state to the found user
                setUserProfile(foundUser);

                setFormData({
                    Name: foundUser.Name,
                    Username: foundUser.Username,
                    Email: foundUser.Email,
                    Birthdate: foundUser.Birthdate || "",
                    Password: ""
                });
               
                if (foundUser.Favorites) {
                    const favMovies = movies.filter(m => foundUser.Favorites.includes(m.id));
                    setFavoriteMovies(favMovies);
                }


            })
            .catch((error) => {
                console.error("Error fetching user profile", error);
                setError(`Failed to load profile: ${error.message}`);
            });
    }, [token, username, movies]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();

        const updateData = {
            Name: formData.Name,
            Username: formData.Username,
            Email: formData.Email,
            Birthdate: formData.Birthdate
        };

        if (formData.Password) {
            updateData.Password = formData.Password;
        }

        fetch(`https://myflix-ah-72292705dfa8.herokuapp.com/users/${userProfile.Username}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        })
            .then((response) => response.json())
            .then((updatedUser) => {
                setUserProfile(updatedUser);
                setShowEditModal(false);

                if(onUserUpdate) {
                    onUserUpdate(updatedUser)
                }

                if(updatedUser.Username !== username) {
                    navigate( `/users/${updatedUser.Username}`, { replace: true });
                }

            })
            .catch((error) => {
                console.error("Error updating profile", error);
                setError("Failed to update profile. Please try again.");
            });
    };

    const handleDeregister = () => {
        fetch(`https://myflix-ah-72292705dfa8.herokuapp.com/users/${userProfile.Username}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! Status:', ${response.status}`);
            }

            alert('Account deleted successfully');
           
            if(onLogout) {
                onLogout();
            }

            navigate('/login');
        })
        .catch((error) => {
            console.error("Error deleting account:", error);
            setError("Failed to delete account. Please try again.");
            setShowDeleteModal(false);
        });
    };

    return(
        <Container className="mt-4">
            {!userProfile ? ( 
                <p>Loading Profile...</p>
            ) : (
                <>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <Card>
                                <Card.Header>
                                    <h2>{userProfile.Username}</h2>
                                </Card.Header>
                                <Card.Body>
                                    
                                    <Row className="mb-3">
                                        <Col sm={3}>
                                            Username:
                                        </Col>
                                        <Col sm={9}>
                                            {userProfile.Username}
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col sm={3}>
                                            Name:
                                        </Col>
                                        <Col sm={9}>
                                            {userProfile.Name}
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col sm={3}>
                                            Email:
                                        </Col>
                                        <Col sm={9}>
                                            {userProfile.Email}
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col sm={3}>
                                            Birthdate:
                                        </Col>
                                        <Col sm={9}>
                                            {!userProfile.Birthdate ? (
                                                <span>Not available</span>
                                            ) : (
                                                userProfile.Birthdate
                                            )}
                                        </Col>
                                    </Row>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setShowEditModal(true)}
                                        className="me-1"
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        Delete Profile
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    {/* Favorite Movies Card */}
                    <Row className="mt-4 justify-content-center" >
                        <Col className="w-100">
                            <Card >
                                <Card.Header>
                                    <h3>{userProfile.Username}'s Favorite Movies</h3>
                                </Card.Header>
                                <Card.Body>
                                    {favoriteMovies.length === 0 ? (
                                        <div>You have no favorite movies! Go add some!</div>
                                    ) : (
                                        <Row>
                                            {favoriteMovies.map((movie) => (
                                                <Col key={movie.id} xs={6} sm={4} md={3} lg={2} className="mb-3">
                                                    <MovieCard 
                                                        movie={movie}
                                                        user={userProfile}
                                                        token={token}
                                                        onFavoriteUpdate={(updatedUser) => {
                                                            setUserProfile(updatedUser);
                                                        
                                                            if(updatedUser.Favorites) {
                                                                const favMovies = movies.filter(m => updatedUser.Favorites.includes(m.id));
                                                                setFavoriteMovies(favMovies);
                                                            } else {
                                                                setFavoriteMovies([]);
                                                            }

                                                            if(onUserUpdate) {
                                                                onUserUpdate(updatedUser);
                                                            }
                                                        }}       
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>             
                        </Col>
                    </Row>

                    {/*Modal for editing user details*/}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton className="bg-white">
                            <Modal.Title>Edit Profile</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleUpdateProfile}>
                            <Modal.Body className="bg-white">
                                
                                {/* Change user's name */}
                                <Form.Group>
                                    <Form.Label>Name: </Form.Label>
                                    <Form.Control
                                        name="Name" 
                                        type="text"
                                        value={formData.Name}
                                        onChange={handleInputChange}
                                        className="custom-form-control"
                                    />
                                </Form.Group>
                                
                                {/* Change User's Username*/}
                                <Form.Group className="mb-3">
                                    <Form.Label>Username: </Form.Label>
                                    <Form.Control
                                        name="Username" 
                                        type="text"
                                        value={formData.Username}
                                        onChange={handleInputChange}
                                        className="custom-form-control"
                                    />
                                </Form.Group>

                                {/* Change User's Email*/}
                                <Form.Group>
                                    <Form.Label>Email: </Form.Label>
                                    <Form.Control
                                        name="Email" 
                                        type="email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        className="custom-form-control"
                                    />
                                </Form.Group>

                                {/* Change user's birthdate */}
                                <Form.Group>
                                    <Form.Label>Birthdate: </Form.Label>
                                    <Form.Control
                                        name="Birthdate" 
                                        type="date"
                                        value={formData.Birthdate}
                                        onChange={handleInputChange}
                                        className="custom-form-control"
                                    />
                                </Form.Group>

                                {/* Change user's password */}
                                <Form.Group>
                                    <Form.Label>Password: </Form.Label>
                                    <Form.Control
                                        name="Password" 
                                        type="password"
                                        value={formData.Password}
                                        onChange={handleInputChange}
                                        className="custom-form-control"
                                    />
                                    <span className="text-muted small">(Leave Password field blank to keep current password)</span>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className="bg-white">
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton className="bg-white">
                            <Modal.Title>Delete Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-white">
                            <Alert variant="danger"><strong>Warning!</strong> This action cannot be undone. Are you sure you want to delete your account?</Alert>
                        </Modal.Body>
                        <Modal.Footer className="bg-white">
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeregister}>
                                Delete Account
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
};

ProfileView.propTypes ={
    token: PropTypes.string.isRequired,
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
    onUserUpdate: PropTypes.func.isRequired,
    MovieCard: PropTypes.elementType.isRequired,
    onLogout: PropTypes.func.isRequired,
}