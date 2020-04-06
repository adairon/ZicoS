import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../images/logos/ZicoS.png";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import userAPI from "../services/userAPI";
import LoginModal from "./LoginModal";
import {toast} from "react-toastify"

const Navbar = ({ history }) => {

  //On utilise le hook useContext pour récupérer les infos de connexion passées via le contexte AuthContext
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const {userId, setUserId} = useContext(UserContext)

  // STATE
  const [userProfile, setUserProfile] = useState("")
  
  const fetchUser = async userId => {
    try {
      const data = await userAPI.findOne(userId);
      // console.log(data.profile.id);
      setUserProfile(data.profile.id);
    }catch(error) {
      console.log(error.response)
    }
  }
  
  
  // fonction pour gérer la déconnexion
  const handleLogout = () => {
    // au clic sur le bouton, on fait appel à AuthAPI pour se déconnecter avec la méthode logout
    AuthAPI.logout();
    // on précise à l'application qu'on est déconnecté
    setIsAuthenticated(false);
    setUserId("");
    toast.info(" Vous êtes déconnecté. À bientôt ! 😙");
    // on se redirige vers la page d'accueil avec history
    history.push("/");
  };
  if (isAuthenticated){
    useEffect(() => {
      fetchUser(userId)
    },[userProfile])
  }

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
            <li className="nav-item ml-5">
              <NavLink
                className="btn btn-outline-secondary btnProfiles my-1"
                to="/profils"
              >
                Profils
              </NavLink>
            </li>
          </ul>
        
        }
        <ul className="navbar-nav navbarDrop ml-auto align-items-center">
          {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link mx-1 my-1">
                  Inscription
                </NavLink>
              </li>
              <li className="nav-item">
                <LoginModal libBtn="Connexion" variant="outline-secondary"/>
              </li>
            </>
          )) || (
            <>
              <li className="nav-item btn-group" role="group" aria-label="Button group with nested dropdown">
                <button type="button" className="btn btn-primary">Mon Compte</button>
                <div className="btn-group" role="group">
                  <button id="btnGroupDrop1" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                    <NavLink to={"/users/" + userId} className="dropdown-item" href="#">
                      Mes infos
                    </NavLink>
                    {userProfile && 
                    <NavLink to={"/profils/" + userProfile} className="dropdown-item">
                      Mon profil
                    </NavLink>}
                    <button onClick={handleLogout} className="dropdown-item text-danger">
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
