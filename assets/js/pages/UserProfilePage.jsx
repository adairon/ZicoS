import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import userAPI from '../services/userAPI';

const userProfilePage = (props) => {
    //On récupère l'id de l'utilisateur authentifié
    const {userId} = useContext(UserContext);
    const [userProfile, setUserProfile] = useState({})
    const [loading, setLoading] = useState(true);

    //on récupère les données du profil
    const fetchUserProfile = async userId =>{
        try {
            const data = await userAPI.findOne(userId);
            console.log(data)
            setUserProfile(data);
            setLoading(false);
        } catch (error) {
            console.log(error.message)
        }
    };
    // On lance la fonction de récupération des infos du User au chargement du composant
    useEffect(() => {
        fetchUserProfile(userId)
    }, [])


    return ( 
        <>
        {! loading && 
        
            <h1>Profil de {userProfile.profile.firstName} </h1>
        }
        </>
     );
}
 
export default userProfilePage;