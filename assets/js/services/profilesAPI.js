import axios from 'axios'

function findAll({cancelToken}) {
    return axios
        .get("http://localhost:8000/api/profiles", {cancelToken})
        .then(response => response.data["hydra:member"]);
}

function findOne(id) {
    return axios
        .get("http://localhost:8000/api/profiles/" + id)
        .then(response => response.data);
}


function deleteProfil(id){
    return axios
        .delete("http://localhost:8000/api/profiles/" + id)
}



export default {
    findAll,
    delete: deleteProfil,
    findOne,
}