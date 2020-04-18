//---------------------------------------------- IMPORTS :
import React, { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import Helmet from "react-helmet";
import { toast } from "react-toastify";
//react bootstrap
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
//components:
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
//API:
import typeAPI from "../services/typeAPI";
import instrumentsAPI from "../services/instrumentsAPI";
import localizationAPI from "../services/localizationAPI";
import stylesAPI from "../services/stylesAPI";
import userAPI from "../services/userAPI";
import levelsAPI from "../services/levelsAPI";
import profilesAPI from "../services/profilesAPI";
//iamges:
import robotPicture from "../../images/placeholders/profile_picture/raphael_dairon-robot-vinyl.jpg";

//---------------------------------------------- FUNCTIONNAL COMPONENT :
const CreateProfilePage = ({ history }) => {
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //---------------------------------------------- STATES :
  //profil : objet vide par défaut
  const [profile, setProfile] = useState({
    type: "",
    firstName: "",
    lastName: "",
    biography: "",
    pictureUrl: robotPicture,
    linkUrl: "",
    youtubeUrl:"",
    instrument: "",
    region: "",
    departement: "",
    style: "",
    level: "",
  });
  //erreurs :objet vide par défaut
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
    level: "",
  });
  const [image, setImage] = useState("/defaultPicture/raphael_dairon-robot-vinyl.jpg");
  const [types, setTypes] = useState([]);
  const [instruments, setIntruments] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [styles, setStyles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [user, setUser] = useState([]);
  const [groupEdit, setGroupEdit] = useState(false);
  const [typeGroupId, setTypeGroupId] = useState("");
  const [progress, setProgress] = useState("0");
  const [clicCount, setClicCount] = useState(1);
  const [step1Class, setStep1Class] = useState("");
  const [step2Class, setStep2Class] = useState("");
  const [step3Class, setStep3Class] = useState("");
  const [collapse, setCollapse] = useState("");
  const [btnLabel, setBtnLabel] = useState("");
  

  // ---------------------------------------------- FUNCTIONS :

  //_____________________________________AXIOS API REQUEST FUNCTIONS :

  let source = axios.CancelToken.source();

  //fct pour récupérer les types :
  const fetchTypes = async () => {
    try {
      const dataTypes = await typeAPI.findAll({ cancelToken: source.token });
      setTypes(dataTypes);
      dataTypes.map(
        (type) => type.name === "groupe" && setTypeGroupId(type.id)
      );
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      }
    }
  };

  //ftc pour récupérer les instruments :
  const fetchInstruments = async () => {
    try {
      const dataInstrus = await instrumentsAPI.findAll({cancelToken: source.token});
      setIntruments(dataInstrus);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
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
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      };
    }
  };

  //fct pour récupérer les styles :
  const fetchStyles = async () => {
    try {
      const dataStyles = await stylesAPI.findAll({ cancelToken: source.token });
      setStyles(dataStyles);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      }
    }
  };

  // Pour récupérer les levels
  const fetchLevels = async () => {
    try {
      const dataLevels = await levelsAPI.findAll({cancelToken: source.token});
      setLevels(dataLevels);
    } catch (error) {
      console.log(error.response);
    }
  };

  //fct pour récupérer le user :
  const fetchUser = async (userId) => {
    try {
      const dataUser = await userAPI.findOne(userId);
      setUser(dataUser);
    } catch (error) {
      console.log(error.response);
    }
  };

  //_____________________________________FORM FUNCTIONS :

  //fct pour gérer les changements dans le formulaire :
  const handleChange = ({ currentTarget }) => {
    // extrait le name et la value depuis le champs en cours (currentTarget)
    if (currentTarget.id === "type") {
      if (currentTarget.value === typeGroupId.toString()) {
        setGroupEdit(true);
        delete profile.instrument;
      } else {
        setGroupEdit(false);
      }
    }
    const { name, value } = currentTarget;
    //modifie le profil dans le state en prenant tout ce qu'il y a déjà dans le profil mais écrase la propriété qu'il y a dans name par la donnée "value"
    setProfile({ ...profile, [name]: value });
  };

  // ftc pour gérer la progression de la progress bar aux clics sur le 1er bouton
  const begin = () => {
    setClicCount(clicCount + 1);
    if (clicCount % 2 !== 0) {
      setProgress("15");
    } else {
      setProgress("0");
    }
  };

  const handleFile = event => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    try{
      axios.post("http://localhost:8000/api/media_objects", data,{})
           .then(response => {setImage(response.data.contentUrl)})
      setBtnLabel("Image chargée")
    }catch(error){
      console.log(error.response)
      setUploadError(true)
    }
  }

  //fct pour gérer la soumission du formulaire et les erreurs:
  const handleSubmit = async (event) => {
    event.preventDefault();
    //Gestion des erreurs pour les champs en relation avec d'autres entités avant de faire partir la requête :
    const apiErrors = {};
    if (profile.type === "") {
      apiErrors.type =
        "Merci de préciser quel type de profil vous vouler créer";
      setStep1Class("show");
      setCollapse("collapse");
      setErrors(apiErrors);
      return;
    }
    if (profile.departement === "") {
      apiErrors.departement = "Merci de préciser votre département";
      setStep1Class("show");
      setCollapse("collapse");
      setErrors(apiErrors);
      return;
    }
    if (!groupEdit & (profile.instrument === "")) {
      apiErrors.instrument = "Merci de préciser de quel instrument vous jouez";
      setStep2Class("show");
      setCollapse("collapse");
      setErrors(apiErrors);
      return;
    }
    if (profile.style === "") {
      apiErrors.style =
        "Merci de préciser quel style de musique vous jouez principalement";
      setStep2Class("show");
      setCollapse("collapse");
      setErrors(apiErrors);
      return;
    }
    if (profile.level === "") {
      apiErrors.level = "Merci de préciser votre niveau";
      setStep2Class("show");
      setCollapse("collapse");
      setErrors(apiErrors);
      return;
    }
    try {
      if (!groupEdit) {
        //Si c'est un profil musicien.ne; on envoie une requête en post via axios en passant ce profile en objet
        const response = await profilesAPI.create(
          {
            ...profile,
            pictureUrl: `/media/${image}`,
            type: `api/types/${profile.type}`,
            level: `api/levels/${profile.level}`,
            instrument: `api/instruments/${profile.instrument}`,
            style: `api/styles/${profile.style}`,
            email: `${user.email}`,
            localization: `/api/localizations/${profile.departement}`,
          }
        )
        setErrors({});
        toast.success("Votre Profil à bien été créé !");
        history.push(`/profils`);
      } else {
        //sinon, on commence par supprimer la propriété instrument de l'objet profile car elle est vide et fera planter la requête
        delete profile.instrument;
        delete errors.instrument;
        //et, c'est un profil groupe et on envoie une requête en post via axios en passant ce profil en objet
        const response = await profilesAPI.create(
          {
            ...profile,
            pictureUrl: `/media/${image}`,
            type: `api/types/${profile.type}`,
            level: `api/levels/${profile.level}`,
            style: `api/styles/${profile.style}`,
            email: `${user.email}`,
            localization: `/api/localizations/${profile.departement}`,
          }
        );
        setErrors({});
        toast.success("Votre Profil à bien été créé !");
        history.push(`/profils`);
      }
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        const apiErrors = {};
        error.response.data.violations.forEach((violation) => {
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
    fetchLevels();
    fetchUser(userId);
    return () => {
      source.cancel();
    };
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
              <ProgressBar animated now={progress} className="mb-3" />

              <Card>

                <Card.Header className="text-center">
                  <Card.Title className="mb-4">
                    Il vous faut un profil pour pouvoir entrer en contact avec
                    les autres musiciens.nes et groupes déjà présents sur ZicoS
                  </Card.Title>

                  <Accordion.Toggle
                    as={Button}
                    variant="primary"
                    eventKey="0"
                    onClick={begin}
                    className={collapse}
                  >
                    Créer mon profil Zicos !
                  </Accordion.Toggle>

                </Card.Header>

                <Accordion.Collapse eventKey="0" className={step1Class}>

                  <Card.Body className="create_profil_card">
                    <h3 className={collapse}>
                      Bon, commençons par quelques informations de base...
                    </h3>

                    <Select
                      name="type"
                      label="Êtes-vous un.e musicien.ne ou un groupe ?"
                      value={profile.type}
                      error={errors.type}
                      onChange={handleChange}
                    >
                      {types.map((type) => (
                        <option key={type.id} value={type.id} id={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </Select>

                    <Field
                      name="firstName"
                      label={(!groupEdit && "Votre Prénom ") || "Nom du Groupe"}
                      placeholder={
                        (!groupEdit && "Votre Prénom ") || "Le nom du Groupe"
                      }
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
                    <Select
                      name="departement"
                      label="Département"
                      value={profile.departement}
                      error={errors.departement}
                      onChange={handleChange}
                    >
                      {localizations.map((localization) => (
                        <option key={localization.id} value={localization.id}>
                          {localization.departement}
                        </option>
                      ))}
                    </Select>

                    <Accordion.Toggle
                      as={Button}
                      variant="primary"
                      eventKey="1"
                      onClick={() => {
                        setProgress("40");
                      }}
                      className={collapse}
                    >
                      Continuer
                    </Accordion.Toggle>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Collapse eventKey="1" className={step2Class}>

                  <Card.Body className="create_profil_card">
                    <h3 className={collapse}>
                      Super ! Maintenant quelques détails sur vous et votre
                      musique...
                    </h3>

                    {!groupEdit && (
                      <Select
                        name="instrument"
                        label="Instrument"
                        value={profile.instrument}
                        error={errors.instrument}
                        onChange={handleChange}
                      >
                        {instruments.map((instrument) => (
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
                      {styles.map((style) => (
                        <option key={style.id} value={style.id}>
                          {style.name}
                        </option>
                      ))}
                    </Select>

                    <Select
                      name="level"
                      label="Votre niveau"
                      value={profile.level}
                      error={errors.level}
                      onChange={handleChange}
                    >
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </Select>


                    <Accordion.Toggle
                      as={Button}
                      variant="link"
                      eventKey="0"
                      onClick={() => {
                        setProgress("15");
                      }}
                      className={collapse}
                    >
                      Retour
                    </Accordion.Toggle>

                    <Accordion.Toggle
                      as={Button}
                      variant="primary"
                      eventKey="2"
                      onClick={() => {
                        setProgress("65");
                      }}
                      className={collapse}
                    >
                      Continuer
                    </Accordion.Toggle>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Collapse eventKey="2" className={step3Class}>
                  <Card.Body className="create_profil_card">
                    <h3 className={collapse}>
                      Parfait ! quelques mots pour vous décrire ?
                    </h3>

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

                    <Accordion.Toggle
                      as={Button}
                      variant="link"
                      eventKey="1"
                      onClick={() => {
                        setProgress("40");
                      }}
                      className={collapse}
                    >
                      Retour
                    </Accordion.Toggle>

                    <Accordion.Toggle
                      as={Button}
                      variant="primary"
                      eventKey="3"
                      onClick={() => {
                        setProgress("90");
                      }}
                      className={collapse}
                    >
                      Continuer
                    </Accordion.Toggle>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Collapse eventKey="3" className="">
                  <Card.Body className="create_profil_card">
                    <h3 className={collapse}>Et pour finir ...</h3>

                    <div className="row mb-2">

                      <div className="col-8">
                        <Form.File
                          name="image"
                          label="Votre photo de profil"
                          onChange={handleFile}
                          formEncType="multipart/form-data"
                        />
                      </div>

                      <div className="col">
                        <span className="badge badge-success">{btnLabel}</span>
                      </div>

                    </div>

                    <Field
                      name="linkUrl"
                      label="Vous avez un site internet ou un profil facebook à partager ?"
                      placeholder="Lien vers votre site internet"
                      value={profile.linkUrl}
                      onChange={handleChange}
                    />

                    <Field
                      name="youtubeUrl"
                      label="Vous avez une video youtube que vous voulez montrer ?"
                      placeholder="Lien vers votre Video YouTube"
                      value={profile.youtubeUrl}
                      onChange={handleChange}
                    />

                    <div className="form-group">
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="2"
                        onClick={() => {
                          setProgress("65");
                        }}
                        className={collapse}
                      >
                        Retour
                      </Accordion.Toggle>

                      <button
                        onClick={handleSubmit}
                        className="btn btn-success"
                      >
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
