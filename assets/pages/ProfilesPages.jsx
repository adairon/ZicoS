import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

import ProfilesAPI from "../services/profilesAPI";
import TypeAPI from "../services/typeAPI";
import StylesAPI from "../services/stylesAPI";

import ProfilesCards from "../components/ProfilesCards";

import logoProfiles from "../images/logos/ZicoS.png";

const ProfilesPage = props => {
  // states pour les données récupérées via requêtes axios :
  const [profiles, setProfiles] = useState([]);
  const [types, setTypes] = useState([]);
  const [styles, setStyles] = useState([]);

  //state pour gérer la page en cours (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  // state pour gérer la recherche
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);

  // fonction asynchrone à utiliser dans le useEffect pour récupérer les profils
  const fetchProfiles = async () => {
    try {
      const data = await ProfilesAPI.findAll();
      setProfiles(data);
      // console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };
  // Pour récupérer les types de profil
  const fetchTypes = async () => {
    try {
      const dataType = await TypeAPI.findAll();
      setTypes(dataType);
      // console.log(dataType)
    } catch (error) {
      console.log(error.response);
    }
  };
  // Pour récupérer les styles de musique :
  const fetchStyles = async () => {
    try {
      const dataStyle = await StylesAPI.findAll();
      setStyles(dataStyle);
      //   console.log(dataStyle);
    } catch (error) {
      console.log(error.response);
    }
  };

  //On lance un "effet" au chargement du composant pour récupérer les données
  useEffect(() => {
    fetchProfiles();
    fetchTypes();
    fetchStyles();
  }, []);

  // Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // Nb de profils par page :
  const itemsPerPage = 12;

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

  //Pagination des données
  const paginatedProfiles =
    filteredProfiles.length > itemsPerPage
      ? Pagination.getData(filteredProfiles, currentPage, itemsPerPage)
      : filteredProfiles;

  return (
    <>
      <div className="bg-dark">
        <div className="container">
          <div className="Profiles_title pt-3 text-white">
            <div className="logo_title d-flex justify-content-center align-items-center">
              <h1 className="mr-2">Profils de </h1>
              <figure className="ml-2 mb-0">
                <img className="bigLogo_Profiles" src={logoProfiles} alt="ZicoS" />
              </figure>
            </div>
            <p className="text-center">Cherchez, trouvez, contactez</p>
          </div>

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
                  id={type.type}
                >
                  {type.type}
                </button>
              ))}
            </div>
          </div>
        </div> */}
          {/* ---- Filtre Par Style ------ */}
          {/* <div
          className="btn-group my-3 mx-1"
          role="group"
          aria-label="Button group with nested dropdown"
        >
          <button type="button" className="btn btn-primary">
            Style de Musique
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
                // onClick={}
              >
                Tous
              </button>
              {styles.map(style => (
                <button
                  key={style.id}
                  className="dropdown-item"
                  onClick={handleClick}
                  id={style.style}
                >
                  {style.style}
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

          <ProfilesCards paginatedProfiles={paginatedProfiles} />


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
