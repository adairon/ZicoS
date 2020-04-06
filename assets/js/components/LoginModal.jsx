import React, { useState, useContext } from "react";
//import bootstrap react :
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import LogedInModalContext from "../contexts/LogedInModalContext";

import Field from "./forms/Field";
import AuthAPI from "../services/authAPI";

const LoginModal = ({ history, titreBtn }) => {
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
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
    setCredentials({
      username:"",
      password:""
    })
    setError("")
  };

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
      // on se redirige vers la page des profils avec la props history de react-router-dom
      // history.push("/profils");
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
      <Button variant="secondary" onClick={handleShow} className="d-flex justify-content-center">
        {titreBtn}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ZicoS : connexion</Modal.Title>
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

      {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#loginModal">
        Launch login modal
      </button>
      <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
      </div> */}
    </>
  );
};

export default LoginModal;
