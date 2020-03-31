import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/Logo-ZicoS-1.png";

const Navbar = props => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        <figure className="">
          <img className="logo" src={Logo} alt=""/>
        </figure>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/profils/">
              Profils
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav mal-auto">
          <li className="nav-item">
            <a href="#" className="nav-link">
              Inscription
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="btn btn-success">
              Connexion
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="btn btn-danger">
              Déconnexion
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
