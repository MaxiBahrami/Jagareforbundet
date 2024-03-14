import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import Logo from "../img/JaktHarryLogo.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar,NavDropdown, Container, Nav } from 'react-bootstrap';
import { AuthContext } from '../context/authContext';

function CustomNavbar() {

  const { currentUser, logout } = useContext(AuthContext);

  return (
    <Navbar collapseOnSelect expand="lg"  className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand>
          <Link to="/">
          <img src={Logo} alt="" className='imgClass'/>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto navClass" >
            <NavDropdown title="NYHETER" id="collapsible-nav-dropdown">
              <NavDropdown.Item>
                <Link to="/?cat=riks" className="nav-link itemClass">RIKS</Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/?cat=lans" className="nav-link itemClass">LÄNS</Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/?cat=lokalt" className="nav-link itemClass">LOKALT</Link>
              </NavDropdown.Item>
            </NavDropdown>
            <Link to="/?cat=aktiviteter" className="nav-link">AKTIVITETER</Link>
            <Link to="#" className="nav-link">{currentUser?.username}</Link>
            {currentUser ? (
              <Link className="nav-link" onClick={logout} to="/">LoggaUt</Link>
            ) : (
              <Link className="nav-link" to="/login">loggaIN</Link>
            ) }
            <Link to="/write" className="nav-link write">Skriva</Link>
            <Link ></Link>
          </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  );
};

export default CustomNavbar;
