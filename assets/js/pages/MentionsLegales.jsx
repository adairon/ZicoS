//----------------------------------------------IMPORTS :

import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
//contexts: 
import LogedInModalContext from "../contexts/LogedInModalContext";
import AuthContext from "../contexts/AuthContext";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const MentionsLegales = ({ history }) => {
  //----------------------------------------------CONTEXTS :
  const { logedInModal, setLogedInModal } = useContext(LogedInModalContext);

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
                <title>Zicos : Mentions légales</title>
            </Helmet>

            <div className="bg-secondary py-4">
            <div className="container bg-light shadow rounded p-5">
                <h1>Mentions Légales</h1>
                <div className="mentions_legales text-justify">
                <h2 className="text-primary mt-3">
                    Propriété
                </h2>
                <p className="my-3">
                    Ce site internet a été développé et appartient à :
                </p>
                    Antoine Dairon <br/>
                    47 av du général Castelnau <br/>
                    31380 Montastruc La Conseillère <br/>
                    0664887817 <br/>
                    adairon@outlook.fr <br/>

                    <p className="my-3">
                        Les contenus diffusés sur ZicoS appartiennent à l'utilisateur qui les diffuse (voir <Link to="/terms">CGU</Link>). 
                        ZicoS se réserve toutefois le droit de les utiliser à des fins promotionnelles ou de communication.
                    </p>

                    <h2 className="text-primary mt-3">
                        Utilisation des données personnelles :
                    </h2>
                    Afin de créer un compte ZicoS, il est nécessaire de renseigner son adresse mail et sa date de naissance.
                    Une adresse mail est nécessaire pour permettre la mise en contact des différents utilisateurs de ZicoS et peut être utilisée par ZicoS à des fins de communication (promotion, modification des CGU ...) avec ses utilisateurs inscrits. <br/>
                    Ces données ne seront pas utilisées à des fins publicitaires ou commerciales. ces données ne sont pas transmises, communiquées ni vendues à des tiers

                    <h2 className="text-primary mt-3">
                        Hébergement : 
                    </h2>
                    Ce site est hébergé par O2switch 222-224 Boulevard Gustave Flaubert 63000 Clermont-Ferrand tel : 04 44 44 60 40 Capital de 100000€ Siret 510 909 80700024
                    <h2 className="text-primary mt-3">
                        Responsabilité:
                    </h2>
                    Le contenu diffusé sur ZicoS n'est pas modéré à priori (c'est à dire avant sa diffusion).
                    ZicoS ne peut être tenu responsable du contenu diffusé sur son site.
                    Toutefois, l'utilisateur s'engage à respecter les conditions générales d'utilisation avant de diffuser du contenu via ZicoS. Si du contenu ne respecte pas les CGU, ZicoS se réserve le droit de le supprimer voire de supprimer le compte de l'utilisateur.
                    Les contenus concernés sont les suivants :
                        <ul>
                            <li>photo de profil</li>
                            <li>textes de présentation</li>
                            <li>liens vers d'autres sites</li>
                            <li>contenu multimédia (video, audio)</li>
                        </ul>
                    <h2 className="text-primary mt-3">
                        Signalements :
                    </h2>

                    Vous pouvez nous signaler tout contenu qui ne respecterait pas les CGU en nous écrivant à cette adresse : 
                    <a  className="ml-1" href="mailto:adairon@outlook.fr"> 
                     adairon@outlook.fr
                  </a>

                </div>
            </div>
            </div>
        </>
     );
}
 
export default MentionsLegales;