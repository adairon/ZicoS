//----------------------------------------------IMPORTS :
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";

import ScrollUpButton from "react-scroll-up-button";
//notif toast:
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//contexts:
import AuthContext from "./contexts/AuthContext";
import UserContext from "./contexts/UserContext";
import LogedInModalContext from "./contexts/LogedInModalContext";
import UserProfileContext from "./contexts/UserProfileContext";
// API:
import AuthAPI from "./services/authAPI";
//components:
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
//pages:
import HomePage from "./pages/HomePage";
import ProfilesPage from "./pages/ProfilesPages";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import MessagesInbox from "./pages/MessagesInbox";
import CreateProfilePage from "./pages/CreateProfilePage";
import EditMusicienPage from "./pages/EditMusicienPage";
import EditGroupPage from "./pages/EditGroupPage";
import RegisterPage from "./pages/RegisterPage";
import AboutZicos from "./pages/AboutZicos";
import cguPage from "./pages/cguPage";
import MentionsLegales from "./pages/MentionsLegales";
import Contact from "./pages/Contact";
// css:
import "../css/bootstrap.min.css"
import "../css/app.css";


console.log("Salut ami ZicoS ! Alors, on joue de la console ;-) ?");
// fonction pour charger le token:
AuthAPI.setup();

//----------------------------------------------FUNCTIONNAL COMPONENT :

const App = () => {
  //----------------------------------------------STATES :
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

  //----------------------------------------------RETURN :
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
            <ScrollToTop/>
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
                <PrivateRoute path="/inbox" component={MessagesInbox} />
                <Route path="/about" component={AboutZicos} />
                <Route path="/terms" component={cguPage} />
                <Route path="/mentions_legales" component={MentionsLegales} />
                <Route path="/contact" component={Contact} />
                <Route path="/" component={HomePage} />
              </Switch>
              <Footer />
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_CENTER} autoClose={3000} />
            <ScrollUpButton />
          </UserProfileContext.Provider>
        </LogedInModalContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
    </>
  );
};

//---------------------------------------------- RENDER :

// On récupère la div avec l'id "app" qu'on a créé dans le block body de index.html.twig :
const rootElement = document.querySelector("#app");
// On demande à ReactDOM de faire le rendu de notre constante App dans la div #app :
ReactDOM.render(<App />, rootElement);
