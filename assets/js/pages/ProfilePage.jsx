//----------------------------------------------IMPORTS :
import React, { useState, useEffect } from "react";

import { Helmet } from "react-helmet";

import ProfilesAPI from "../services/profilesAPI";

import Profile from "../components/Profile";
import ProfileLoader from "../components/loaders/ProfileLoader";
import CssProfileLoader from "../components/loaders/CssProfileLoader";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const ProfilePage = props => {
  // on récupère l'identifiant du profil concerné :
  const id = props.match.params.id;

  //----------------------------------------------STATES :
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    lastName: "",
    firstName: "",
    email: "",
    type: "",
    biography: "",
    pictureUrl: "",
    linkUrl: "",
    instrument: "",
    localization: "",
    style: "",
    level: "",
    user: ""
  });

  //----------------------------------------------FUNCTIONS : 
  //On récupère les données du profil
  const fetchProfile = async id => {
    try {
      const data = await ProfilesAPI.findOne(id);
      // console.log(data);
      const {
        lastName,
        firstName,
        type,
        pictureUrl,
        biography,
        email,
        linkUrl,
        instrument,
        localization,
        style,
        level,
        user
      } = await ProfilesAPI.findOne(id);
      setProfile({
        lastName,
        firstName,
        type,
        pictureUrl,
        biography,
        email,
        linkUrl,
        instrument,
        localization,
        style,
        level,
        user
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  //----------------------------------------------EFFECTS : 
  //On récupère le profil au chargement de la page
  useEffect(() => {
    // setLoading(true);
    fetchProfile(id);
  }, [id]);

  //----------------------------------------------RETURN :
  return (
    <>
      <Helmet>
        <title>Zicos : profil de {profile.firstName} </title>
      </Helmet>


      <div className="bg-secondary py-4">
      

        {loading && 
        <div className="container py-2">
        <CssProfileLoader/>
        </div>}

        {!loading && 
        <Profile
          profile={profile}
          email={profile.user.email}
        />}
      
      </div>
    </>
  );
};

export default ProfilePage;
