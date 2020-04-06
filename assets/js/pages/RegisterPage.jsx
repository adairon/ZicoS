import React, { useState,useContext,useEffect } from "react";
import {toast} from "react-toastify"
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import LogedInModalContext from "../contexts/LogedInModalContext";
import userAPI from "../services/userAPI";
import Field from "../components/forms/Field";
import LoginModal from "../components/LoginModal";

const RegisterPage = ({history}) => {
  //CONTEXTES :
  const{logedInModal, setLogedInModal} = useContext(LogedInModalContext)
  //STATES:
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
  
  //FONCTIONS :
  
  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {
    // extrait le name et la value depuis le champs en cours (currentTarget)
    // console.log(currentTarget);
    const { name, value } = currentTarget;
    //modifie le profil dans l'état en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setUser({ ...user, [name]: value });
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
    //Erreur si la date de naissance est vide (car ce cas de figure est non gérer par l'api)
    if(user.birthDate === ""){
      apiErrors.birthDate = "Votre date de naissance est obligatoire"
      setErrors(apiErrors)
      return
    }
    try{
      await userAPI.register(user);
      // console.log(response);
      //on "vide" les erreurs
      setErrors({})
      //notification toast:
      toast.success("Votre compte est bien créé ! Connectez vous")
      LoginModal.handleShow()
      //redirection vers la création d'un profil :
      history.replace('/')
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
    // console.log(user);
  };
  //EFFETS :
  useEffect(()=>{
    if(logedInModal){
      setLogedInModal(false)
      // Notification Toast :
      toast.success("Vous êtes connecté ! À vous de jouer 🎸 🎹")
      history.push("/profils")
    }
  },[logedInModal])
  
  return (
    <>
      <div className="fondPage bg-secondary p-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Inscription sur ZicoS</h1>
          <p className="text-center">Pour créer votre profil et découvrir des groupes ou musiciens.nes, vous dévez d'abord créer un compte si vous n'en avez pas.</p>
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
                <Field
                  name="email"
                  label="email"
                  placeholder="Votre adresse email"
                  type="email"
                  error={errors.email}
                  value={user.email}
                  onChange={handleChange}
                />
                <Field
                  name="birthDate"
                  label="Date de Naissance"
                  placeholder="Votre date de naissance"
                  type="date"
                  error={errors.birthDate}
                  value={user.birthDate}
                  onChange={handleChange}
                />
                <Field
                  name="password"
                  label="Mot de passe"
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
                <button type="submit" className="btn btn-success">
                    Confirmation
                </button>
              </form>
            </div>
          </Collapse>
          
          
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
