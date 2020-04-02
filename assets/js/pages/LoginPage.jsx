import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({history}) => {

  const { setIsAuthenticated} = useContext(AuthContext);

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
      // on précise à la props qu'on est connecté
      setIsAuthenticated(true);
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
      <h1>Connexion à ZicoS</h1>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Adresse email</label>
            <input
              onChange={handleChange}
              value={credentials.username}
              type="email"
              placeholder="Adresse email de connexion"
              name="username"
              id="username"
              className={"form-control" + (error && " is-invalid")}
            />
            {error && <p className="invalid-feedback"> {error} </p>}
          </div>
          <div className="form-group">
            <label htmlFor="_assword">Mot de passe</label>
            <input
              onChange={handleChange}
              value={credentials.password}
              type="password"
              placeholder="Mot de passe"
              name="password"
              id="password"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
