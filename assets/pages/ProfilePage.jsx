import React, { useState, useEffect } from "react";
import ProfilesAPI from "../services/profilesAPI";
import { Helmet } from "react-helmet";

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
      
        <div className="container profile border rounded py-2 bg-light">
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
          <div className="profil_contact d-flex my-3">
            <button className="btn btn-primary m-auto p-3" type="button">
                <a className="text-white" href={"mailto:" + profile.user.email}> 
                  Envoyer un mail
                </a>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
