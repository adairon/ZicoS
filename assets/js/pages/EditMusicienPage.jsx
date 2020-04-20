//----------------------------------------------IMPORTS :
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Helmet from "react-helmet";

import {toast} from "react-toastify"

import axios from "axios";
//bootstrap :
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
//context :
import UserContext from "../contexts/UserContext";
//API
import instrumentsAPI from "../services/instrumentsAPI";
import localizationAPI from "../services/localizationAPI";
import stylesAPI from "../services/stylesAPI";
import profilesAPI from "../services/profilesAPI";
import userAPI from "../services/userAPI";
import levelsAPI from "../services/levelsAPI";
import { PICTURE_API } from "../config";
//components:
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CssProfileLoader from "../components/loaders/CssProfileLoader";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const EditMusicienPage = (props) => {
  const { id } = props.match.params;

  //----------------------------------------------CONTEXTS :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //----------------------------------------------STATES :
  const [profile, setProfile] = useState({
    type: "",
    firstName: "",
    lastName: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    youtubeUrl:"",
    instrument: "",
    region: "",
    departement: "",
    style: "",
    level: ""
  });
  const [errors, setErrors] = useState({
    type: "",
    firstName: "",
    lastName: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    youtubeUrl:"",
    instrument: "",
    region: "",
    departement: "",
    style: "",
    level: ""
  });

  const [instruments, setIntruments] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [styles, setStyles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [image, setImage]= useState("")
  const [btnLabel, setBtnLabel] = useState("")
  const [loading, setLoading] = useState(true)

  //----------------------------------------------FUNCTIONS :

  //fct pour gérer l'affichage de la photo en modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ------------------------------------- FONCTIONS REQUETES API :
  let source = axios.CancelToken.source()

  //ftc pour récupérer les instruments :
  const fetchInstruments = async () => {
    try {
      const dataInstrus = await instrumentsAPI.findAll({cancelToken: source.token});
      setIntruments(dataInstrus);
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      };
    }
  };

  //fct pour récupérer les localizations :
  const fetchLocalizations = async () => {
    try {
      const dataLocals = await localizationAPI.findAll({cancelToken: source.token});
      setLocalizations(dataLocals);
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      };
    }
  };

  //fct pour récupérer les styles :
  const fetchStyles = async () => {
    try {
      const dataStyles = await stylesAPI.findAll({cancelToken: source.token});
      setStyles(dataStyles);
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      };
    }
  };
  
  // Pour récupérer les levels
  const fetchLevels = async () => {
    try {
      const dataLevels = await levelsAPI.findAll({
        cancelToken: source.token,
      });
      setLevels(dataLevels);
    }catch(error){
      console.log(error.response)
    }
  }

  //fct pour récupérer le user :
  const fetchUser = async userId => {
    try {
      const dataUser = await userAPI.findOne(userId);
      setUser(dataUser);
    } catch (error) {
      console.log(error.response);
    }
  };



  //fct pour récupérer le profil du user :
  const fetchProfile = async id => {
    try {
      const dataProfile = await profilesAPI.findOne(id);
      const { type, firstName, lastName, biography, pictureUrl, linkUrl, youtubeUrl, instrument, localization, style, level } = dataProfile;
      setProfile({ type: type.id, firstName, lastName, biography, pictureUrl, linkUrl, youtubeUrl, instrument: instrument.id, departement: localization.id, style: style.id, level:level.id });
      //Pour donner à l'image une valeur par défaut correspondant au nom du fichier déjà enregistré
      setImage(dataProfile.pictureUrl.toString())
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  // ------------------------------------- FONCTIONS EDITION FORMULAIRE :
  // Fonctions pour l'upload de l'image : 
  const handleFile = event => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    try{
      axios.post(PICTURE_API, data,{})
           .then(response => {setImage(response.data.contentUrl)})
      setBtnLabel("Image chargée")
    }catch(error){
      console.log(error.response)
      setUploadError(true)
    }
  }

  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {
    // extrait le name et la value depuis le champs en cours (currentTarget)
    const { name, value } = currentTarget;
    //modifie le profil dans l'état en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setProfile({ ...profile, [name]: value });
  };

  //fct pour gérer la soumission du formulaire :
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await profilesAPI.update(id,
        {
          ...profile,
          pictureUrl: `${image}`,
          type: `api/types/${profile.type}`,
          level: `api/levels/${profile.level}`,
          instrument: `api/instruments/${profile.instrument}`,
          style: `api/styles/${profile.style}`,
          email: `${user.email}`,
          localization: `/api/localizations/${profile.departement}`
        });
      setErrors({});
      toast.success("Votre Profil à bien été modifié !")
      props.history.push(`/profils`)
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

  //----------------------------------------------EFFETCS :
  useEffect(() => {
    fetchInstruments();
    fetchLocalizations();
    fetchStyles();
    fetchLevels();
    fetchUser(userId);
    fetchProfile(id);
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

      <div className="fondPage bg-secondary py-4">

        {loading && 
          <div className="container py-2">
            <CssProfileLoader/>
          </div>
        }

        {!loading &&
        <div className="container profile border rounded py-2 bg-light shadow">
          <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">

              <figure className="col-lg-6 col-md-12 col-sm-12 profile_pic p-1 my-2 d-flex flex-column profile_figure" >
                <img className="img-thumbnail profile_picture" src={profile.pictureUrl} alt="" onClick={handleShow}/>
                
                <div className="editUploadForm border border-dark rounded p-2">
                      <Form.File
                        name="image"
                        label="Changer votre photo de profil"
                        onChange={handleFile}
                        formEncType="multipart/form-data"
                      />
                      <span className="badge badge-success">{btnLabel}</span>
                  </div>

              </figure>

              <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                  <img src={profile.pictureUrl} className="img-fluid"/>
                </Modal.Body>
              </Modal>

              <div className="col-lg-6 col-md-12 col-sm-12 profile_info p-1 my-2">
                <div className="alert alert alert-primary mx-2">
                  <Field
                    name="firstName"
                    label="Votre Prénom "
                    placeholder="Votre Prénom "
                    value={profile.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    value={profile.lastName}
                    onChange={handleChange}
                  />

                  <p className="profile_type text-center"> {profile.type.name} </p>

                </div>

                <div className="profile_info instrus p-1 m-2 alert alert-secondary">
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
                </div>

                <div className="profile_info style p-1 m-2 alert alert-secondary">
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
                </div>

                <div className="profile_info level p-1 m-2 alert alert-secondary">
                  <Select
                    name="level"
                    label="Niveau"
                    value={profile.level}
                    error={errors.level}
                    onChange={handleChange}
                  >
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="profile_info localization p-1 m-2 alert alert-secondary">
                  <Select
                    name="departement"
                    label="Département"
                    value={profile.departement}
                    error={errors.departement}
                    onChange={handleChange}
                  >
                    {localizations.map(localization => (
                      <option key={localization.id} value={localization.id}>
                        {localization.departement}
                      </option>
                    ))}
                  </Select>
                </div>

              </div>
            </div>

            <div className="profile_bio p-1 my-2 border border-light rounded">
              <Field
                name="biography"
                label="A propos de vous"
                placeholder="Un petit texte de présentation ?"
                type="textarea"
                value={profile.biography}
                onChange={handleChange}
              />
            </div>

            <div className="profile_link p-1 my-2 border border-light rounded">
              <Field
                name="linkUrl"
                label="votre site internet"
                placeholder="Lien vers votre site internet"
                value={profile.linkUrl}
                error={errors.linkUrl}
                onChange={handleChange}
              />
            </div>

            <div className="profile_link p-1 my-2 border border-light rounded">
              <Field
                name="youtubeUrl"
                label="Contenu YouTube"
                placeholder="Lien vers une video YouTube"
                value={profile.youtubeUrl}
                error={errors.youtubeUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group d-flex justify-content-center">
              <Link to={"/users/" + userId} className="btn btn-danger">
                Annuler
              </Link>
              <button type="submit" className="btn btn-success mx-5">
                Enregistrer
              </button>
            </div>

          </form>
        </div>}
      </div>
    </>
  );
};

export default EditMusicienPage;
