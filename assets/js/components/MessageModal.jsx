//----------------------------------------------IMPORTS :

import React, { useState } from "react";
//bootstrap react :
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import messagesAPI from "../services/messagesAPI";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const MessageModal = ({ libBtn, variant, margin, forUserId, forUserName }) => {
  //----------------------------------------------STATES :
  //State pour l'affichage de la modal
  const [show, setShow] = useState(false);
  const [messageToSend, setmessageToSend] = useState({
    forUser: `/api/users/${forUserId}`,
    message: "",
  });
  const [validated, setValidated] = useState(false);

  //----------------------------------------------FUNCTIONS :

  //fct pour gérer l'affichage de la modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setmessageToSend({ ...messageToSend, [name]: value });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setShow(true)
    } else {
        event.preventDefault();
        try {
          await messagesAPI.send(messageToSend);
          toast.success("Votre message a bien été envoyé");
          setShow(false);
        } catch (error) {
          console.log(error.response);
          toast.warning("Un problème est survenu, votre message n'est pas parti...")
        }
      }
      setValidated(true);
  };

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
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="message">
              <Form.Label>Votre message à {" " + forUserName} </Form.Label>

              <Form.Control
                placeholder="votre message..."
                as="textarea"
                rows="4"
                required
                name="message"
                value={messageToSend.message}
                onChange={handleChange}
              />

              <Form.Control.Feedback type="invalid">
                Votre message est bien vide...
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="success" type="submit">
              Envoyer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default MessageModal;
