import React, { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import Helmet from "react-helmet";
import {toast} from "react-toastify"

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar'

import Field from "../components/forms/Field";
import Select from "../components/forms/Select";

import typeAPI from "../services/typeAPI";
import instrumentsAPI from "../services/instrumentsAPI";
import localizationAPI from "../services/localizationAPI";
import stylesAPI from "../services/stylesAPI";
import userAPI from "../services/userAPI";
import profilesAPI from "../services/profilesAPI";

const CreateProfilePage = ({history}) => {

  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //STATES :
  const [profile, setProfile] = useState({
    type: "",
    firstName: "",
    lastName: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    instrument: "",
    region: "",
    departement: "",
    style: ""
  });
  const [errors, setErrors] = useState({
    type: "",
    firstName: "",
    lastName: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    instrument: "",
    region: "",
    departement: "",
    style: ""
  });
  const [types, setTypes] = useState([]);
  const [instruments, setIntruments] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [styles, setStyles] = useState([]);
  const [user, setUser] = useState([]);
  const [groupEdit, setGroupEdit] = useState(false)
  const [typeGroupId, setTypeGroupId] = useState("")

  // FONCTIONS :

  //fct pour récupérer les types :
  const fetchTypes = async () => {
    try {
      const dataTypes = await typeAPI.findAll();
      setTypes(dataTypes);
      // console.log(dataTypes)
      dataTypes.map(type => (
        (type.name === "groupe" && setTypeGroupId(type.id))
      ))
    } catch (error) {
      console.log(error.response);
    }
  };
  //ftc pour récupérer les instruments :
  const fetchInstruments = async () => {
    try {
      const dataInstrus = await instrumentsAPI.findAll();
      setIntruments(dataInstrus);
      // console.log(dataInstrus)
    } catch (error) {
      console.log(error.response);
    }
  };
  //fct pour récupérer les localizations :
  const fetchLocalizations = async () => {
    try {
      const dataLocals = await localizationAPI.findAll();
      setLocalizations(dataLocals);
      //   console.log(dataLocals);
    } catch (error) {
      console.log(error.response);
    }
  };
  //fct pour récupérer les styles :
  const fetchStyles = async () => {
    try {
      const dataStyles = await stylesAPI.findAll();
      setStyles(dataStyles);
      //   console.log(dataStyles);
    } catch (error) {
      console.log(error.response);
    }
  };
  //fct pour récupérer le user :
  const fetchUser = async userId => {
    try {
      const dataUser = await userAPI.findOne(userId);
      setUser(dataUser);
      // console.log(dataUser)
    } catch (error) {
      console.log(error.response);
    }
  };

  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {

    // extrait le name et la value depuis le champs en cours (currentTarget)
    // console.log(currentTarget.id);
    if(currentTarget.id === "type"){
      if(currentTarget.value === typeGroupId.toString()){
        setGroupEdit(true)
        console.log("groupe")
        delete profile.instrument
      }else{
        setGroupEdit(false)
        console.log("musicien")
      }
    }
  
    const { name, value } = currentTarget;
    //modifie le profil dans l'état en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setProfile({ ...profile, [name]: value });
  };

  //fct pour gérer la soumission du formulaire :
  const handleSubmit = async event => {
    event.preventDefault();
    console.log(profile);
    try {
      if (!groupEdit){
        //Si c'est un profil musicien.ne; on envoie une requête en post via axios en passant ce profile en objet
        const response = await axios.post(
          "http://localhost:8000/api/profiles",
          {
            ...profile,
            type: `api/types/${profile.type}`,
            instrument: `api/instruments/${profile.instrument}`,
            style: `api/styles/${profile.style}`,
            email: `${user.email}`,
            localization: `/api/localizations/${profile.region}`
          }
        );
        setErrors({});
        console.log(response.data);
        toast.success("Votre Profil à bien été créé !")
        history.push(`/profils`)
      } else {
        //on commence par supprimer la propriété instrument de l'objet profile car elle est vide et fera planter la requête
        delete profile.instrument
        //Sinon, c'est un profil groupe et on envoie une requête en post via axios en passant ce profil en objet
        const response = await axios.post(
          "http://localhost:8000/api/profiles",
          {
            ...profile,
            type: `api/types/${profile.type}`,
            style: `api/styles/${profile.style}`,
            email: `${user.email}`,
            localization: `/api/localizations/${profile.region}`
          }
        );
        setErrors({});
        console.log(response.data);
        toast.success("Votre Profil à bien été créé !")
        history.push(`/profils`)
      }
    } catch (error) {
      if (error.response) {
        const apiErrors = {};
        error.response.data.violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  //EFFETS
  useEffect(() => {
    fetchTypes();
    fetchInstruments();
    fetchLocalizations();
    fetchStyles();
    fetchUser(userId);
  }, []);

  return (
    <>
      <Helmet>
        <title>Zicos : mon profil </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5 profile_creation">
          <h1>Création du profil</h1>

          <form onSubmit={handleSubmit} className="m-5">
          <Accordion>
            
            <Card>

              <Card.Header className="d-flex justify-content-center">
                <Accordion.Toggle as={Button} variant="primary" eventKey="0">
                  Créer mon profil Zicos !
                </Accordion.Toggle>
              </Card.Header>

              <Accordion.Collapse eventKey="0">
                <Card.Body className="create_profil_card">
                  <ProgressBar animated now={10} label="C'est parti !" className="mb-3"/>
                <h3>Bon, commençons par quelques informations de base...</h3>
                <Select
                  name="type"
                  label="Êtes-vous un.e musicien.ne ou un groupe ?"
                  value={profile.type}
                  error={errors.type}
                  onChange={handleChange}
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id} id={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                <Field
                  name="firstName"
                  label={(!groupEdit && "Votre Prénom ") || "Nom du Groupe"}
                  placeholder={(!groupEdit && "Votre Prénom ") || "Le nom du Groupe"}
                  value={profile.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />

                {!groupEdit && (
                  <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    value={profile.lastName}
                    onChange={handleChange}
                  />
                )}

                  <Accordion.Toggle as={Button} variant="primary" eventKey="1">
                    Continuer
                  </Accordion.Toggle>

                </Card.Body>
              </Accordion.Collapse>
            </Card>
           
            <Card>
              <Accordion.Collapse eventKey="1">
                <Card.Body className="create_profil_card">
                <ProgressBar animated now={40} label="Bon début, on continue !" className="mb-3" />
                  <h3>Super ! Maintenant quelques détails sur vous et votre musique...</h3>
                    {!groupEdit && (
                      <Select
                        name="instrument"
                        label="Instrument"
                        value={profile.instrument}
                        error={errors.instrument}
                        onChange={handleChange}
                      >
                        {instruments.map(instrument => (
                          <option key={instrument.id} value={instrument.id}>
                            {instrument.name}
                          </option>
                        ))}
                      </Select>
                    )}
                    <Select
                      name="style"
                      label="Style de musique"
                      value={profile.style}
                      error={errors.style}
                      onChange={handleChange}
                    >
                      {styles.map(style => (
                        <option key={style.id} value={style.id}>
                          {style.name}
                        </option>
                      ))}
                    </Select>
                    <Select
                      name="region"
                      label="Région"
                      value={profile.region}
                      error={errors.region}
                      onChange={handleChange}
                    >
                      {localizations.map(localization => (
                        <option key={localization.id} value={localization.id}>
                          {localization.region}
                        </option>
                      ))}
                    </Select>
                    

                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Retour
                  </Accordion.Toggle>
                  <Accordion.Toggle as={Button} variant="primary" eventKey="2">
                    Continuer
                  </Accordion.Toggle>

                </Card.Body>
              </Accordion.Collapse>
            </Card>

            <Card>
              <Accordion.Collapse eventKey="2">
                <Card.Body className="create_profil_card" >
                  <ProgressBar animated now={65} label="Allez ! On lâche rien ! " className="mb-3" />
                  <h3>Parfait ! quelques mots pour vous décrire ?</h3>
                  {/* <Field
                    name="biography"
                    label="A propos de vous"
                    placeholder="Un petit texte de présentation ? Décrivez votre style, votre groupe, vos influences et inspirations..."
                    type="textarea"
                    value={profile.biography}
                    onChange={handleChange}
                    rows="3"
                  /> */}
                  <Form.Group controlId="biography" name="biography">
                    <Form.Label>A propos de vous</Form.Label>
                    <Form.Control 
                      name="biography"
                      as="textarea" 
                      rows="3" 
                      placeholder="Un petit texte de présentation ? Décrivez votre style, votre groupe, vos influences et inspirations..."
                      value={profile.biography}
                      onChange={handleChange}
                      />
                  </Form.Group>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Retour
                  </Accordion.Toggle>
                  <Accordion.Toggle as={Button} variant="primary" eventKey="3">
                    Continuer
                  </Accordion.Toggle>

                </Card.Body>
              </Accordion.Collapse>
            </Card>

            <Card>
              <Accordion.Collapse eventKey="3">
                <Card.Body className="create_profil_card">
                  <ProgressBar animated now={90} label="C'est bientôt fini !"  className="mb-3"/>
                  <h3>Et pour finir ...</h3>
                  <Field
                    name="pictureUrl"
                    label="Votre photo de profil"
                    placeholder="lien vers votre photo de profil"
                    value={profile.pictureUrl}
                    onChange={handleChange}
                  />
                  <Field
                    name="linkUrl"
                    label="Vous avez un site internet ou un profil facebook à partager ?"
                    placeholder="Lien vers votre site internet"
                    value={profile.linkUrl}
                    onChange={handleChange}
                  />


                  <div className="form-group">
                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                      Retour
                    </Accordion.Toggle>
                    <button type="submit" className="btn btn-success">
                      Enregistrer
                    </button>
                  </div>

                </Card.Body>
              </Accordion.Collapse>
            </Card>

          </Accordion>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProfilePage;
