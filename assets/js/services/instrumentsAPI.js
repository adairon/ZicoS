import axios from 'axios'
import { INSTRUMENTS_API } from '../config';

function findAll({cancelToken}) {
    return axios
        .get(INSTRUMENTS_API,{cancelToken})
        .then(response => response.data["hydra:member"]);
}

export default {
    findAll,
}