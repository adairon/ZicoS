//---------------------------------------------- IMPORTS :
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

//---------------------------------------------- FUNCTIONNAL COMPONENT :
const CreateProfilePage = ({history}) => {

  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //---------------------------------------------- STATES :
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
  const [progress, setProgress] = useState("0")
  const [clicCount, setClicCount]=useState(1)
  const [step1Class, setStep1Class]= useState("")
  const [step2Class, setStep2Class]= useState("")
  const [step3Class, setStep3Class]= useState("")
  const [collapse, setCollapse] = useState("")
  const [showBtn, setShowBtn] = useState("collapse")

  // ---------------------------------------------- FUNCTIONS :

  //_____________________________________AXIOS API REQUEST FUNCTIONS :

  let source = axios.CancelToken.source()

  //fct pour récupérer les types :
  const fetchTypes = async () => {
    try {
      const dataTypes = await typeAPI.findAll({cancelToken: source.token});
      setTypes(dataTypes);
      // console.log(dataTypes)
      dataTypes.map(type => (
        (type.name === "groupe" && setTypeGroupId(type.id))
      ))
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      };
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
      const dataStyles = await stylesAPI.findAll({cancelToken: source.token});
      setStyles(dataStyles);
      //   console.log(dataStyles);
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      };
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

  //_____________________________________FORM FUNCTIONS :

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

  // ftc pour gérer la progression de la progress bar aux clics sur le 1er bouton
  const begin = ()=>{
    setClicCount(clicCount +1)
    if(clicCount%2 !== 0){
      setProgress("15")
    }else{
      setProgress("0")
    }
  }

  // const toStep1 = () => {
  //   setStep1Class("collapse show")
  // }

  // const toStep2 = (event) => {
    // const apiErrors = {};
    // if(profile.type === ""){
    //   console.log("type null")
    //   apiErrors.type = "Merci de préciser quel type de profil vous vouler créer"
    //   setErrors(apiErrors)
    //   setStep2Class("collapse")
    // }else{
    //   setStep2Class("collapse show")
    //   setStep1Class("collapse")

    // }
  // }

  //fct pour vérif avant envoi :
  // const handleCheck = ()=>{
  //   setStep1Class("show")
  //   setStep2Class("show")
  //   setStep3Class("show")
  //   setCollapse("collapse")
  //   setShowBtn("")
  // }

  //fct pour gérer la soumission du formulaire et les erreurs:
  const handleSubmit = async event => {
    event.preventDefault();
    //Gestion des erreurs pour les champs en relation avec d'autres entités avant de faire partir la requête :
    const apiErrors = {};
    if(profile.type === ""){
      console.log("type null")
      apiErrors.type = "Merci de préciser quel type de profil vous vouler créer"
      setStep1Class("show")
      setCollapse("collapse")
      setErrors(apiErrors)
      return;
    }
    if(!groupEdit & profile.instrument === ""){
      console.log("instrument null")
      apiErrors.instrument = "Merci de préciser de quel instrument vous jouez"
      setStep2Class("show")
      setCollapse("collapse")
      setErrors(apiErrors)
      return;
    }
    if(profile.style === ""){
      console.log("style null")
      apiErrors.style = "Merci de préciser quel style de musique vous jouez principalement"
      setStep2Class("show")
      setCollapse("collapse")
      setErrors(apiErrors)
      return;
    }
    if(profile.region === ""){
      console.log("region null")
      apiErrors.region = "Merci de préciser votre région"
      setStep2Class("show")
      setCollapse("collapse")
      setErrors(apiErrors)
      return;
    }
    console.log(profile)
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
        //sinon, on commence par supprimer la propriété instrument de l'objet profile car elle est vide et fera planter la requête
        delete profile.instrument
        delete errors.instrument
        //et, c'est un profil groupe et on envoie une requête en post via axios en passant ce profil en objet
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
      console.log(error.response)
      if (error.response) {
        const apiErrors = {};
        error.response.data.violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  //----------------------------------------------EFFECTS
  useEffect(() => {
    fetchTypes();
    fetchInstruments();
    fetchLocalizations();
    fetchStyles();
    fetchUser(userId);
    return ()=>{
      source.cancel()
    }
  }, []);
  //----------------------------------------------RETURN :
  return (
    <>
      <Helmet>
        <title>Zicos : mon profil </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5 profile_creation">
          <h1>Création du profil</h1>

          <form className="m-5">
          <Accordion>
            
            <ProgressBar animated now={progress} className="mb-3"/>

            <Card>

              <Card.Header className="text-center">
                <Card.Title className="mb-4">Il vous faut un profil pour pouvoir entrer en contact avec les autres musiciens.nes et groupes déjà présents sur ZicoS</Card.Title>
                
                {/* <button className="btn btn-primary" onClick={toStep1}>
                  Créer mon profil ZicoS !
                </button> */}
                <Accordion.Toggle as={Button} variant="primary" eventKey="0" onClick={begin} className={collapse} >
                  Créer mon profil Zicos !
                </Accordion.Toggle>

              </Card.Header>

              <Accordion.Collapse eventKey="0" className={step1Class}>
                <Card.Body className="create_profil_card">
                <h3 className={collapse}>Bon, commençons par quelques informations de base...</h3>
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
                  {/* <button className="btn btn-primary" onClick={toStep2}>
                    continuer
                  </button> */}
                  <Accordion.Toggle as={Button} variant="primary" eventKey="1" onClick={()=>{setProgress("40")}} className={collapse}>
                    Continuer
                  </Accordion.Toggle>

                </Card.Body>
              </Accordion.Collapse>
            </Card>
           
            <Card>
              <Accordion.Collapse eventKey="1" className={step2Class}>
                <Card.Body className="create_profil_card">
                  <h3 className={collapse}>Super ! Maintenant quelques détails sur vous et votre musique...</h3>
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
                    

                  <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={()=>{setProgress("15")}} className={collapse}>
                    Retour
                  </Accordion.Toggle>
                  <Accordion.Toggle as={Button} variant="primary" eventKey="2" onClick={()=>{setProgress("65")}} className={collapse}>
                    Continuer
                  </Accordion.Toggle>

                </Card.Body>
              </Accordion.Collapse>
            </Card>

            <Card>
              <Accordion.Collapse eventKey="2" className={step3Class}>
                <Card.Body className="create_profil_card" >
                  <h3 className={collapse}>Parfait ! quelques mots pour vous décrire ?</h3>
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
                  <Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={()=>{setProgress("40")}} className={collapse}>
                    Retour
                  </Accordion.Toggle>
                  <Accordion.Toggle as={Button} variant="primary" eventKey="3" onClick={()=>{setProgress("90")}} className={collapse}>
                    Continuer
                  </Accordion.Toggle>

                </Card.Body>
              </Accordion.Collapse>
            </Card>

            <Card>
              <Accordion.Collapse eventKey="3">
                <Card.Body className="create_profil_card">
                  <h3 className={collapse}>Et pour finir ...</h3>
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
                    <Accordion.Toggle as={Button} variant="link" eventKey="2" onClick={()=>{setProgress("65")}} className={collapse}>
                      Retour
                    </Accordion.Toggle>
                    {/* <button className="btn btn-warning" onClick={handleCheck}>
                      Vérifier
                    </button> */}
                    <button onClick={handleSubmit} className="btn btn-success">
                      Enregistrer
                    </button>
                  </div>

                </Card.Body>
              </Accordion.Collapse>
            </Card>

          </Accordion>
          </form>

          {/* <form onSubmit={handleSubmit}>
            <Select
              name="type"
              label="Type de Profil"
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

            <Field
              name="biography"
              label="A propos de vous"
              placeholder="Un petit texte de présentation ?"
              type="textarea"
              value={profile.biography}
              onChange={handleChange}
            />
            <Field
              name="pictureUrl"
              label="photo de profil"
              placeholder="lien vers votre photo de profil"
              value={profile.pictureUrl}
              onChange={handleChange}
            />
            <Field
              name="linkUrl"
              label="votre site internet"
              placeholder="Lien vers votre site internet"
              value={profile.linkUrl}
              onChange={handleChange}
            />

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
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Enregistrer
              </button>
            </div>
          </form> */}


        </div>
      </div>
    </>
  );
};

export default CreateProfilePage;
