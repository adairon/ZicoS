
import React, { useState, useContext } from "react";

import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import Field from "./forms/Field";
import AuthAPI from "../services/authAPI";

const LoginModal = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const {setUserId} = useContext(UserContext);

  //STATES :
  // State pour gérer les identifiants : objet vide par défaut
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  //State pour gérer les erreurs d'identifiants
  const [error, setError] = useState("");
  // State pour gérer la fermeture de la modal
  const [show, setShow] = useState(false)

  //FONCTIONS :
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
      console.log("ok")
      // On ne met pas d'erreur
      // on précise au contexte qu'on est connecté
      setIsAuthenticated(true);
      const id = AuthAPI.userId();
      setUserId(id)
      setShow(false)
      setError("");
      // on se redirige vers la page des profils avec la props history de react-router-dom
      // history.replace("/profils");
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
      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#loginModal">
        Launch login modal
      </button>
      <div show={show} className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">ZicoS : connexion</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
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
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  Se connecter
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="fondPage bg-secondary py-4">
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
      </div> */}
    </>
  );
};

export default LoginModal;
