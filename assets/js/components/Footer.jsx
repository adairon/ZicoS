import React from 'react';
import { Link } from "react-router-dom";

const Footer = (props) => {
    return ( 
        <>
            <footer className="footer bg-primary border-primary">
                <div className="container footer_container">
                    <div className="footer_links d-flex justify-content-center align-items-center">
                        <Link to="/" className="mx-4 btn btn-link text-light"> Accueil </Link>
                        <Link to="/about" className="mx-4 btn btn-link text-light"> à propos </Link>
                        <Link to="/terms" className="mx-4 btn btn-link text-light"> Conditions Générales d'Utilisation</Link>
                        <Link to="/mentions_legales" className="mx-4 btn btn-link text-light"> Mentions légales</Link>
                    </div>
                </div>
            </footer>
        </>
     );
}
 
export default Footer;