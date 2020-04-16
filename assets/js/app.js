/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";

import Favicon from 'react-favicon';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "./contexts/AuthContext";
import UserContext from "./contexts/UserContext";
import LogedInModalContext from "./contexts/LogedInModalContext";
import UserProfileContext from "./contexts/UserProfileContext";

import AuthAPI from "./services/authAPI";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage";
import ProfilesPage from "./pages/ProfilesPages";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import EditMusicienPage from "./pages/EditMusicienPage";
import EditGroupPage from "./pages/EditGroupPage";
import RegisterPage from "./pages/RegisterPage";

import "../css/bootstrap.css"
import "../css/app.css";
import AboutZicos from "./pages/AboutZicos";
// import "../css/App.scss"



// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log("Salut ami ZicoS ! Alors, on joue de la console ;-) ?");
// fonction pour charger le token
AuthAPI.setup();

const App = () => {
  // state pour gérer le statut de connexion dans l'app en vérifiant avec AuthAPI
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );
  // state pour gérer l'identifiant de l'utilisateur authentifié
  const [userId, setUserId] = useState(AuthAPI.userId());
  // state pour le contexte loged in modal :
  const [logedInModal, setLogedInModal] = useState(false);
  //state pour le contexte userProfile :
  const [userProfileId, setUserProfileId] = useState();

  // on créé un nouveau composant depuis la Navbar pour pouvoir lui passer en props history avec withRouter
  const NavBarWithRouter = withRouter(Navbar);

  return (
    <>
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      <UserContext.Provider
        value={{
          userId,
          setUserId
        }}
      >
        <LogedInModalContext.Provider
          value={{
            logedInModal,
            setLogedInModal
          }}
        >
          <UserProfileContext.Provider
            value={{
              userProfileId,
              setUserProfileId
            }}
          >
            <HashRouter>
              <NavBarWithRouter />
              <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <PrivateRoute path="/profils/:id" component={ProfilePage} />
                <PrivateRoute path="/profils" component={ProfilesPage} />
                <PrivateRoute path="/users/profile/musicien/:id" component={EditMusicienPage}/>
                <PrivateRoute path="/users/profile/band/:id" component={EditGroupPage}/>
                <PrivateRoute path="/users/profile/new" component={CreateProfilePage}/>
                <PrivateRoute path="/users/:id" component={UserPage} />
                <Route path="/about" component={AboutZicos} />
                <Route path="/" component={HomePage} />
              </Switch>
              <Footer />
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
          </UserProfileContext.Provider>
        </LogedInModalContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
    </>
  );
};

// On récupère la div avec l'id "app" qu'on a créé dans le block body de index.html.twig :
const rootElement = document.querySelector("#app");
// On demande à ReactDOM de faire le rendu de notre constante App dans la div #app :
ReactDOM.render(<App />, rootElement);
