//----------------------------------------------IMPORTS :
import React, { useEffect, useState, useContext } from "react";
import Helmet from "react-helmet";
import Axios from "axios";
//contexts:
import UserContext from "../contexts/UserContext";
import MessagesAPI from "../services/messagesAPI";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const Messages = (props) => {
  //----------------------------------------------CONTEXTES :
  //On récupère l'id de l'utilisateur authentifié avec le contexte :
  const { userId } = useContext(UserContext);
  //----------------------------------------------STATES :
  const [messages, setMessages] = useState([]);
  //----------------------------------------------FUNCTIONS :
  let source = Axios.CancelToken.source();

  const fetchMessages = async () => {
      try{
        const data = await MessagesAPI.findAll({cancelToken: source.token})
        console.log(data);
        setMessages(data);
      }catch(error){
        if (Axios.isCancel(error)) {
            console.log("request cancelled");
          } else {
            console.log(error.response);
          }
      }
  }
  console.log(messages)
  //----------------------------------------------EFFECT :
  //TODO : modifier l'effet pour que s'affiche le dernier message envoyé et aussi le dernier message reçu.
  useEffect(() => {
    fetchMessages();
  },[]);



  //----------------------------------------------RETURN :
  //TODO : ajouter un css content loader pour les messages

  return (
    <>
      <Helmet>
        <title>Zicos : messages </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Mes Messages</h1>

          <div className="bg-secondary shadow-none rounded p-1 m-1 row messenger_container">
          
            <div className="conversations bg-light rounded border border-dark col-4">
                Mes conversations
                {messages.map(message =>(
                    <div key={message.id} className="border border-dark p-2">
                        <h3>Conversation avec {message.fromUser.profile.firstName}</h3>
                    </div>
                ))}
            </div>

            <div className="messages_view border border-primary col-8">
                Mes messages
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
