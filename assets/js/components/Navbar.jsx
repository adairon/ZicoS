import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../images/logos/Logo-ZicoS-1.png";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";

const Navbar = ({ history }) => {

  //On utilise le hook useContext pour récupérer les infos de connexion passées via le contexte AuthContext
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const {userId} = useContext(UserContext)


  // fonction pour gérer la déconnexion
  const handleLogout = () => {
    // au clic sur le bouton, on fait appel à AuthAPI pour se déconnecter avec la méthode logout
    AuthAPI.logout();
    // on précise à l'application qu'on est déconnecté
    setIsAuthenticated(false);
    // on se redirige vers la page d'accueil avec history
    history.push("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
   
      <NavLink to="/" className="navbar-brand">
        <figure className="">
          <img className="logo" src={Logo} alt="" />
        </figure>
      </NavLink>
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
        {isAuthenticated && 
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                className="btn btn-outline-secondary btnProfiles my-1"
                to="/profils"
              >
                Profils
              </NavLink>
            </li>
          </ul>
        
        }
        <ul className="navbar-nav mal-auto">
          {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link mx-1 my-1">
                  Inscription
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="btn btn-outline-success mx-1 my-1">
                  Connexion
                </NavLink>
              </li>
            </>
          )) || (
            <>
              <li className="nav-item">
                <NavLink to={"/users/" + userId} className="btn btn-outline-primary mx-1 my-1">
                  Voir mon profil
                </NavLink>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-danger mx-1 my-1">
                  Déconnexion
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
