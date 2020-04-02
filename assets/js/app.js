/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import "../css/app.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProfilesPage from "./pages/ProfilesPages";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import UserContext from "./contexts/UserContext";
import userProfilePage from "./pages/UserProfilePage";

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

  const [userId, setUserId] = useState(AuthAPI.userId());

  // on créé un nouveau composant depuis la Navbar pour pouvoir lui passer en props history avec withRouter
  const NavBarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
    }}>
      <UserContext.Provider value={{
        userId,
        setUserId
      }}>
        <HashRouter>
          <NavBarWithRouter />
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/profils/:id" component={ProfilePage} />
            <PrivateRoute path="/profils" component={ProfilesPage} />
            <PrivateRoute path="/users/:id" component={userProfilePage}/>
            <Route path="/" component={HomePage} />
          </Switch>
          <Footer />
        </HashRouter>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

// On récupère la div avec l'id "app" qu'on a créé dans le block body de index.html.twig :
const rootElement = document.querySelector("#app");
// On demande à ReactDOM de faire le rendu de notre constante App dans la div #app :
ReactDOM.render(<App />, rootElement);
