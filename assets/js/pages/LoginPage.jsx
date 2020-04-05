import React, { useState, useContext, useEffect } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import UserContext from "../contexts/UserContext";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const {setUserId} = useContext(UserContext);

  // State pour gérer les identifiants : objet vide par défaut
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  //State pour gérer les erreurs d'identifiants
  const [error, setError] = useState("");

  // fonction pour enregistrer la valeur saisie dans le champs du formulaire et la passer dans le state
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  // fonction pour gérer la soumission du formulaire de connexion avec requête axios
  const handleSubmit = async event => {
    // on évite le rechargement de la page :
    event.preventDefault();
    try {
      // on se connecte (génération d'un token)
      await AuthAPI.authenticate(credentials);
      // On ne met pas d'erreur
      setError("");
      // on précise au contexte qu'on est connecté
      setIsAuthenticated(true);
      const id = AuthAPI.userId();
      setUserId(id)
      // on se redirige vers la page des profils avec la props history de react-router-dom
      history.replace("/profils");
    } catch (error) {
      console.log(error.response);
      //si erreur de connexion : on définit un message qui s'affichera sous le champs du formulaire
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas"
      );
    }
  };

  return (
    <>
      <div className="fondPage bg-secondary py-4">
        <div className="container bg-light shadow p-5">
          <h1>Connexion à ZicoS</h1>
            <form onSubmit={handleSubmit}>
              <Field
                label="Adresse email"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Adresse email de connexion"
                error={error}
              />
              <Field
                label="Mot de passe"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                type="password"
              />
              <div className="form-group">
                <button type="submit" className="btn btn-success">
                  Se connecter
                </button>
              </div>
            </form>
          </div>
      </div>
    </>
  );
};

export default LoginPage;
