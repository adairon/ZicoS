//----------------------------------------------IMPORTS :
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Helmet from "react-helmet";

import {toast} from "react-toastify"

import axios from "axios";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import UserContext from "../contexts/UserContext";

import localizationAPI from "../services/localizationAPI";
import profilesAPI from "../services/profilesAPI";
import userAPI from "../services/userAPI";
import stylesAPI from "../services/stylesAPI";

import Field from "../components/forms/Field";
import Select from "../components/forms/Select";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const EditGroupPage = props => {
  const { id } = props.match.params;

  //----------------------------------------------CONTEXTS :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //----------------------------------------------STATES :
  const [profile, setProfile] = useState({
    type: "",
    firstName: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    region: "",
    departement: "",
    style: ""
  });
  const [errors, setErrors] = useState({
    type: "",
    firstName: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    region: "",
    departement: "",
    style: ""
  });
  const [localizations, setLocalizations] = useState([]);
  const [styles, setStyles] = useState([]);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState("")
  const [image, setImage]= useState("")
  const [btnColor, setBtnColor] = useState("secondary")
  const [btnLabel, setBtnLabel] = useState("Charger l'image")

  //----------------------------------------------FUNCTIONS :

  //fct pour gérer l'affichage de la photo en modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFile = event => {
    // console.log(event.target.files[0])
    setFile(event.target.files[0])
  }
  //fct pour gérer l'upload
  const handleUpload = (event)=>{
    event.preventDefault();
    const data = new FormData()
    data.append('file', file)
    axios.post("http://localhost:8000/api/media_objects", data,{})
         .then(response => {setImage(response.data.contentUrl)})
        //  .then(console.log("file uploaded"))
    setBtnColor("info")
    setBtnLabel("Image chargée")
  }

  let source = axios.CancelToken.source()

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

  //fct pour récupérer le profil du user :
  const fetchProfile = async id => {
    try {
      const dataProfile = await profilesAPI.findOne(id);
      // console.log(dataProfile)
      const { type, firstName, biography, pictureUrl, linkUrl, localization, style } = dataProfile;
      setProfile({ type: type.id, firstName, biography, pictureUrl, linkUrl, region: localization.id, style: style.id });
    } catch (error) {
      console.log(error);
    }
  };

  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {
    // extrait le name et la value depuis le champs en cours (currentTarget)
    // console.log(currentTarget);
    const { name, value } = currentTarget;
    //modifie le profil dans l'état en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setProfile({ ...profile, [name]: value });
  };

  //fct pour gérer la soumission du formulaire :
  const handleSubmit = async event => {
    event.preventDefault();
    // console.log(profile);
    try {
      const response = await axios.put(
        "http://localhost:8000/api/profiles/" + id,
        {
          ...profile,
          pictureUrl: `/media/${image}`,
          type: `api/types/${profile.type}`,
          style: `api/styles/${profile.style}`,
          email: `${user.email}`,
          localization: `/api/localizations/${profile.region}`
        }
      );
      setErrors({});
      toast.success("Votre Profil à bien été modifié !")
      props.history.push(`/profils`)
      // console.log(response.data);
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


  //----------------------------------------------EFFECTS :
  useEffect(() => {
    fetchLocalizations();
    fetchStyles();
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
        <div className="container profile border rounded py-2 bg-light shadow">
          <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">

              <figure className="col-lg-6 col-md-12 col-sm-12 profile_pic p-1 my-2 d-flex flex-column profile_figure">
                <img className="img-thumbnail profile_picture" src={profile.pictureUrl} alt="" onClick={handleShow}/>
                
                <div className="editUploadForm border border-dark rounded pl-2">
                      <Form.File
                        name="image"
                        label="Changer votre photo de profil"
                        // value={profile.image}
                        onChange={handleFile}
                        formEncType="multipart/form-data"
                      />
                      <button className={"uploadBtn btn my-3 btn-" + btnColor} onClick={handleUpload}>
                        {btnLabel}
                      </button>
                  </div>

                {/* <Field
                  name="pictureUrl"
                  label="photo de profil"
                  placeholder="lien vers votre photo de profil"
                  value={profile.pictureUrl}
                  onChange={handleChange}
                /> */}
              </figure>
              <Modal show={show} onHide={handleClose}>
        
                <Modal.Body>
                  <img src={profile.pictureUrl} className="img-fluid"/>
                </Modal.Body>
                
              </Modal>


              <div className="col-lg-6 col-md-12 col-sm-12 profile_info p-1 my-2">
                <div className="alert alert alert-dark mx-2">
                  <Field
                    name="firstName"
                    label="Nom du Groupe"
                    placeholder="Le nom de votre groupe"
                    value={profile.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />

                  <p className="profile_type text-center"> {profile.type.name} </p>

                </div>


                <div className="localization p-1 m-2 alert alert-secondary">
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
                </div>

                <div className="style p-1 m-2 alert alert-secondary">
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
                label="Votre site internet"
                placeholder="Lien vers votre site internet"
                value={profile.linkUrl}
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







          {/* <div className="container bg-light shadow p-5">
            <h1>Modification du groupe</h1>

            <form onSubmit={handleSubmit}>

              <Field
                name="firstName"
                label="Nom du Groupe"
                placeholder="Le nom du Groupe"
                value={profile.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />

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
              </Select> */}
              {/* <Select
                name="departement"
                label="Département"
                value={profile.departement}
                error={errors.departement}
                onChange={handleChange}
            >
                { localizations.map(localization=>(
                    <option key={localization.id} value={localization.id} >
                        {localization.departement}
                    </option>
                ))}
            </Select> */}
              {/* <Select
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
              <div className="form-group d-flex justify-content-center">
                <button type="submit" className="btn btn-success mx-5">
                  Enregistrer
              </button>
              </div>
            </form>*/}

          </div> 
        </div>
    </>
  );
};

export default EditGroupPage;
