import React, { useContext, useEffect, useState } from 'react';
import UserContext from "../contexts/UserContext";
import userAPI from "../services/userAPI";
import { Link } from "react-router-dom";

const Profile = ({profile,email}) => {
  // CONTEXTES : 
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //STATES : 
  const [userProfile, setUserProfile] = useState(true);

  //FONCTIONS : 
  //Pour savoir si le user authentifié à un profil :
  const fetchUserProfile = async userId => {
    try {
      const data = await userAPI.findOne(userId);
      // console.log(data)
      if(!data.profile){
        // console.log("pas de profil")
        setUserProfile(false)
      }
    }catch(error){
      console.log(error.response)
    }
  }
  
  //EFFETS :
  useEffect(()=>{
    fetchUserProfile(userId)
  },[])


    return ( 
        <div className="container profile border rounded py-2 bg-light shadow">
          <div className="row justify-content-center">

            <figure className="col-lg-6 col-md-12 col-sm-12 profile_pic p-1 my-2 d-flex">
              <img className="img-thumbnail profile_picture" src={profile.pictureUrl} alt="" />
            </figure>

            <div className="col-lg-6 col-md-12 col-sm-12 profile_info p-1 my-2">
            <div className="alert alert alert-dark mx-2">
                <h1 className="profile_name">
                  {profile.firstName}{" "}
                  {profile.type.name === "musicien.ne" && profile.lastName}
                </h1>

                <p className="profile_type text-center"> {profile.type.name} </p>
              </div>

              {profile.type.name === "musicien.ne" && (
                <div className="instrus p-1 m-2 alert alert-secondary">
                  <h3>Instrument : </h3>
                  <span className="badge badge-dark">
                    {profile.instrument.name} 
                  </span>
                </div>
              )}

              <div className="localization p-1 m-2 alert alert-secondary">
                <h3>Région :</h3>
                <span className="badge badge-dark">
                  {profile.localization.region}
                </span>
              </div>
              <div className="style p-1 m-2 alert alert-secondary">
                <h3>Style de musique principal :</h3>
                <span className="badge badge-dark">
                  {profile.style.name}
                </span>
              </div>
            </div>
          </div>
          <div className="profile_bio p-1 my-2 border border-light rounded">
            <h3 className="profile_subtitle" >Présentation : </h3>
            <p> {profile.biography} </p>
          </div>
          <div className="profile_link p-1 my-2 border border-light rounded">
            <h3 className="profile_subtitle" >Liens :</h3>
            <p className="profile_link_url">
              <a target="_blank" href={profile.linkUrl}> {profile.linkUrl} </a>{" "}
            </p>
          </div>
          {!userProfile && 
            <div className="d-flex my-3 justify-content-center">
              <Link to="/users/profile/new" className="btn btn-warning">
                Pour contacter {profile.firstName}, <br/> Créez votre profil
              </Link>
            </div>
          }
          {userProfile && 
            <div className="profil_contact d-flex my-3">
              <button className="btn btn-primary m-auto p-3" type="button">
                  <a className="text-white" href={"mailto:" + profile.email}> 
                    Envoyer un mail
                  </a>
              </button>
            </div>
          }

        </div>
     );
}
 
export default Profile;