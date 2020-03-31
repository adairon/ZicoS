import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const ProfilesPageWithPagination = props => {
  // on créé un state pour les profiles
  const [profiles, setProfiles] = useState([]);
  //state pour gérer la page en cours (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  // state pour gérer le nb total de profils :
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);

  //combien de profils on veut par page :
  const itemsPerPage = 9;

  //On lance un "effet" au chargement d'une nouvelle page : requête axios en GET sur les profils
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/profils?pagination=true&items_per_page=${itemsPerPage}&page=${currentPage}`
      )
      .then(response => {
        setProfiles(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch(error => console.log(error.response));
  }, [currentPage]);

  // fonction pour gérer le changement de page (pagination)
  const handlePageChange = page => {
    setCurrentPage(page);
    setLoading(true);
  };

  //pour gérer les profils à afficher par page :
  const paginatedProfiles = Pagination.getData(
    profiles,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des ZicoS (Pagination API)</h1>

      <div className="card-deck">

        {loading && (
          <div className="card">
            <h5 className="card-title">Chargement...</h5>
          </div>
        )}

        {!loading && profiles.map(profile => (
          <div key={profile.id} className="card bg-dark text-white">
            <img className="card-img" src={profile.urlPhoto} alt="Card image" />
            <div className="card-img-overlay">
              <a href="#">
                <h5 className="card-title">
                  {profile.prenom} {profile.nom}
                </h5>
                <p className="card-text">{profile.type.type}</p>
                <p className="card-text">{profile.localisation.region}</p>
              </a>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default ProfilesPageWithPagination;
