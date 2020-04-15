import axios from 'axios'
import { STYLES_API } from '../config';

function findAll({cancelToken}) {
    return axios
        .get(STYLES_API,{cancelToken})
        .then(response => response.data["hydra:member"]);
}

export default {
    findAll,
}