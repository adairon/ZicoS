//----------------------------------------------IMPORTS :
import React, { useEffect, useState, useContext } from "react";
import Helmet from "react-helmet";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import Axios from "axios";
//contexts:
import UserContext from "../contexts/UserContext";
import MessagesAPI from "../services/messagesAPI";
import { Link } from "react-router-dom";
import CssMessagesLoader from "../components/loaders/CssMessagesLoader";

//----------------------------------------------FUNCTIONNAL COMPONENT :
const MessagesSent = (props) => {
  //----------------------------------------------CONTEXTES :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);

  //----------------------------------------------STATES :
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //----------------------------------------------FUNCTIONS :
  let source = Axios.CancelToken.source();

  const fetchMessages = async () => {
    try {
      const data = await MessagesAPI.findAll({ cancelToken: source.token });
      // console.log(data);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        console.log(error.response);
        toast.warning("Erreur lors du chargement des messages...");
      }
    }
  };

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
  };

  const filteredMessages = messages.filter(
      m =>
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      m.forUser.profile.firstName.toLowerCase().includes(search.toLowerCase())
  )

  //----------------------------------------------EFFECT :
  useEffect(() => {
    fetchMessages();
    return () => {
      source.cancel();
    };
  }, [messages]);

  //----------------------------------------------RETURN :

  return (
    <>
      <Helmet>
        <title>Zicos : messages envoyés </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Mes messages envoyés</h1>
          {loading && <CssMessagesLoader/> }
          {(!loading && messages.length>0) && 
            <div className="form-group">
              <input
                type="text"
                onChange={handleSearch}
                value={search}
                className="form-control col-6 my-5 mx-auto"
                placeholder="Rechercher dans mes messages envoyés..."
              />
            </div>
          }

          {(!loading && !messages.length) &&
            <>
              <div className="m-5 p-5 bg-light shadow rounded">
                <h2 className="text-center">
                  Vous n'avez envoyé aucun message pour le moment. <br/>
                  Recherchez des profils qui vous intéressent et contactez les pour jouer ensemble !
                </h2>

                <div className="row justify-content-center my-3">
                  <Link className="btn btn-outline-black my-1" to="/profils">
                    Voir les Profils
                  </Link>
                </div>
              </div>
            </>
          }
          
          {!loading &&  filteredMessages.map(
            (message) =>
              message.fromUser.id === userId && (
                <Card key={message.id} className="my-5 shadow">
                  <Card.Header className="text-center">
                    <Card.Title>
                      message à
                      <Link to={"/profils/" + message.forUser.profile.id}>
                        {" " + message.forUser.profile.firstName}
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>{message.message}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    <div className="d-flex justify-content-between">
                      <div className="sentAt">
                        envoyé le {" " + message.sentAt.replace(/T.*$/, "")} à{" "}
                        {" " + message.sentAt.replace(/.*T/, "")}
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              ))}
          {(!loading && messages.length>0 && !filteredMessages.length) &&
            <>
              <div className="m-5 p-5 bg-light shadow rounded">
                <h2 className="text-center">
                  Auncun message ne correspond à cette recherche.
                </h2>
                <div className="row justify-content-center my-3">
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </>
  );
};

export default MessagesSent;
