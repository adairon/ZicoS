import axios from "axios";
import Cache from "./cache";

async function findAll({ cancelToken }) {
  const cachedProfiles = await Cache.get("profiles");

  if (cachedProfiles) return cachedProfiles;

  return axios
    .get("http://localhost:8000/api/profiles", { cancelToken })
    .then((response) => {
      const profiles = response.data["hydra:member"];
      Cache.set("profiles", profiles);
      return profiles;
    });
}

function findOne(id) {
  return axios
    .get("http://localhost:8000/api/profiles/" + id)
    .then((response) => response.data);
}

function deleteProfil(id) {
    

  return axios.delete("http://localhost:8000/api/profiles/" + id).then(async response => {
    const cachedProfiles = await Cache.get("profiles")

    if(cachedProfiles) {
        Cache.set("profiles", cachedProfiles.filter(p => p.id !== id))
    }
    return response;
  });
}

export default {
  findAll,
  delete: deleteProfil,
  findOne,
};
