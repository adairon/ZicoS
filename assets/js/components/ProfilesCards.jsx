import React from "react";
import { Link } from "react-router-dom";

const ProfilesCards = ({paginatedProfiles}) => {
  return (
    <>
      <div className="card-deck">
        {paginatedProfiles.map(profile => (
          <div key={profile.id} className="card profileCard bg-dark text-white pb-3 shadow">
            <img className="card-img img-fluid" src={profile.pictureUrl} alt="Card image" />
            <div className="card-img-overlay">
              <Link to={"/profils/" + profile.id} >
                <h5 className="card-title">
                  {profile.firstName} {profile.lastName}
                </h5>
                <p className="card-text">{profile.type.name}</p>
                <p className="card-text">{profile.localization.region}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfilesCards;
