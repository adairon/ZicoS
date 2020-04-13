import React from "react";

const CssProfileLoader = (props) => {
  return (
    <>
      <div className="container profile border rounded py-2 bg-light shadow">
        <div className="row justify-content-center">
          <figure className="col-lg-6 col-md-12 col-sm-12 profile_pic p-1 my-2 d-flex profile_figure">
            <span className="img-thumbnail profile_picture loadingPicture"></span>
          </figure>

          <div className="col-lg-6 col-md-12 col-sm-12 profile_info p-1 my-2 ">
            <div className="mx-2 rounded loadingProfilTitle"></div>

            <div className="instrus p-1 m-2 rounded loadingInfo"></div>

            <div className="style p-1 m-2 rounded loadingInfo"></div>

            <div className="level p-1 m-2 rounded loadingInfo"></div>

            <div className="localization p-1 m-2 rounded loadingInfo"></div>
          </div>
        </div>
        <div className="profile_bio p-1 my-2 rounded loadingProfileText"></div>

        <div className="profile_link p-1 my-2 rounded loadingProfileText"></div>

        <div className="d-flex my-3 justify-content-center"></div>
      </div>
    </>
  );
};

export default CssProfileLoader;
