import React from "react";
import { Link } from "react-router-dom";

const ProfilesCards = ({paginatedProfiles}) => {
  return (
    <>
      <div className="card-deck">
        {paginatedProfiles.map(profile => (
          <div key={profile.id} className={"card profileCard bg-light text-white shadow my-5 " + profile.type.name}>
            <img className="card-img-top img-fluid" src={profile.pictureUrl} alt="Card image cap" />
            <div className="card-body p-2">
              <Link to={"/profils/" + profile.id} >
                <h5 className="card-title text-primary">
                  {profile.firstName} {profile.lastName}
                </h5>
                <p className="card-text">
                {profile.type.name} {profile.instrument && "("+profile.instrument.name+")"} <br/>
                {profile.style.name} <br/>
                {profile.localization.region}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfilesCards;
