//----------------------------------------------IMPORTS :
import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Axios from "axios";
//react bootstrap:
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Collapse from "react-bootstrap/Collapse";
import Badge from 'react-bootstrap/Badge'
//contexts:
import UserContext from "../contexts/UserContext";
import UserProfileContext from "../contexts/UserProfileContext";
//API:
import ProfilesAPI from "../services/profilesAPI";
import TypeAPI from "../services/typeAPI";
import StylesAPI from "../services/stylesAPI";
import userAPI from "../services/userAPI";
import levelsAPI from "../services/levelsAPI";
import instrumentsAPI from "../services/instrumentsAPI";
import localizationAPI from "../services/localizationAPI";
//components
import ProfilesCards from "../components/ProfilesCards";
import Pagination from "../components/Pagination";
import CssProfilesCardsLoader from "../components/loaders/CssProfileCardsLoader";
//images:
import logoProfiles from "../../images/logos/ZicoS.png";

//----------------------------------------------FUNCTIONNAL COMPONENT : 
const ProfilesPage = (props) => {
  //----------------------------------------------CONTEXTES :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  const { setUserProfileId } = useContext(UserProfileContext);

  //----------------------------------------------STATES :
  // states pour les données récupérées via requêtes axios :
  const [profiles, setProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([])
  const [types, setTypes] = useState([]);
  const [styles, setStyles] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true);
  //state pour gérer la page en cours (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  // state pour gérer la recherche
  const [search, setSearch] = useState("");
  const [libFilterType, setLibFilterType] = useState("")
  const [disableTypeBtn, setDisableTypeBtn] = useState(false)
  const [libFilterStyle, setLibFilterStyle] = useState("")
  const [disableStyleBtn, setDisableStyleBtn] = useState(false)
  const [libFilterInstrument, setLibFilterInstrument] = useState("")
  const [disableInstrumentBtn, setDisableInstrumentBtn] = useState(false)
  const [libFilterLevel, setLibFilterLevel] = useState("")
  const [disableLevelBtn, setDisableLevelBtn] = useState(false)
  const [libFilterLocalization, setLibFilterLocalization] = useState("")
  const [disableLocalizationBtn, setDisableLocalizationBtn] = useState(false)
  const [libSearchBtn, setlibSearchBtn] = useState("Rechercher")

  /* =========================== FONCTIONS REQUETES API ========================== */

  let source = Axios.CancelToken.source();

  // fonction asynchrone à utiliser dans le useEffect pour récupérer les profils
  const fetchProfiles = async () => {
    try {
      const data = await ProfilesAPI.findAll({ cancelToken: source.token });
      setProfiles(data);
      setAllProfiles(data);
      setLoading(false);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      }
    }
  };
  // Pour récupérer les types de profil
  const fetchTypes = async () => {
    try {
      const dataType = await TypeAPI.findAll({ cancelToken: source.token });
      setTypes(dataType);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      }
    }
  };
  // Pour récupérer les styles de musique :
  const fetchStyles = async () => {
    try {
      const dataStyle = await StylesAPI.findAll({ cancelToken: source.token });
      setStyles(dataStyle);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      }
    }
  };
  // Pour récupérer les instruments de musique :
  const fetchInstruments = async () => {
    try {
      const dataInstrus = await instrumentsAPI.findAll({
        cancelToken: source.token,
      });
      setInstruments(dataInstrus);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
      }
    }
  };
  // Pour récupérer les localizations :
  const fecthLocalizations = async () => {
    try {
      const dataLocals = await localizationAPI.findAll({
        cancelToken: source.token,
      });
      setLocalizations(dataLocals);
    } catch (error) {
      console.log(error.response);
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

  //Pour savoir si le user authentifié à un profil :
  const fetchUserProfile = async (userId) => {
    try {
      const data = await userAPI.findOne(userId);
      if (data.profile) {
        setUserProfileId(data.profile.id);
      } else {
        setShow(true);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  //----------------------------------------------EFFECTS :
  //On lance un "effet" au chargement du composant pour récupérer les données
  useEffect(() => {
    fetchProfiles();
    fetchTypes();
    fetchStyles();
    fetchInstruments();
    fecthLocalizations();
    fetchLevels();
    fetchUserProfile(userId);
    return () => {
      source.cancel();
    };
  }, []);

  /*------------------------------GESTION FILTRES & RECHERCHE -------------------------------- */

  //pour ouvrir le menu de recherche
  const [open, setOpen] = useState(false);

  const handleFilter = ({ currentTarget }) => {
    setSearch(currentTarget.id);
    setCurrentPage(1);
    setProfiles(searchedProfiles)
  };

  const handleFilterType = ({currentTarget}) => {
    setLibFilterType(currentTarget.id);
    setDisableTypeBtn(true)
    handleFilter({currentTarget})
  }
  const handleFilterStyle = ({currentTarget}) => {
    setLibFilterStyle(currentTarget.id);
    setDisableStyleBtn(true)
    handleFilter({currentTarget})
  }
  const handleFilterInstru = ({currentTarget}) => {
    setLibFilterInstrument(currentTarget.id);
    setDisableInstrumentBtn(true)
    handleFilter({currentTarget})
  }
  const handleFilterLocal = ({currentTarget}) => {
    setLibFilterLocalization(currentTarget.id);
    setDisableLocalizationBtn(true)
    handleFilter({currentTarget})
  }
  const handleFilterLevel = ({currentTarget}) => {
    setLibFilterLevel(currentTarget.id)
    setDisableLevelBtn(true)
    handleFilter({currentTarget})
  }

  const searchedProfiles = profiles.filter(
    (p) =>
      p.type.name.toLowerCase().includes(search.toLowerCase()) ||
      p.style.name.toLowerCase().includes(search.toLowerCase()) ||
      p.localization.departement.toLowerCase() === search.toLowerCase() ||
      (p.instrument && p.instrument.name.toLowerCase() === search.toLowerCase()) ||
      (p.level && p.level.name.toLowerCase() === search.toLowerCase())
  );

  const cancelFilters = () => {
    setSearch("")
    setLibFilterType("")
    setLibFilterStyle("")
    setLibFilterInstrument("")
    setLibFilterLevel("")
    setLibFilterLocalization("")
    setDisableTypeBtn(false)
    setDisableStyleBtn(false)
    setDisableInstrumentBtn(false)
    setDisableLevelBtn(false)
    setDisableLocalizationBtn(false)
    setProfiles(allProfiles)
  }

  /*------------------------------GESTION PAGINATION-------------------------------- */

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  // Nb de profils par page :
  const itemsPerPage = 12;

  //Pagination des données
  const paginatedProfiles = Pagination.getData(
    searchedProfiles,
    currentPage,
    itemsPerPage
  );

  /*----------------------------- GESTION MODAL --------------------------------------- */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*======================================= RETURN ========================================= */
  return (
    <>
      <Helmet>
        <title>Zicos : Profils</title>
      </Helmet>

      <div className="bg-secondary py-4">
        <div className="container">
          <div className="Profiles_title pt-3">
            <div className="logo_title d-flex justify-content-center align-items-center">
              <h1 className="mr-2">Profils de </h1>
              <figure className="ml-2 mb-0">
                <img
                  className="bigLogo_Profiles"
                  src={logoProfiles}
                  alt="ZicoS"
                />
              </figure>
            </div>
            <p className="text-center">Cherchez, trouvez, jouez !</p>
          </div>

          {/* ------------------------------------------ Modal si pas de profil ---------------------------------------- */}

          <Modal show={show} onHide={handleClose} centered>

            <Modal.Header closeButton className="bg-primary">
              <Modal.Title>
                <h2 className="text-light">
                  Vous n'avez pas encore de Profil !
                </h2>
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                Un profil est nécessaire afin de pouvoir contacter les groupes
                et musiciens.nes déjà inscrits
              </p>
              <p className="text-primary">
                Voulez-vous créer votre profil maintenant ?
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Link to="/users/profile/new" className="btn btn-primary">
                Oui ! Allons-y !
              </Link>

              <Button variant="secondary" onClick={handleClose}>
                Non, pas maintenant.
              </Button>
            </Modal.Footer>
          </Modal>

          {/* ---------------------------------------- FILTRES ---------------------------------------- */}
          <div className="row justify-content-center my-3">
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              {libSearchBtn}
            </Button>
          </div>

          <Collapse 
            in={open}
            onEntered={()=>{setlibSearchBtn("fermer la recherche")}}
            onExited={()=>{setlibSearchBtn("rechercher")}}
            >

            <div id="example-collapse-text">
              <div className="row justify-content-center">
                <DropdownButton
                  variant="outline-black"
                  id="dropdown-basic-button"
                  title="Types de profil"
                  className="mx-3 my-2"
                  disabled={disableTypeBtn}
                >
                  {types.map((type) => (
                    <Dropdown.Item
                      key={type.id}
                      value={type.name}
                      id={type.name}
                      onClick={handleFilterType}
                    >
                      {type.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                <DropdownButton
                  variant="outline-black"
                  id="dropdown-basic-button"
                  title="Styles de musique"
                  className="mx-3 my-2"
                  disabled={disableStyleBtn}
                >
                  {styles.map((style) => (
                    <Dropdown.Item
                      key={style.id}
                      value={style.name}
                      id={style.name}
                      onClick={handleFilterStyle}
                    >
                      {style.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                <DropdownButton
                  variant="outline-black"
                  id="dropdown-basic-button"
                  title="Instruments de musique"
                  className="mx-3 my-2"
                  disabled={disableInstrumentBtn}
                >
                  {instruments.map((instru) => (
                    <Dropdown.Item
                      key={instru.id}
                      value={instru.name}
                      id={instru.name}
                      onClick={handleFilterInstru}
                    >
                      {instru.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                <DropdownButton
                  variant="outline-black"
                  id="dropdown-basic-button"
                  title="Niveau"
                  className="mx-3 my-2"
                  disabled={disableLevelBtn}
                >
                  {levels.map((level) => (
                    <Dropdown.Item
                      key={level.id}
                      value={level.name}
                      id={level.name}
                      onClick={handleFilterLevel}
                    >
                      {level.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                <DropdownButton
                  variant="outline-black"
                  id="dropdown-basic-button"
                  title="Département"
                  className="mx-3 my-2 scrollable-menu"
                  disabled={disableLocalizationBtn}
                >
                  {localizations.map((localization) => (
                    <Dropdown.Item
                      key={localization.id}
                      value={localization.departement}
                      id={localization.departement}
                      onClick={handleFilterLocal}
                    >
                      {localization.departement}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
              {/* -------------------- Badges des filtres sélectionnés ------------------ */}
              <div className="row justify-content-center my-3">
                <Badge variant="primary" className="mx-5 my-2">
                  {libFilterType}
                </Badge>
                <Badge variant="primary" className="mx-5 my-2">
                  {libFilterStyle}
                </Badge>
                <Badge variant="primary" className="mx-5 my-2">
                  {libFilterInstrument}
                </Badge>
                <Badge variant="primary" className="mx-5 my-2">
                  {libFilterLevel}
                </Badge>
                <Badge variant="primary" className="mx-5 my-2">
                  {libFilterLocalization}
                </Badge>
              </div>

              <div className="row justify-content-center my-3">
                <Button
                  variant="warning"
                  onClick={cancelFilters}
                >
                  Effacer les filtres
                </Button>
              </div>
            </div>
          </Collapse>

          {/*  ---------------------------------------- PROFILS ---------------------------------------- */}
          {loading && <CssProfilesCardsLoader/>}

          {!loading && <ProfilesCards paginatedProfiles={paginatedProfiles} />}

          {(!loading && !searchedProfiles.length) && 
            <>
              <div className="m-5 p-5 bg-light shadow rounded">
                <h2 className="text-center">
                  Malheureusement, aucun profil ne correspond à votre recherche
                </h2>

                <div className="row justify-content-center my-3">
                  <Button
                    variant="primary"
                    onClick={cancelFilters}
                  >
                    Voir tous les profils
                  </Button>
                </div>
              </div>
            </>
          }
          {/* ---------------------------------------- PAGINATION ---------------------------------------- */}
          {itemsPerPage < searchedProfiles.length && (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              length={searchedProfiles.length}
              onPageChanged={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilesPage;
