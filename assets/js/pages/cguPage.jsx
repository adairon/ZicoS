//----------------------------------------------IMPORTS :

import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
//contexts :
import LogedInModalContext from "../contexts/LogedInModalContext";
//components:
import CGU from "../components/CGU";

const cguPage = ({ history }) => {
    //CONTEXTS :
  const { logedInModal, setLogedInModal } = useContext(LogedInModalContext);

  //----------------------------------------------EFFECTS :

  useEffect(() => {
    if (logedInModal) {
      setLogedInModal(false);
      // Notification Toast :
      toast.success("Vous êtes connecté ! À vous de jouer 🎸 🎹");
      history.push("/profils");
    }
  }, [logedInModal]);

  //----------------------------------------------RETURN :
    return ( 
        <>
        <Helmet>
            <title>Zicos : CGU</title>
        </Helmet>
        <div className="bg-secondary py-4">
            <div className="container bg-light shadow rounded p-5">
                <h1 className="my-4">Conditions générales d'utilisation</h1>
                
                <CGU/>
                
            </div>
        </div>
        </>
     );
}
 
export default cguPage;