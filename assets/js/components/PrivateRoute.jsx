import React, {useContext} from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

//On créé un composant PrivateRoute pour rendre certaines routes inaccessibles aux utilisateurs non connectés
const PrivateRoute = ({ path, component }) => {

  //On utilise le hook useContext pour récupérer les informations de connexions passées dans AuthContext
  const { isAuthenticated } = useContext(AuthContext);
  
  //si l'utilisateur est authentifié, alors on renvoie une route et un composant sinon, on est redirigé vers la page d'accueil

  return isAuthenticated ? (
    <Route path={path} component={component} />
  ) : (
    <Redirect to="/" />
  );
};

export default PrivateRoute;