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
import MessageModal from "../components/MessageModal";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const Conversations = (props) => {
  //----------------------------------------------CONTEXTES :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);
  //----------------------------------------------STATES :
  const [messages, setMessages] = useState([]);
  const [fromUsersTab, setFormUsersTab] = useState([]);
  const [fromUsers, setFromUsers] = useState({
      id:"",
      firstName:""
  })
  const [user, setUser] = useState({});
  //----------------------------------------------FUNCTIONS :
  let source = Axios.CancelToken.source();

  const fetchMessages = async () => {
      try{
        const data = await MessagesAPI.findAll({cancelToken: source.token})
        console.log(data);
        setMessages(data);
        data.map(m => (
            (m.forUser.id !== userId && fromUsersTab.push(m.forUser.id+"_"+m.forUser.profile.firstName)),
            (m.fromUser.id !== userId && fromUsersTab.push(m.fromUser.id+"_"+m.fromUser.profile.firstName))
        ))
        // console.log(fromUsers)
        console.log(Array.from(new Set(fromUsersTab)))
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

  const fetchUserMessages = async (userId) => {
      try{
        const data = await userAPI.findOne(userId);
        // console.log(data)
        setUser(data)
      }catch(error){
          console.log(error.response)
      }
  }
  //----------------------------------------------EFFECT :
  //TODO : modifier l'effet pour que s'affiche le dernier message envoyé et aussi le dernier message reçu.
  useEffect(() => {
    fetchMessages();
    fetchUserMessages(userId)
  },[]);



  //----------------------------------------------RETURN :
  //TODO : ajouter un css content loader pour les messages

  return (
    <>
      <Helmet>
        <title>Zicos : messages reçus </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Mes Messages reçus</h1>
            {messages.map(message=>(
                (message.forUser.id === userId && 
                    <Card key={message.id} className="border border-primary my-3">
                    <Card.Body>
                        <Card.Title as="h2">
                            message de 
                                <Link to={"/profils/" + message.fromUser.profile.id} >
                                    {" " + message.fromUser.profile.firstName}
                                </Link>
                            
                        </Card.Title>
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
                                    forUser={message.fromUser.id}
                                />
                            </div>
                        </div>
                    </Card.Footer>
                </Card>
                )
            ))}
        </div>
      </div>
    </>
  );
};

export default Conversations;
