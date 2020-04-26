  //----------------------------------------------IMPORTS :

import React, {useState} from 'react';
//bootstrap react :
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'
import messagesAPI from '../services/messagesAPI';

  //----------------------------------------------FUNCTIONNAL COMPONENT :


const MessageModal = ({libBtn, variant, margin, forUser}) => {
  //----------------------------------------------STATES :
    //State pour l'affichage de la modal
  const [show, setShow] = useState(false);
  const [messageToSend, setmessageToSend] = useState({
      forUser:`${forUser}`,
      message:""
  })

  //----------------------------------------------FUNCTIONS :

    //fct pour gérer l'affichage de la modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const handleChange = ({currentTarget}) => {
      const {name, value} = currentTarget;
      setmessageToSend({...messageToSend, [name]: value})
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(messageToSend)

    // try{
    //     await messagesAPI.send(messageToSend)
    // }catch(error){
    //     console.log(error.response)
    // }
  }

  //----------------------------------------------RETURN :

    return ( 
        <>
            <Button
                variant={variant}
                onClick={handleShow}
                className={"d-flex justify-content-center " + margin}
            >
                {libBtn}
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Body>
                <Form.Group controlId="message">
                    <Form.Label>Votre message</Form.Label>

                    <Form.Control placeholder="votre message..." as="textarea" rows="4" required name="message" value={messageToSend.message} onChange={handleChange}/>

                    <Form.Control.Feedback type="invalid">
                        Votre message est bien vide...
                    </Form.Control.Feedback>
                </Form.Group>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit}>
                    Envoyer
                </Button>
            </Modal.Footer>

             </Modal>
        </>
     );
}
 
export default MessageModal;