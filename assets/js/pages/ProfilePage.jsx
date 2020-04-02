import React, { useState, useEffect } from "react";
import ProfilesAPI from "../services/profilesAPI";
import { Helmet } from "react-helmet";
import Profile from "../components/Profile";

const ProfilePage = props => {
  // on récupère l'identifiant du profil concerné :
  const id = props.match.params.id;

  // STATES :
  const [loading, setLoading] = useState(false);
  const [typeMusicien, setTypeMusicien] = useState(false);
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
    user: ""
  });

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
        user
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  //On récupère le profil au chargement de la page
  useEffect(() => {
    setLoading(true);
    fetchProfile(id);
  }, []);

  return (
    <>
      <Helmet>
        <title>Zicos : profil de {profile.firstName} </title>
      </Helmet>


      <div className="bg-dark py-2">
     
        <Profile
          profile={profile}
        />
      
      </div>
    </>
  );
};

export default ProfilePage;
