import React from 'react';
import { Helmet } from "react-helmet";



const Contact = (props) => {
    return ( 
        <>
            <Helmet>
                <title>Zicos : Contact</title>
            </Helmet>

            <div className="bg-secondary py-4">
                <div className="container bg-light shadow rounded p-5">
                    <h1>Nous contacter</h1>
                    <form action="contact.php" method="POST" className="m-5">
                        <div className="form-group">
                            <label htmlFor="email">Votre adresse email</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="votre adresse email"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="object">Objet</label>
                            <input type="text" className="form-control" id="object" name="object" placeholder="objet de votre message"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Votre message</label>
                            <textarea className="form-control" id="message" name="message" rows="4" placeholder="Votre message"></textarea>
                        </div>
                        <button type="submit" className="btn btn-success">Envoyer</button>
                    </form>
                    
                </div>
            </div>


        </>
     );
}
 
export default Contact;