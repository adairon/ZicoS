import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import userAPI from '../services/userAPI';
import Helmet from 'react-helmet';
import Profile from '../components/Profile';
import { Link } from 'react-router-dom';

const UserPage = (props) => {

    //On récupère l'id de l'utilisateur authentifié avec le contexte :
    const {userId} = useContext(UserContext);
    // STATES :
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [ typeGroupe, setTypeGroupe] = useState(false)
    const [ typeMusicien, setTypeMusicien] = useState(false)

    //on récupère les données du profil et on définit le type pour laffichage du bouton de modification
    const fetchUserProfile = async userId =>{
        try {
            const data = await userAPI.findOne(userId);
            // console.log(data);
            setUser(data);
            if(data.profile){
                // console.log("il y a un profil")
                if(data.profile.type.name === "groupe"){
                    // console.log("groupe")
                    setTypeGroupe(true)
                }else if (data.profile.type.name === "musicien.ne"){
                    // console.log("musicien")
                    setTypeMusicien(true)
                }
            }
            // else{console.log("pas de profil")}
            
            setLoading(false);
        } catch (error) {
            console.log(error.message)
        }
    };

    // On lance la fonction de récupération des infos du User au chargement du composant
    useEffect(() => {
        setLoading(true);
        fetchUserProfile(userId)
    }, [])


    return ( 
        <>
        {! loading && 
            <>
            <Helmet>
                <title>Zicos : mon compte </title>
            </Helmet>
            <div className="fondPage bg-secondary py-4">
                <div className="container bg-light shadow p-2">
                <h1>MON COMPTE</h1>
                
                <h2>Mes infos</h2>
                <ul>
                    <li>
                        mon email : {user.email}
                    </li>
                    {/* <li>
                        profile id : {user.profile.id}
                    </li> */}
                </ul>
                
                {!user.profile && 
                    //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                    <Link to="/users/profile/new" className="btn btn-primary">
                        Créer un profil ZicoS
                    </Link>
                }

                {typeMusicien && 
                    //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                    <Link to={"/users/profile/musicien/" + user.profile.id} className="btn btn-primary">
                        Modifier mon profil
                    </Link>
                }
                {typeGroupe && 
                    //Bouton de création de profil ne s'affiche que si l'utilisateur a un profil
                    <Link to={"/users/profile/band/" + user.profile.id} className="btn btn-primary">
                        Modifier mon groupe
                    </Link>
                }

                </div>
     
            
            </div>
            </>
        }
        </>
     );
}
 
export default UserPage;