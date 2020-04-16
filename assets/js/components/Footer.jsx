import React from 'react';
import { Link } from "react-router-dom";

const Footer = (props) => {
    return ( 
        <>
            <footer className="footer bg-light border-primary">
                <div className="container footer_container">
                    <div className="footer_links d-flex justify-content-center align-items-center">
                        <Link to="/about" className="mx-4 btn btn-link"> à propos </Link>
                    </div>
                </div>
            </footer>
        </>
     );
}
 
export default Footer;