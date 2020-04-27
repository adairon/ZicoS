import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";


/**
 * fonction de déconnexion : suppression du token du localStorage et d'axios
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * requête http d'authentification et stockage du token dans le localStorage et sur axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  // on récupère le token généré par la requête en post
  return axios
    .post(LOGIN_API, credentials)
    .then(response => response.data.token)
    .then(token => {
      // On stocke le token dans la mémoire du navigateur via le localeStorage
      window.localStorage.setItem("authToken", token);
      // on prévient axios qu'on a maintenant un header par défaut avec le token sur toutes nos futures requêtes http
      setAxiosToken(token);
      return true;
    });
}

/**
 * Positionne le token JWT sur axios
 * @param {string} token le token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place du token (si valide) lors du chargement de l'application
 */
function setup() {
  // 1. voir si on a un token
  const token = window.localStorage.getItem("authToken");
  // 2. voir si le token est toujours valide avec jwy-decode (bundle npm)
  if (token) {
    //on récupère le timeStamp d'expiration du token
    const { exp: expiration } = jwtDecode(token);
    //on vérifie si le token n'est pas expiré encomparant son timeStamp (convertit de ms en s) avec maintenant
    if (expiration * 1000 > new Date().getTime()) {
      // 3. si token valide, le passer à axios
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  // 1. voir si on a un token
  const token = window.localStorage.getItem("authToken");
  // 2. voir si le token est toujours valide avec jwt-decode (bundle npm)
  if (token) {
    //on récupère le timeStamp d'expiration du token
    const { exp: expiration } = jwtDecode(token);
    //on vérifie si le token n'est pas expiré encomparant son timeStamp (convertit de ms en s) avec maintenant
    if (expiration * 1000 > new Date().getTime()) {
      // si on a un token et qu'il est valide, alors on est connecté, on renvoie "vrai"
      return true;
    }else{
      //sinon, c'est qu'on est pas connecté, on renvoi "faux" et on surrpime le token du local storage
      window.localStorage.removeItem("authToken");
      return false;
    }
  }
  return false;
}

/**
 * Permet de récupérer l'id de l'utilisateur connecté dans le token
 */
function userId(){
  // 1. voir si on a un token
  const token = window.localStorage.getItem("authToken");
  // 2. voir si le token est toujours valide avec jwt-decode (bundle npm)
  if (token) {
    //on récupère l'id du user authentifié via le token et on vérifie la validité du token
    const {id: userId} = jwtDecode(token);
    const { exp: expiration } = jwtDecode(token);
    //on vérifie si le token n'est pas expiré encomparant son timeStamp (convertit de ms en s) avec maintenant
    if (expiration * 1000 > new Date().getTime()) {
      // si on a un token et qu'il est valide, alors on est connecté, on renvoie l'id
      return userId;
    }
    //sinon, c'est qu'on est pas connecté, on renvoi ""
    return "";
  }
  return "";
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
  userId
};
