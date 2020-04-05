import axios from 'axios'

function findOne(id) {
    return axios
        .get("http://localhost:8000/api/users/" + id)
        .then(response => response.data);
}

function register(user){
    return axios.post("http://localhost:8000/api/users", user);
}


export default {
    register,
    findOne
}