import  PropTypes from "prop-types";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router";

export const NavigationBar = ({ user, onLoggedOut }) => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    myFlix
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!user && (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/signup">
                                    Signup
                                </Nav.Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/">
                                    Home
                                </Nav.Link>
                                <Nav.Link as={Link} to={`/users/${user.Username}`}>
                                    View Profile ({user.Username})
                                </Nav.Link>
                                <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

NavigationBar.propTypes ={
    user: PropTypes.any.isRequired,
    onLoggedOut: PropTypes.func.isRequired
};