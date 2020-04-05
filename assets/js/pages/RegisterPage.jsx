import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import userAPI from "../services/userAPI";

const RegisterPage = ({history}) => {
  //STATES:
  // on gère létat du user créé avec un objet
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
        setErrors({})
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
    // console.log(user);
  };

  return (
    <>
      <div className="fondPage bg-secondary p-4">
        <div className="container bg-light shadow p-5">
          <h1>Inscription</h1>
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
              placeholder="Votre mot de passe"
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
            <div className="form-group">
                <button type="submit" className="btn btn-success">
                    Confirmation
                </button>
                <Link to="/login" type="button" className="btn btn-link mx-2">
                    j'ai déjà un compte
                </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
