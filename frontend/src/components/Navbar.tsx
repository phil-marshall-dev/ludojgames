import { Link } from "react-router-dom";
import { useLoaderData } from 'react-router-dom';
import { IAxiosErrorResponse, ISession } from '../models';
import { Container, Nav, Navbar as BNavbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutAction } from "../actions";

const Navbar: React.FC = () => {
  const session = useLoaderData() as ISession;
  const navigate = useNavigate();

  const handleLogout: React.MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    const response = await logoutAction()
    if (response.success) {
      navigate('.');
    } else {
      console.error(response.error);
    }
  };
  
  const Links: React.FC = () => {
    if (session.isAuthenticated) {
      return (
        <>
          <NavDropdown title={session.username} id="user-dropdown">
            <NavDropdown.Item as={Link} to={`/profile/${session.userId}`}>Profile</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
        </>
      );
    }

    return (
      <>
        <Nav.Link as={Link} to="/login">Log in</Nav.Link>
      </>
    );
  };

  return (
    <BNavbar expand="lg" bg="light" className="navbar-light">
      <Container>
        <Link to="/" className="navbar-brand">TicTacPro</Link>
        <BNavbar.Toggle aria-controls="navbarSupportedContent" />
        <BNavbar.Collapse id="navbarSupportedContent">
          {/* Small screens */}
          <Nav className="mx-auto d-lg-none text-center">
            <Links />
          </Nav>
          {/* Big screens */}
          <Nav className="ms-auto d-none d-lg-flex">
            <Links />
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};

export default Navbar;
