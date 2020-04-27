//----------------------------------------------IMPORTS :
import React, { useEffect, useState, useContext } from "react";
import Helmet from "react-helmet";
import Card from 'react-bootstrap/Card'
import Axios from "axios";
//contexts:
import UserContext from "../contexts/UserContext";
import MessagesAPI from "../services/messagesAPI";
import userAPI from "../services/userAPI";
import { Link } from "react-router-dom";
//Components :
import MessageModal from "../components/MessageModal";
import CssMessagesLoader from "../components/loaders/CssMessagesLoader";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const MessagesInbox = (props) => {
  //----------------------------------------------CONTEXTES :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);
  //----------------------------------------------STATES :
  const [messages, setMessages] = useState([]);
  const [fromUsersTab, setFormUsersTab] = useState([]);
//   const [fromUsers, setFromUsers] = useState({
//       id:"",
//       firstName:""
//   })
  // const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  //----------------------------------------------FUNCTIONS :
  let source = Axios.CancelToken.source();

  const fetchMessages = async () => {
      try{
        const data = await MessagesAPI.findAll({cancelToken: source.token})

        setMessages(data);
        setLoading(false);
        // data.map(m => (
        //     (m.forUser.id !== userId && fromUsersTab.push(m.forUser.id+"_"+m.forUser.profile.firstName)),
        //     (m.fromUser.id !== userId && fromUsersTab.push(m.fromUser.id+"_"+m.fromUser.profile.firstName))
        // ))
        // console.log(Array.from(new Set(fromUsersTab)))
      }catch(error){
        if (Axios.isCancel(error)) {
            console.log("request cancelled");
          } else {
            console.log(error.response);
          }
      }
  }
  //NOTE : fromUsers tab : firstName : fromUserstab[i].replace(/.*_/, "")
  //NOTE : fromUsers tab : id : fromUserstab[i].replace(/_.*$/,"")

  // const fetchUserMessages = async (userId) => {
  //     try{
  //       const data = await userAPI.findOne(userId);
  //       // console.log(data)
  //       setUser(data)
  //     }catch(error){
  //         console.log(error.response)
  //     }
  // }

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
  };

  const filteredMessages = messages.filter(
      m =>
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      m.fromUser.profile.firstName.toLowerCase().includes(search.toLowerCase())
  )
  //----------------------------------------------EFFECT :
  useEffect(() => {
    fetchMessages();
    // fetchUserMessages(userId);
    return () => {
        source.cancel();
      };
  },[messages]);



  //----------------------------------------------RETURN :

  return (
    <>
      <Helmet>
        <title>Zicos : messages reçus </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Mes Messages reçus</h1>
          {loading && <CssMessagesLoader/> }
          {(!loading && messages.length>0) && 
            <div className="form-group">
              <input
                type="text"
                onChange={handleSearch}
                value={search}
                className="form-control col-6 my-5 mx-auto"
                placeholder="Rechercher dans mes messages reçus..."
              />
            </div>
          }
          {(!loading && !messages.length) &&
            <>
              <div className="m-5 p-5 bg-light shadow rounded">
                <h2 className="text-center">
                  Vous n'avez reçu aucun message pour le moment. <br/>
                  Recherchez des profils qui vous intéressent et essayez de les contacter !
                </h2>

                <div className="row justify-content-center my-3">
                  <Link className="btn btn-outline-black my-1" to="/profils">
                    Voir les Profils
                  </Link>
                </div>
              </div>
            </>
          }
            {!loading && filteredMessages.map(message=>(
                (message.forUser.id === userId && 
                    <Card key={message.id} className="my-5 shadow">
                    <Card.Header className="bg-primary text-center">
                        <Card.Title>
                            message de 
                            <Link 
                                to={"/profils/" + message.fromUser.profile.id} 
                                className="text-white"
                                >
                                    {" " + message.fromUser.profile.firstName}
                            </Link>
                            
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {message.message}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <div className="d-flex justify-content-between">
                            <div className="sentAt">
                                reçu le {" " + message.sentAt.replace(/T.*$/,"")} à {" " + message.sentAt.replace(/.*T/,"")}
                            </div>
                            <div className="repondre">
                                <MessageModal
                                    libBtn="Répondre"
                                    variant="primary"
                                    forUserId={message.fromUser.id}
                                    forUserName={message.fromUser.profile.firstName}
                                />
                            </div>
                        </div>
                    </Card.Footer>
                </Card>
                )
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

export default MessagesInbox;
