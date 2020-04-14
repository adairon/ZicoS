//----------------------------------------------IMPORTS :

import React, { useContext, useState, useEffect } from "react";

import { NavLink } from "react-router-dom";

import { toast } from "react-toastify";

import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import UserProfileContext from "../contexts/UserProfileContext"

import AuthAPI from "../services/authAPI";
import userAPI from "../services/userAPI";

import LoginModal from "./LoginModal";

import Logo from "../../images/logos/ZicoS.png";
import LogoDark from "../../images/logos/ZicoS-inverted.png";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const Navbar = ({ history }) => {
  //----------------------------------------------CONTEXTS :

  //On utilise le hook useContext pour récupérer les infos de connexion passées via le contexte AuthContext
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { userId, setUserId } = useContext(UserContext);
  const {userProfileId, setUserProfileId} = useContext(UserProfileContext)

  //----------------------------------------------STATE :

  //state pour gérer les states en prenant en compte un nettoyage de l'effet
  const [mounted, setMounted] = useState();
  // state pour le profil du user authentifié
  const [userProfile, setUserProfile] = useState("");

  //----------------------------------------------FUNCTIONS :

  // const fetchUserProfile = async userId => {
  //   try {
  //     const data = await userAPI.findOne(userId);
  //     console.log(data.profile.id);
  //     // if(mounted){
  //       setUserProfile(data.profile.id);
  //     // }
  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // };


  // fonction pour gérer la déconnexion
  const handleLogout = () => {
    // au clic sur le bouton, on fait appel à AuthAPI pour se déconnecter avec la méthode logout
    AuthAPI.logout();
    // on précise à l'application qu'on est déconnecté
      setIsAuthenticated(false);
      setUserId("");
      setUserProfileId("")
    toast.info(" Vous êtes déconnecté. À bientôt sur ZicoS !");
    // on se redirige vers la page d'accueil avec history
    history.push("/");
  };

  //----------------------------------------------EFFECTS :
  // effet qui se déclenche si l'utilisateur est authentifié et qui se nettoie au démontage
  // if (isAuthenticated) {
  //   useEffect(() => {
  //     fetchUserProfile(userId);
  //     // setMounted(true)
  //     return () => {
  //       // setMounted(false)
  //     }
  //   }, []);
  // }

  //----------------------------------------------RETURN :

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-primary">
      
      <NavLink to="/" className="navbar-brand">
        <figure className="">
          <img className="logo" src={LogoDark} alt="" />
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
        
        {isAuthenticated && (
          <ul className="navbar-nav mr-auto">
            <li className="nav-item ml-5">
              <NavLink
                className="btn btn-outline-black my-1"
                to="/profils"
              >
                Profils
              </NavLink>
            </li>
          </ul>
        )}

        <ul className="navbar-nav navbarDrop ml-auto align-items-center">
          
          {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link mx-1 my-1">
                  Inscription
                </NavLink>
              </li>
              <li className="nav-item">
                <LoginModal libBtn="Connexion" variant="outline-primary" />
              </li>
            </>
          )) || (
            <>
              <li
                className="nav-item btn-group"
                role="group"
                aria-label="Button group with nested dropdown"
              >
                <button type="button" className="btn btn-primary">
                  Mon Compte
                </button>
                <div className="btn-group" role="group">
                  <button
                    id="btnGroupDrop1"
                    type="button"
                    className="btn btn-primary dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  ></button>
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="btnGroupDrop1"
                  >
                    <NavLink
                      to={"/users/" + userId}
                      className="dropdown-item"
                      href="#"
                    >
                      Mes infos
                    </NavLink>
                    {userProfileId && (
                      <NavLink
                        to={"/profils/" + userProfileId}
                        className="dropdown-item"
                      >
                        Voir mon profil
                      </NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </li>
            </>
          )}
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
