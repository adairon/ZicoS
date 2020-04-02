import axios from 'axios'

function findOne(id) {
    return axios
        .get("http://localhost:8000/api/users/" + id)
        .then(response => response.data);
}

export default {
    findOne
}