import axios from "axios";
import jwtDecode from "jwt-decode"

//fonction de déconnexion :
function logout(){
    // on enlève le token stocké dans la mémoire du navigateur
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

// fonction de connexion :
function authenticate(credentials) {
    // on récupère le token généré par la requête en post
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // On stocke le token dans la mémoire du navigateur via le localeStorage
            window.localStorage.setItem("authToken", token);
            // on prévient axios qu'on a maintenant un header par défaut avec le token sur toutes nos futures requêtes http
            setAxiosToken(token);
            return true
        })
}

//fonction pour passer le token à axios avec la requête http
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

//fonction pour recharger le token
function setup(){
    // 1. voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // 2. voir si le token est toujours valide avec jwy-decode (bundle npm)
    if(token){
        //on récupère le timeStamp d'expiration du token
        const {exp : expiration} = jwtDecode(token)
        //on vérifie si le token n'est pas expiré encomparant son timeStamp (convertit de ms en s) avec maintenant
        if(expiration * 1000 > new Date().getTime()){
            // 3. si token valide, le passer à axios
            setAxiosToken(token);
        }
    }
}

export default {
    authenticate,
    logout,
    setup
}