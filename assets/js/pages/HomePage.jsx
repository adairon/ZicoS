import React from "react";
import bigLogo from "../../images/logos/ZicoS-grey.png";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import LoginModal from "../components/LoginModal";


const HomePage = props => {
  return (
    <>
  
      <Helmet>
        <title>Zicos : Jouez !</title>
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

            {/* <div className="register_links d-flex flex-wrap justify-content-center my-4">
              <div className="btn-group mx-2" role="group" aria-label="Button group with nested dropdown">
                <button type="button" className="btn btn-dark">
                  Je suis ...
                </button>
                <div className="btn-group" role="group">
                  <button id="btnGroupDrop1" type="button" className="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  </button>
                  <div className="dropdown-menu bg-dark" aria-labelledby="btnGroupDrop1">
                    <a className="dropdown-item text-lightgrey dropdown_home1 text-white" href="#">
                      Musicien.ne
                    </a>
                    <a className="dropdown-item text-lightgrey dropdown_home1 text-white" href="#">
                      un Groupe
                    </a>
                  </div>
                </div>
              </div>
              <button type="button" className="btn btn-dark mx-2">C'est parti !</button>
            </div> */}
            <div className="login_link d-flex justify-content-center my-4">
              <Link to="/register" type="button" className="btn btn-primary mx-2">
                Je veux m'inscrire !
              </Link>
            </div>
            <div className="login_link d-flex justify-content-center my-4">
              <LoginModal />
            </div>


            {/* <div className="login_link d-flex justify-content-center my-4">
              <Link to="/login" type="button" className="btn btn-secondary mx-2">
                J'ai déjà un compte
              </Link>
            </div> */}
            
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
                Grace à ZicoS, trouvez un
                groupe près de chez vous
                qui vous ressemble.
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
                Avec ZicoS, trouvez les musiciens.nes
                dont vous avez besoin
                et intégrez un nouveau membre à votre groupe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
