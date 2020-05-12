//----------------------------------------------IMPORTS :
import React, { useState,useContext,useEffect } from "react";

import {toast} from "react-toastify"
//react bootstrap:
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
//contexts:
import LogedInModalContext from "../contexts/LogedInModalContext";
// API:
import userAPI from "../services/userAPI";
//components:
import Field from "../components/forms/Field";
import LoginModal from "../components/LoginModal";
import CGU from "../components/CGU";

//----------------------------------------------FUNCTIONNAL COMPONENT : 
const RegisterPage = ({history}) => {
  //----------------------------------------------CONTEXTS :
  const{logedInModal, setLogedInModal} = useContext(LogedInModalContext)
  
  //----------------------------------------------STATES:
  // on gère l'état du user créé avec un objet
  const [user, setUser] = useState({
    email: "",
    birthDate: "",
    password: "",
    passwordConfirm: ""
  });
  //pour gérer les erreurs :
  const [errors, setErrors] = useState({
    email: "",
    birthDate: "",
    password: "",
    passwordConfirm: ""
  });
  // pour gérer le formulaire en collapse
  const [open, setOpen] = useState(false);
  // pour gérer la modal des CGU :
  const [show, setShow] = useState(false);

  //pour gérer la validation
  const [clicCount, setClicCount] = useState(1);
  const [btnDisabled, setBtnDisabled] = useState("disabled")
  
  //----------------------------------------------FUNCTIONS :
  //gestion modal CGU :
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {
    // extrait le name et la value depuis le champs en cours (currentTarget)
    const { name, value } = currentTarget;
    //modifie le profil dans l'état en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setUser({ ...user, [name]: value });
  };

  //pour gérer la disponibilité du bouton de confirmation en fonction de l'acceptation des CGU (avec compteur de clics):
  const enableConfim = () => {
    setClicCount(clicCount + 1);
    if (clicCount % 2 !== 0) {
      setBtnDisabled("");
    } else {
      setBtnDisabled("disabled");
    }
  };

  //fct pour gérer la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    //Erreur "personnalisée" pour la validation du mdp
    if(user.password !== user.passwordConfirm){
      apiErrors.passwordConfirm = "Votre confirmation ne correspond pas à votre premier mot de passe";
      setErrors(apiErrors)
      return;
    }
    //Erreur si la date de naissance est vide (car ce cas de figure est non géré par l'api)
    if(user.birthDate === ""){
      apiErrors.birthDate = "Votre date de naissance est obligatoire"
      setErrors(apiErrors)
      return
    }
    try{
      await userAPI.register(user);
      // on "vide" les erreurs
      setErrors({})
      // notification toast:
      toast.success("Votre compte est bien créé ! Connectez vous")
      // redirection vers la page de login :
      history.replace('/login')
    }catch(error){
      console.log(error.response)
      const {violations} = error.response.data;
      if(violations){
        violations.forEach(violation => {
          apiErrors [violation.propertyPath] = violation.message
        });
        setErrors(apiErrors)
      }
    }
  };

  //----------------------------------------------EFFECTS :
  useEffect(()=>{
    if(logedInModal){
      setLogedInModal(false)
      // Notification Toast :
      toast.success("Vous êtes connecté ! À vous de jouer 🎸 🎹")
      history.push("/profils")
    }
  },[logedInModal])
  
  //----------------------------------------------RETURN :
  return (
    <>
      <div className="fondPage bg-secondary p-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">

          <h1>Inscription sur ZicoS</h1>

          <p className="text-center">
            Pour créer votre profil et découvrir des groupes ou musiciens.nes, vous dévez d'abord créer un compte si vous n'en avez pas.<br/>
            Créer un compte et un profil sur ZicoS c'est rapide et aussi gratuit !
            </p>

          <div className="d-flex justify-content-center">
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
              className="mx-2"
            >
              Créez votre compte
            </Button>

            <LoginModal libBtn="J'ai déjà un compte" variant="link"/>
          </div>  

          <Collapse in={open}>
            <div id="example-collapse-text">
              <form onSubmit={handleSubmit}>
                
                <div className="row mt-4">
                  <div className="col">
                    <Field
                      name="email"
                      label="Votre adresse email"
                      placeholder="Entrez votre adresse email"
                      type="email"
                      error={errors.email}
                      value={user.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col">
                    <Field
                      name="birthDate"
                      label="Votre date de naissance"
                      type="date"
                      error={errors.birthDate}
                      value={user.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Field
                  name="password"
                  label="Votre mot de passe"
                  placeholder="Entrez un mot de passe sécurisé d'au moins 8 caractères"
                  type="password"
                  error={errors.password}
                  value={user.password}
                  onChange={handleChange}
                />

                <Field
                  name="passwordConfirm"
                  label="Confirmez votre mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  type="password"
                  error={errors.passwordConfirm}
                  value={user.passwordConfirm}
                  onChange={handleChange}
                />

                  <Form.Group className="d-flex">

                    <Form.Check
                      required
                      onChange={enableConfim}
                      label={"J'ai lu et j'accepte les" + " "}
                    />

                    <Button variant="link" onClick={handleShow} className="ml-1 border-0 p-0">
                      conditions générales d'utilisation
                    </Button>

                  </Form.Group>

                <button type="submit" className="btn btn-success" disabled={btnDisabled}>
                    Confirmation
                </button>

              </form>
            </div>

          </Collapse>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className="bg-primary text-light" closeButton>
              <Modal.Title >Conditions générales d'utilisation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CGU/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleClose}>
                Accepter et Fermer
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </>
  );
};

export default RegisterPage;
