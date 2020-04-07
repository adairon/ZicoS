import React, { useState, useContext } from "react";
//import bootstrap react :
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import LogedInModalContext from "../contexts/LogedInModalContext";

import Field from "./forms/Field";
import AuthAPI from "../services/authAPI";

const LoginModal = ({ history, libBtn, variant }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const { setUserId } = useContext(UserContext);
  const {setLogedInModal} = useContext(LogedInModalContext)

  //STATES :
  // State pour gérer les identifiants : objet vide par défaut
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  //State pour gérer les erreurs d'identifiants
  const [error, setError] = useState("");
  //State pour l'affichage de la modal
  const [show, setShow] = useState(false);

  
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
    // console.log(credentials)
    try {
      // on se connecte (génération d'un token)
      await AuthAPI.authenticate(credentials);
      // on précise au contexte qu'on est connecté
      setIsAuthenticated(true);
      const id = AuthAPI.userId();
      setUserId(id);
      // On ne met pas d'erreur
      setError("");
      //on cache la modal
      setShow(false);
      //on passe le context loged In modal à true :
      setLogedInModal(true)
    } catch (error) {
      console.log(error.response);
      //si erreur de connexion : on définit un message qui s'affichera sous le champs du formulaire
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas"
        );
      }
    };
    //fct pour gérer l'affichage de la modal
    const handleClose = () => setShow(false);
    const handleShow = () => {
      setShow(true)
      setCredentials({
        username:"",
        password:""
      })
      setError("")
    };
    return (
      <>
      <Button variant={variant} onClick={handleShow} className="d-flex justify-content-center">
        {libBtn}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-light">
            <h2>
              ZicoS : connexion
            </h2>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <form>
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
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSubmit}>
            Se connecter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginModal;
