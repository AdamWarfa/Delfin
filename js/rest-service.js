import { updateUsersGrid } from "./treasurer.js";

// Firebase variabel
const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

async function getUsers() {
  // Fetch JSON data fra vores database
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  const users = prepareUserData(data);

  // for (const user of users) {
  //   contingency(user);
  // }

  return users;

  // TO DO: tjek navngivning af variabler og funktion
}

async function getResults() {
  // Fetch JSON data fra vores database
  const response = await fetch(`${endpoint}/results.json`); //indsæt json
  const data = await response.json();
  const users = prepareUserData(data);

  return results;

  // TO DO: tjek navngivning af variabler og funktion
}

function prepareUserData(dataObject) {
  const userArray = [];

  for (const key in dataObject) {
    try {
      const user = dataObject[key];
      user.id = key;
      userArray.push(user);
    } catch (error) {
      console.log(`Nogen har ødelagt vores user så de giver ${dataObject[key]}`);
    }
  }
  return userArray;
}


async function deleteUserClicked(userObject) {

  const response = await deleteUser(userObject);

  if (response.ok) {
    updateUsersGrid();
  }
}

async function deleteUser(userObject) {
  const response = await fetch(`${endpoint}/users/${userObject.id}.json`, {
    method: "DELETE",
  });
  return response;
}

export { endpoint, getUsers, deleteUserClicked };
