import axios from 'axios'
import { TYPES_API } from '../config';

function findAll({cancelToken}) {
    return axios
        .get(TYPES_API,{cancelToken})
        .then(response => response.data["hydra:member"]);
}

export default {
    findAll,
}