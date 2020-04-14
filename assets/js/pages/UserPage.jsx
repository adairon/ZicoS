import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import Helmet from "react-helmet";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { toast } from "react-toastify";

import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";

import userAPI from "../services/userAPI";
import AuthAPI from "../services/authAPI";

import UserPageLoader from "../components/loaders/UserPageLoader";
import CssUserPageLoader from "../components/loaders/CssUserPageLoader";

const UserPage = ({ history }) => {
  //CONTEXTES :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId, setUserId } = useContext(UserContext);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  // STATES :
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [typeGroupe, setTypeGroupe] = useState(false);
  const [typeMusicien, setTypeMusicien] = useState(false);

  // Gestion de la modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //on récupère les données du profil et on définit le type pour l'affichage du bouton de modification. Si pas de profil : bouton de création
  const fetchUserProfile = async userId => {
    try {
      const data = await userAPI.findOne(userId);
      // console.log(data);
      setUser(data);
      if (data.profile) {
        // console.log("il y a un profil")
        if (data.profile.type.name === "groupe") {
          // console.log("groupe")
          setTypeGroupe(true);
        } else if (data.profile.type.name === "musicien.ne") {
          // console.log("musicien")
          setTypeMusicien(true);
        }
      }
      // else{console.log("pas de profil")}

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  //fonction pour gérer la suppression du compte :
  const handleDelete = id => {
    // console.log(id);
    //On supprime le compte
    axios.delete("http://localhost:8000/api/users/" + id);
    // .then(response => console.log(response));
    AuthAPI.logout();
    // on précise à l'application qu'on est déconnecté
    setIsAuthenticated(false);
    setUserId("");
    toast.error("Votre compte a bien été supprimé");
    // on se redirige vers la page d'accueil avec history
    history.push("/");
    // //TODO : NOTIF TOAST
  };

  // On lance la fonction de récupération des infos du User au chargement du composant
  useEffect(() => {
    setLoading(true);
    fetchUserProfile(userId);
  }, []);

  return (
    <>
      <Helmet>
        <title>Zicos : mon compte </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>MON COMPTE</h1>
          <h2>Mes infos</h2>
          

          {loading && <CssUserPageLoader/>}
          
          {!loading && (
            <>
              <div className="profile_info alert alert-secondary">
                <h3>Mon adresse email :</h3>
                <span className="badge badge-black user_email">
                  {user.email}
                </span>
              </div>

              {!user.profile && (
                //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                <Link to="/users/profile/new" className="btn btn-primary">
                  Créer un profil ZicoS
                </Link>
              )}
              <div className="d-flex justify-content-center">
                {typeMusicien && (
                  //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                  <Link
                    to={"/users/profile/musicien/" + user.profile.id}
                    className="btn btn-primary m-4"
                  >
                    Modifier mon profil
                  </Link>
                )}

                {typeGroupe && (
                  //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                  <Link
                    to={"/users/profile/band/" + user.profile.id}
                    className="btn btn-primary m-4"
                  >
                    Modifier le profil de mon groupe
                  </Link>
                )}

                <Button variant="danger" onClick={handleShow} className="m-4">
                  Supprimer mon compte
                </Button>

                <Modal show={show} onHide={handleClose} animation={false}>
                  <Modal.Header closeButton className="bg-danger text-light">
                    <Modal.Title>Attention !</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Cette action ne supprime pas seulement votre profil mais
                    aussi votre compte ZicoS. <br />
                    Êtes-vous certain.e de vouloir supprimer votre compte ?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Finalement non
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Supprimer mon compte
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* <button
                  className="btn btn-danger m-4"
                  onClick={() => handleDelete(user.id)}
                >
                  Supprimer mon compte
                </button> */}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
