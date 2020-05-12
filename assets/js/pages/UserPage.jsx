//----------------------------------------------IMPORTS :
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Helmet from "react-helmet";
import { toast } from "react-toastify";
//bootstrap:
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
//contexts:
import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
//API:
import userAPI from "../services/userAPI";
import AuthAPI from "../services/authAPI";
//components:
import CssUserPageLoader from "../components/loaders/CssUserPageLoader";
import { USERS_API } from "../config";

//----------------------------------------------FUNCTIONNAL COMPONENT : 
const UserPage = ({ history }) => {
  //----------------------------------------------CONTEXTS :

  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId, setUserId } = useContext(UserContext);
  const { setIsAuthenticated } = useContext(AuthContext);

  //----------------------------------------------STATES:
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [typeGroupe, setTypeGroupe] = useState(false);
  const [typeMusicien, setTypeMusicien] = useState(false);

  //----------------------------------------------FUNCTIONS :
  // Gestion de la modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //on récupère les données du profil et on définit le type pour l'affichage du bouton de modification. Si pas de profil : bouton de création
  const fetchUserProfile = async (userId) => {
    try {
      const data = await userAPI.findOne(userId);
      setUser(data);
      if (data.profile) {
        if (data.profile.type.name === "groupe") {
          setTypeGroupe(true);
        } else if (data.profile.type.name === "musicien.ne") {
          setTypeMusicien(true);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  //fonction pour gérer la suppression du compte :
  const handleDelete = (id) => {
    //// console.log(id);
    //On supprime le compte
    axios.delete(USERS_API + "/" + id);
    AuthAPI.logout();
    // on précise à l'application qu'on est déconnecté
    setIsAuthenticated(false);
    setUserId("");
    toast.error("Votre compte a bien été supprimé");
    // on se redirige vers la page d'accueil avec history
    history.push("/");
  };

  //----------------------------------------------EFFECTS :
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

          {loading && <CssUserPageLoader />}

          {!loading && (
            <>
              <div className="profile_info alert alert-secondary">
                <h3>Mon adresse email :</h3>
                <span className="badge badge-black user_email">
                  {user.email}
                </span>
              </div>

              <div className="d-flex justify-content-center">

                {!user.profile && (
                  //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                  <Link to="/users/profile/new" className="btn btn-success m-4">
                    Créer un profil ZicoS
                  </Link>
                )}

                {typeMusicien && (
                  //Bouton de modification du profil si mucicien
                  <Link
                    to={"/users/profile/musicien/" + user.profile.id}
                    className="btn btn-primary m-4"
                  >
                    Modifier mon profil
                  </Link>
                )}

                {typeGroupe && (
                  //Bouton de modification du profil si groupe
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

                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton className="bg-danger text-light">
                    <Modal.Title>Attention !</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Cette action ne supprime pas seulement votre profil mais
                    aussi votre compte ZicoS. <br />
                    Êtes-vous certain.e de vouloir supprimer votre compte ?
                  </Modal.Body>
                  <Modal.Footer>

                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Supprimer mon compte
                    </Button>

                    <Button variant="secondary" onClick={handleClose}>
                      Finalement non
                    </Button>

                  </Modal.Footer>
                </Modal>

              </div>

              <div className="d-flex justify-content-center">
                <Link className="btn btn-outline-black my-3" to="/profils">
                  Retour aux profils
                </Link>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
