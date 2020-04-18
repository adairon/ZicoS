//----------------------------------------------IMPORTS :
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
//API:
import ProfilesAPI from "../services/profilesAPI";
//Components
import Profile from "../components/Profile";
import CssProfileLoader from "../components/loaders/CssProfileLoader";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const ProfilePage = (props) => {
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
    youtubeUrl:"",
    instrument: "",
    localization: "",
    style: "",
    level: "",
    user: "",
  });

  //----------------------------------------------FUNCTIONS :
  //On récupère les données du profil
  const fetchProfile = async (id) => {
    try {
      const data = await ProfilesAPI.findOne(id);
      const {
        lastName,
        firstName,
        type,
        pictureUrl,
        biography,
        email,
        linkUrl,
        youtubeUrl,
        instrument,
        localization,
        style,
        level,
        user,
      } = await ProfilesAPI.findOne(id);
      setProfile({
        lastName,
        firstName,
        type,
        pictureUrl,
        biography,
        email,
        linkUrl,
        youtubeUrl,
        instrument,
        localization,
        style,
        level,
        user,
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  //----------------------------------------------EFFECTS :
  //On récupère le profil au chargement de la page
  useEffect(() => {
    setLoading(true);
    fetchProfile(id);
  }, [id]);

  //----------------------------------------------RETURN :
  return (
    <>
      <Helmet>
        <title>Zicos : profil de {profile.firstName} </title>
      </Helmet>

      <div className="bg-secondary py-5">
        {loading && (
          <div className="container py-2">
            <CssProfileLoader />
          </div>
        )}

        {!loading && <Profile profile={profile} email={profile.user.email} />}

        <div className="d-flex justify-content-center">
          <Link className="btn btn-outline-black" to="/profils">
            Retour aux profils
          </Link>
        </div>

      </div>
    </>
  );
};

export default ProfilePage;
