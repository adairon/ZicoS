import axios from 'axios'

function findAll({cancelToken}) {
    return axios
        .get("http://localhost:8000/api/localizations",{cancelToken})
        .then(response => response.data["hydra:member"]);
}

export default {
    findAll,
}