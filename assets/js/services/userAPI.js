import axios from 'axios'
import Cache from "./cache";

async function findOne(id) {
    const cachedUser = await Cache.get("user");

    if (cachedUser) return cachedUser;

    return axios
        .get("http://localhost:8000/api/users/" + id)
        .then(response => {
            const user = response.data;
            Cache.set("user", user);
            return user;
        });
}

function register(user){
    return axios.post("http://localhost:8000/api/users", user);
}


export default {
    register,
    findOne
}