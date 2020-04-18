//----------------------------------------------IMPORTS :
import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
//contexts:
import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import UserProfileContext from "../contexts/UserProfileContext"
//API:
import AuthAPI from "../services/authAPI";
import userAPI from "../services/userAPI";
//components:
import LoginModal from "./LoginModal";
//images:
import LogoDark from "../../images/logos/ZicoS-inverted.png";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const Navbar = ({ history }) => {
  //----------------------------------------------CONTEXTS :
  //On utilise le hook useContext pour récupérer les infos de connexion passées via le contexte AuthContext
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { userId, setUserId } = useContext(UserContext);

  //----------------------------------------------STATE :

  // state pour le profil du user authentifié
  const [userProfile, setUserProfile] = useState("");

  //----------------------------------------------FUNCTIONS :

  const fetchUserProfile = async userId => {
    try {
      const data = await userAPI.findOne(userId);
        setUserProfile(data.profile.id);
    } catch (error) {
      console.log(error.response);
    }
  };


  // fonction pour gérer la déconnexion
  const handleLogout = () => {
    // au clic sur le bouton, on fait appel à AuthAPI pour se déconnecter avec la méthode logout
    AuthAPI.logout();
    // on précise à l'application qu'on est déconnecté
      setIsAuthenticated(false);
      setUserId("");
      setUserProfile("")
    toast.info(" Vous êtes déconnecté. À bientôt sur ZicoS !");
    // on se redirige vers la page d'accueil avec history
    history.push("/");
  };

  //----------------------------------------------EFFECTS :
  // effet qui se déclenche si l'utilisateur est authentifié et qui se nettoie au démontage
  if (isAuthenticated) {
    useEffect(() => {
      fetchUserProfile(userId);
      return () => {
      }
    }, []);
  }

  //----------------------------------------------RETURN :

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-primary">
      
      <NavLink to="/" className="navbar-brand">
          <img className="logo" src={LogoDark} alt="" />
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

        <ul className="navbar-nav m-auto">

            {isAuthenticated && 
            <li className="nav-item mx-5 my-auto">
              <NavLink className="btn btn-outline-black my-1" to="/profils" > Profils </NavLink>
            </li>
            }

            {!isAuthenticated && 
              <>
                <li className="nav-item mx-5 my-auto">
                  <NavLink to="/register" className="nav-link mx-1 my-1"> Inscription </NavLink>
                </li>
                <li className="nav-item mx-5 my-auto">
                  <LoginModal libBtn="Connexion" variant="outline-primary" />
                </li>
              </>
            }

            {isAuthenticated && 
            <>
              <li className="nav-item dropdown mx-5 my-auto">
                <a className="nav-link dropdown-toggle text-primary" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Mon Compte
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <NavLink to={"/users/" + userId} className="dropdown-item" href="#" > Mes infos </NavLink>
                  {userProfile && (<NavLink to={"/profils/" + userProfile} className="dropdown-item" > Voir mon profil </NavLink> )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item text-danger" > Déconnexion </button>
                </div>
              </li>
            </>
            }
            
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
