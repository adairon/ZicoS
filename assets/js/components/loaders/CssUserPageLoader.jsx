import React from "react";

const CssUserPageLoader = (props) => {
  return (
    <>
      <div className="loadignUserInfos rounded"></div>

      <div className="d-flex justify-content-center">
        <span className="btn m-4 loadingUserBtn"></span>
        <span className="btn m-4 loadingUserBtn"></span>
      </div>
      <div className="d-flex justify-content-center">
        <span className="btn my-3 loadingUserBtn"></span> 
      </div>
    </>
  );
};

export default CssUserPageLoader;
