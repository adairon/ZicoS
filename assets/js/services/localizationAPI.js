import axios from 'axios'
import { LOCALIZATIONS_API } from '../config';

function findAll({cancelToken}) {
    return axios
        .get(LOCALIZATIONS_API,{cancelToken})
        .then(response => response.data["hydra:member"]);
}

export default {
    findAll,
}