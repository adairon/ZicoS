//----------------------------------------------IMPORTS :
import React from 'react';
import Helmet from "react-helmet";

//----------------------------------------------FUNCTIONNAL COMPONENT : 

//----------------------------------------------EFFECTS :
const Messages = (props) => {
    return ( 
        <>
            <Helmet>
                <title>Zicos : messages </title>
            </Helmet>
            <div className="fondPage bg-secondary py-4 d-flex align-items-center">
                <div className="container bg-light shadow rounded p-5">
                    <h1>Mes Messages</h1>
                    
                </div>
            </div>
        </>
     );
}
 
export default Messages;