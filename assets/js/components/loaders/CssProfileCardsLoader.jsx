import React from "react";


const CssProfilesCardsLoader = (props) => {
    const loadingCards = [1,2,3,4,5,6,7,8,9,10,11,12]
  return (
    <>
      <div className="card-deck">
        {loadingCards.map(card => (
          <div key={card} className="card bg-dark text-white pb-3 shadow loadingCard">
            <span className=""></span>
            <div className="">
                <h5 className="">
                </h5>
                <p className="card-text"></p>
                <p className="card-text"></p>
                <p className="card-text"></p>

            </div>
          </div>

        ))}

      </div>

    </>
  );
};

export default CssProfilesCardsLoader;
