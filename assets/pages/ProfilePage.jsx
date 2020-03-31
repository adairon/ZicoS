import React, { useState, useEffect } from "react";
import ProfilesAPI from "../services/profilesAPI";

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
    style: ""
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
        style
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
        style
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
      <div className="container border border-dark my-2">
        <div className="row justify-content-center">
          <figure className="col-6 profile_pic p-1 my-2">
            <img className="img-thumbnail" src={profile.pictureUrl} alt="" />
          </figure>
          <div className="col-6 profile_info p-1 border border-primary my-2">
            <h1>
              {profile.firstName}{" "}
              {profile.type.name === "musicien.ne" && profile.lastName}
            </h1>
            <p> {profile.type.name} </p>
            <div className="style p-1 my-2 border border-secondary">
              <h3>Style de musique principal :</h3>
              <p> {profile.style.name} </p>
            </div>
            {profile.type.name === "musicien.ne" && (
              <div className="instrus p-1 my-2 border border-secondary">
                <h3>Instrument joué : </h3>
                <p> {profile.instrument.name} </p>
              </div>
            )}
            <div className="localization p-1 my-2 border border-secondary">
              <h3>Région :</h3>
              <ul>
                <li>{profile.localization.region}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bio p-1 my-2 border border-primary">
          <h3>Présentation : </h3>
          <p> {profile.biography} </p>
        </div>
        <div className="link p-1 my-2 border border-primary">
          <h3>Liens :</h3>
          <p>
            {" "}
            <a href={profile.linkUrl}> {profile.linkUrl} </a>{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
