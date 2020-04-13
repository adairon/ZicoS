//----------------------------------------------IMPORTS :

import React, { useContext, useEffect } from "react";

import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";

import { toast } from "react-toastify";

import bigLogo from "../../images/logos/ZicoS-grey.png";

import LogedInModalContext from "../contexts/LogedInModalContext";

import AuthContext from "../contexts/AuthContext";
import LoginModal from "../components/LoginModal";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const HomePage = ({ history }) => {
  //CONTEXTS :
  const { logedInModal, setLogedInModal } = useContext(LogedInModalContext);
  const { isAuthenticated } = useContext(AuthContext);

  //----------------------------------------------EFFECTS :

  useEffect(() => {
    if (logedInModal) {
      setLogedInModal(false);
      // Notification Toast :
      toast.success("Vous êtes connecté ! À vous de jouer 🎸 🎹");
      history.push("/profils");
    }
  }, [logedInModal]);

  //----------------------------------------------RETURN :
  
  return (
    <>
      <Helmet>
        <title>Zicos : accueil</title>
      </Helmet>
      <div className="homeContainer">
        <div className="homeDiv home1">
          <div className="container">
            <div className="row justify-content-center">
              <figure className="pt-4 m-0 col-12 d-flex">
                <img className="bigLogo" src={bigLogo} alt="ZicoS" />
              </figure>
            </div>
            <div className="home_text d-flex mt-2 mb-4">
              <p className="m-auto text-center">
                Rencontrez des musiciens.nes, <br />
                Rejoignez un groupe : <br />
                Faites de la musique ! <br />
              </p>
            </div>
            {(!isAuthenticated && (
              <>
                <div className="login_link d-flex justify-content-center my-4">
                  <Link
                    to="/register"
                    type="button"
                    className="btn btn-primary mx-2"
                  >
                    Je veux m'inscrire !
                  </Link>
                </div>
                <div className="login_link d-flex justify-content-center my-4">
                  <LoginModal
                    libBtn="J'ai déjà un compte"
                    variant="secondary"
                  />
                </div>
              </>
            )) || (
              <>
                <div className="login_link d-flex justify-content-center my-4">
                  <Link to="/profils" className="btn btn-primary mx-2">
                    Voir les Profils
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="homeDiv home2">
          <div className="container">
            <div className="row justify-content-end">
              <h2 className="pt-5 home_title col-lg-8 col-md-12 col-sm-12 text-center">
                Musicien.ne reherche groupe
              </h2>
            </div>
            <div className="home_text row justify-content-start">
              <p className="text-center col-lg-6 col-md-12 col-sm-12">
                Grace à ZicoS, trouvez un groupe près de chez vous qui vous
                ressemble.
              </p>
            </div>
          </div>
        </div>
        <div className="homeDiv home3">
          <div className="container">
            <div className="row justify-content-start">
              <h2 className="pt-5 home_title col-lg-8 col-md-12 col-sm-12 text-center">
                Groupe recherche musicien.ne
              </h2>
            </div>
            <div className="home_text row justify-content-end">
              <p className="text-center col-lg-6 col-md-12 col-sm-12">
                Avec ZicoS, trouvez les musiciens.nes dont vous avez besoin et
                intégrez un nouveau membre à votre groupe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
