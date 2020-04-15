import axios from 'axios'
import { USERS_API } from '../config';

function findOne(id) {
    return axios
        .get(USERS_API + "/" + id)
        .then(response => response.data);
}

function register(user){
    return axios.post(USERS_API, user);
}


export default {
    register,
    findOne
}