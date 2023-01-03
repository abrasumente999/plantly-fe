import axios from "axios";

const plantsApi = axios.create({
  baseURL: "https://plantly-api.onrender.com/api/",
});

const forumApiData = axios.create({
  baseURL: "https://plantly.cyclic.app/api/",
});

export const getPlants = (climate) => {
  return plantsApi
    .get("/plants", { params: { climate: climate }})
    .then((plants) => {
      return plants.data.plants;
    })
    .catch((err) => console.log(err));
};

export const getPlantsByQuery = (searchquery) => {
  return plantsApi.get(`/plants/?q=${searchquery}`).then(({ data }) => {
    return data;
  });
};

export const getPlantById = (id) => {
  return plantsApi.get(`/plants/${id}`).then((plant) => {
    return plant.data.plant;
  });
};

export const getUserPlants = (user) => {
  return plantsApi.get(`/myplants/${user}`).then((myPlants) => {
    return myPlants.data.myPlants;
  });
};

export const postUserPlant = ({
  username,
  plant_id,
  last_watered_date,
  nickname,
}) => {
  const postBody = { username, plant_id, last_watered_date, nickname };
  return plantsApi
    .post(`/myplants/${username}/${plant_id}`, postBody)
    .then(({ data }) => {
      return data;
    });
};

export const deleteUserPlant = (username, my_plant_id) => {
  return plantsApi.delete(`/myplants/${username}/${my_plant_id}`);
};

export const getUserPlantByMyPlantId = (username, my_plant_id) => {
  return plantsApi.get(`/myplants/${username}/${my_plant_id}`).then((plant) => {
    return plant.data.myPlant;
  });
};

export const getForum = () => {
  return forumApiData.get('/reddit').then((reddit) => {
    return reddit.data.post_array
  })
}
