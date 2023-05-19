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

//// ---------------- Results REST ---------------- ////

async function deleteResult(id) {
  const response = await fetch(`${endpoint}/results/${id}.json`, {
    method: "DELETE",
  });

  return response;
}

async function createResult(discipline, meetName, swimmer, time, type, id) {
  const newResult = {
    discipline: discipline,
    meetName: meetName,
    swimmer: swimmer,
    time: time,
    type: type,
    id: id,
  };
  const json = JSON.stringify(newResult);

  const response = await fetch(`${endpoint}/results.json`, {
    method: "POST",
    body: json,
  });

  return response;
}

async function updateResult(discipline, meetName, swimmer, time, type, id) {
  // Opdaterer objekt med opdateret filminformation
  const resultToUpdate = {
    discipline,
    meetName,
    swimmer,
    time,
    type,
  };
  const json = JSON.stringify(resultToUpdate);

  const response = await fetch(`${endpoint}/results/${id}.json`, {
    method: "PUT",
    body: json,
  });

  return response;
}

async function getResults() {
  // Fetch JSON data fra vores database
  const response = await fetch(`${endpoint}/results.json`); //indsæt json
  const data = await response.json();
  const results = prepareUserData(data);

  return results;

  // TO DO: tjek navngivning af variabler og funktion
}

//// ---------------- EXPORT ---------------- ////
export { endpoint, getUsers, getResults, deleteUserClicked, deleteResult, createResult, updateResult };
