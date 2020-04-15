import axios from 'axios'
import { LEVELS_API } from '../config';

function findAll({cancelToken}) {
    return axios
        .get(LEVELS_API,{cancelToken})
        .then(response => response.data["hydra:member"]);
}

export default {
    findAll,
}