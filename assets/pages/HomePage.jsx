import React from "react";

const HomePage = props => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">Salut les ZicoS !</h1>
      <p className="lead">
       Ceci est un simple paragraphe de test.
      </p>
      <hr className="my-4" />
      <p>
        La page d'accueil sera rapidement enrichie. Stay tuned !
      </p>
      <p className="lead">
        <a className="btn btn-primary btn-lg" href="#" role="button">
          Plus de détails
        </a>
      </p>
    </div>
  );
};

export default HomePage;
