//----------------------------------------------IMPORTS :

import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import LogedInModalContext from "../contexts/LogedInModalContext";
import AuthContext from "../contexts/AuthContext";

const AboutZicos = ({ history }) => {
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
    return ( <>
        <Helmet>
            <title>Zicos : à propos</title>
        </Helmet>
        <div className="aboutContainer">
            <div className="about1 p-5 d-flex flex-column align-items-center justify-content-center">
                <h1 className="mb-5">À propos de ZicoS ...</h1>
                <h2 className="my-5">Vous êtes musicen, musicienne ?</h2>
                <div className="about_text mx-5 text-justify">
                    Avez-vous déjà essayé -  sans contacts ni réseau - de trouver un groupe avec qui jouer ? Pas n'importe quel groupe mais un groupe qui vous ressemble, qui a les mêmes inspirations, le même style de musique que vous. Un groupe qui est proche de chez vous. Mais aussi, un groupe qui recherche quelqu'un comme vous ?
                    Alors, bienvenue sur ZicoS !
                    ZicoS est l'endroit idéal pour chercher et trouver ce groupe. Ici, vous pourrez chercher et filtrer parmi tous nos profils pour trouver et contacter ce groupe, votre futur groupe. <br/>
                    N'attendez plus, <Link to="/register"> inscrivez-vous </Link> et créez votre profil !
                </div>
            </div>
            <div className="about2 p-5 d-flex flex-column align-items-center justify-content-center">
                <h2 className="my-5"> Vous êtes un groupe ? </h2>
                <div className="about_text mx-5 text-justify">
                    Vous avez besoin d'un nouveau membre dans votre équipe. Malheureusement, dans votre entourage - proche ou éloigné - personne ne correspond à ce que vous cherchez. Vous avez besoin de quelqu'un qui a les mêmes influences, qui joue le même style de musique et surtout, du bon instrument ! Vous avez besoin d'un nouveau membre qui soit près de chez vous, de votre lieu de rassemblement, de répétition.
                    Alors, bienvenu sur ZicoS !
                    Vous trouverez ici ce musicien ou cette musicienne tant recherché.e. Sur ZicoS, vous pourrez chercher et filtrer parmi tous nos profils de musiciens et musicennes et contacter le futur membre de votre groupe. <br/>
                    N'attendez plus, <Link to="/register"> inscrivez-vous </Link> et créez le profil de votre groupe !
                </div>
                <Link to="/" className="btn btn-secondary mx-auto my-4">
                    Revenir à l'accueil
                </Link>
            </div>
        </div>


    </> );
}
 
export default AboutZicos;