//----------------------------------------------IMPORT :
import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import logoProfiles from "../../images/logos/ZicoS.png";

import UserContext from "../contexts/UserContext";
import UserProfileContext from "../contexts/UserProfileContext";

import ProfilesAPI from "../services/profilesAPI";
import TypeAPI from "../services/typeAPI";
import StylesAPI from "../services/stylesAPI";
import userAPI from "../services/userAPI";

import ProfilesCards from "../components/ProfilesCards";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import Axios from "axios";
import ProfilesCardsLoader from "../components/loaders/ProfilesCardsLoader";

const ProfilesPage = props => {
  //----------------------------------------------CONTEXTES : 
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  const {userProfileId, setUserProfileId} = useContext(UserProfileContext)
  
  //----------------------------------------------STATES :
  // states pour les données récupérées via requêtes axios :
  const [profiles, setProfiles] = useState([]);
  const [types, setTypes] = useState([]);
  const [styles, setStyles] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  //state pour gérer la page en cours (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  // state pour gérer la recherche
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);

 /* =========================== FONCTIONS REQUETES API ========================== */

 let source = Axios.CancelToken.source()
 
  // fonction asynchrone à utiliser dans le useEffect pour récupérer les profils
  const fetchProfiles = async () => {
    try {
      const data = await ProfilesAPI.findAll({cancelToken: source.token});
      setProfiles(data);
      // console.log(data);
      setLoading(false);
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      }
    }
  };
  // Pour récupérer les types de profil
  const fetchTypes = async () => {
    try {
      const dataType = await TypeAPI.findAll({cancelToken: source.token});
      setTypes(dataType);
      // console.log(dataType)
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      }
    }
  };
  // Pour récupérer les styles de musique :
  const fetchStyles = async () => {
    try {
      const dataStyle = await StylesAPI.findAll({cancelToken: source.token});
      setStyles(dataStyle);
      //   console.log(dataStyle);
    } catch (error) {
      if (Axios.isCancel(error)){
        console.log("request cancelled")
      } else {
        console.log(error.response);
      }
    }
  };

  //Pour savoir si le user authentifié à un profil :
  const fetchUserProfile = async userId => {
    try {
      const data = await userAPI.findOne(userId);
      // console.log(data)
      if(data.profile){
        setUserProfileId(data.profile.id)
      }else{
        setShow(true)
      }
    }catch(error){
      console.log(error.response);
    }
  }

  //----------------------------------------------EFFETS :
  //On lance un "effet" au chargement du composant pour récupérer les données
  useEffect(() => {
    fetchProfiles();
    fetchTypes();
    fetchStyles();
    fetchUserProfile(userId)
    return ()=>{
      source.cancel()
    }
  }, []);

  /* ==================================GESTION DES DISPLAYS==============================*/


   /*------------------------------GESTION DE LA RECHERCHE------------------------------ */
  // gestion de la recherche
  const handleSearch = ({ currentTarget }) => setSearch(currentTarget.value);
  const handleClick = ({ currentTarget }) => {
    filter.push(currentTarget.id);
    setSearch(currentTarget.id);
    console.log(filter);
  };
  const showSearch = () => setSearch("");

  const cleanFilter = () => setSearch("");

  // Filtrage des profils en fonction de la recherche
  const filteredProfiles = profiles.filter(
    p =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.type.name.toLowerCase().includes(search.toLowerCase()) ||
      p.localization.region.toLowerCase().includes(search.toLowerCase()) ||
      p.localization.departement.toLowerCase().includes(search.toLowerCase()) ||
      p.level.name.toLowerCase().includes(search.toLowerCase()) ||
      p.instrument.name.toLowerCase().includes(search.toLowerCase()) ||
      p.style.name.toLowerCase().includes(search.toLowerCase())
  );
  /*------------------------------GESTION PAGINATION-------------------------------- */
 
   // Gestion du changement de page
   const handlePageChange = page => setCurrentPage(page);

   // Nb de profils par page :
   const itemsPerPage = 12;
   
  //Pagination des données
  const paginatedProfiles =
    filteredProfiles.length > itemsPerPage
      ? Pagination.getData(filteredProfiles, currentPage, itemsPerPage)
      : filteredProfiles;

  /*----------------------------- GESTION MODAL --------------------------------------- */
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*======================================= VIEW ========================================= */
  return (
    <>
      <Helmet>
        <title>Zicos : Profils</title>
      </Helmet>
      <div className="bg-secondary">
        <div className="container">
          <div className="Profiles_title pt-3">
            <div className="logo_title d-flex justify-content-center align-items-center">
              <h1 className="mr-2">Profils de </h1>
              <figure className="ml-2 mb-0">
                <img className="bigLogo_Profiles" src={logoProfiles} alt="ZicoS" />
              </figure>
            </div>
            <p className="text-center">Cherchez, trouvez, jouez !</p>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-dark">
              <Modal.Title>
                <h2 className="text-light">Vous n'avez pas encore de Profil !</h2>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Un profil est nécessaire afin de pouvoir contacter les groupes et musiciens.nes déjà inscrits</p>
              <p className="text-primary">Voulez-vous créer votre profil maintenant ?</p>
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

          {/* ----------------------- Menus dropdowns ------------------------ */}
          {/* <div className="form-group">

            <button type="button" className="btn btn-danger mx-1" onClick={cleanFilter}>
                  Effacer les filtres
            </button> */}
            {/* ---- Filtre Par Type ------ */}
            {/* <div
              className="btn-group my-3 mx-1"
              role="group"
              aria-label="Button group with nested dropdown"
            >
              <button type="button" className="btn btn-primary">
                Type de profil
          </button>
              <div className="btn-group" role="group">
                <button
                  id="btnGroupDrop1"
                  type="button"
                  className="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                ></button>

                <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                  <button
                    className="dropdown-item font-weight-bold"
                  // onClick={handleClick}
                  >
                    Tous
              </button>
                  {types.map(type => (
                    <button
                      key={type.id}
                      className="dropdown-item"
                      onClick={handleClick}
                      id={type.name}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
          {/* ========================= RECHERCHE ================================ */}
          {/* <button
            className="btn btn-secondary mx-auto my-3"
            id="btnRecherche"
            type="button"
            data-toggle="collapse"
            data-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={showSearch}
          >
            Recherche
      </button>

          <div className="collapse" id="collapseExample"> */}
            {/*  ---------------------- Champs de recherche ---------------------- */}
            {/* <div className="form-group">
              <input
                type="text"
                onChange={handleSearch}
                value={search}
                className="form-control"
                placeholder="Rechercher..."
              />
            </div>
          </div> */}

          {/*  =============================== PROFILS ============================ */}
          
          {!loading && <ProfilesCards paginatedProfiles={paginatedProfiles} />}

          {loading && <ProfilesCardsLoader/>}


          {/* ================== PAGINATION ============================== */}

          {itemsPerPage < filteredProfiles.length && (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              length={filteredProfiles.length}
              onPageChanged={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilesPage;
