// TODO : conditions d'affichage des champs en ftc du type de profil : id écrit en dur : le rendre variable

import React, { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import Helmet from "react-helmet";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import typeAPI from "../services/typeAPI";
import instrumentsAPI from "../services/instrumentsAPI";
import localizationAPI from "../services/localizationAPI";
import stylesAPI from "../services/stylesAPI";
import userAPI from "../services/userAPI";
import profilesAPI from "../services/profilesAPI";

const EditMusicienPage = props => {
  const { id } = props.match.params;
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

  // FONCTIONS :

  //fct pour récupérer les types :
  const fetchTypes = async () => {
    try {
      const dataTypes = await typeAPI.findAll();
      setTypes(dataTypes);
      // console.log(dataTypes)
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

  //fct pour récupérer le profil du user :
  const fetchProfile = async id => {
    try {
      const dataProfile = await profilesAPI.findOne(id);
      const {type,firstName,lastName,biography,pictureUrl,linkUrl,instrument,localization,style} = dataProfile;
      setProfile({type:type.id,firstName,lastName,biography,pictureUrl,linkUrl,instrument: instrument.id,region:localization.id,style:style.id});
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
                type: `api/types/${profile.type}`,
                instrument: `api/instruments/${profile.instrument}`,
                style: `api/styles/${profile.style}`,
                email: `${user.email}`,
                localization: `/api/localizations/${profile.region}`
              }
            );
      setErrors({});
    //   console.log(response.data);
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
    fetchProfile(id);
  }, []);
  

  return (
    <>
      <Helmet>
        <title>Zicos : mon profil </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4">
        <div className="container bg-light shadow p-5">

            <h1>Modification du profil</h1>

          <form onSubmit={handleSubmit}>

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
          </form>
        </div>
      </div>
    </>
  );
};

export default EditMusicienPage;
