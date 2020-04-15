import axios from 'axios'
import {PROFILES_API} from "../config"

function findAll({cancelToken}) {
    return axios
        .get(PROFILES_API, {cancelToken})
        .then(response => response.data["hydra:member"]);
}

function findOne(id) {
    return axios
        .get(PROFILES_API + "/" + id)
        .then(response => response.data);
}

function create(profile) {
    return axios.post(PROFILES_API, profile)
}


function update(id, profile) {
    return axios.put(PROFILES_API + "/" + id, profile);
}

function deleteProfil(id){
    return axios
        .delete(PROFILES_API + "/" + id)
}


export default {
    findAll,
    delete: deleteProfil,
    findOne,
    update,
    create
}