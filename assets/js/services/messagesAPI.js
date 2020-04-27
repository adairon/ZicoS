import axios from 'axios'
import {MESSAGES_API} from "../config"

function findAll({cancelToken}){
    return axios
        .get(MESSAGES_API, {cancelToken})
        .then(response => response.data["hydra:member"]);
}

function send(message){
    return axios.post(MESSAGES_API, message);
}

export default {
    findAll,
    send
}