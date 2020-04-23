import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


//---------------------------------------------- FUNCTIONNAL COMPONENT :
const Contact = (props) => {

  //---------------------------------------------- STATES :
  const [validated, setValidated] = useState(false);

  const [errors, setErrors] = useState({
      email:"",
      object:"",
      message:""
  })

//----------------------------------------------FUNCTIONS :
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

//----------------------------------------------RETURN :
    return ( 
        <>
            <Helmet>
                <title>Zicos : Contact</title>
            </Helmet>

            <div className="bg-secondary py-4">
                <div className="container bg-light shadow rounded p-5">
                    <h1>Nous contacter</h1>

                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <div action="contact.php" method="POST" className="m-5">

                            <Form.Group controlId="email">
                                <Form.Label>Votre adresse email </Form.Label>
                                <Form.Control type="email" placeholder="votre adresse email" required name="email" />
                                <Form.Text className="text-muted">
                                    Cette adresse nous est nécessaire pour vous répondre
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    Merci de renseigner une adresse email valide
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="object">
                                <Form.Label>Objet</Form.Label>
                                <Form.Control placeholder="Quel est l'objet de votre message ?" required name="object" />
                                <Form.Control.Feedback type="invalid">
                                    Merci de préciser l'objet de votre message
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="message">
                                <Form.Label>Votre message</Form.Label>
                                <Form.Control placeholder="votre message..." as="textarea" rows="4" required name="message"/>
                                <Form.Control.Feedback type="invalid">
                                    Votre message est bien vide...
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="success" type="submit">
                                Envoyer
                            </Button>
                        </div>

                    </Form>
                </div>
            </div>
        </>
     );
}
 
export default Contact;