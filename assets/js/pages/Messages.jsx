//----------------------------------------------IMPORTS :
import React, { useEffect, useState, useContext } from "react";
import Helmet from "react-helmet";
import Axios from "axios";
//contexts:
import UserContext from "../contexts/UserContext";
import MessagesAPI from "../services/messagesAPI";
import userAPI from "../services/userAPI";

//----------------------------------------------FUNCTIONNAL COMPONENT :

const Messages = (props) => {
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
            console.log(m.fromUser.id),
            console.log(m.forUser.id),
            (m.forUser.id !== userId && fromUsersTab.push(m.forUser.id+"_"+m.forUser.profile.firstName)),
            (m.fromUser.id !== userId && fromUsersTab.push(m.fromUser.id+"_"+m.fromUser.profile.firstName))
            // (m.forUser.id !== userId && (
            //     {...fromUsers, [id]: m.forUser.id,
            //     [firstName]: m.forUser.profile.firstName}
            // ))
            // (m.fromUser.id !== userId && (
            //     fromUsers.id = m.fromUser.id,
            //     fromUsers.firstName = m.fromUser.profile.firstName
            // ))
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
        <title>Zicos : messages </title>
      </Helmet>
      <div className="fondPage bg-secondary py-4 d-flex align-items-center">
        <div className="container bg-light shadow rounded p-5">
          <h1>Mes Messages</h1>

          <div className="bg-secondary shadow-none rounded p-1 m-1 row messenger_container">
          
            <div className="conversations bg-light rounded border border-dark col-4">
                Mes conversations
                {Array.from(new Set(fromUsersTab)).map(fromUser =>(
                    <div key={fromUser} className="border border-dark p-2">
                        <h3>Conversation avec {fromUser.replace(/.*_/, "")}</h3>
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
