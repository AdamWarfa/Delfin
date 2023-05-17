// Firebase variabel
const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

async function getUsers() {
  // Fetch JSON data fra vores database
  const response = await fetch(`${endpoint}/users.json`); //indsæt json
  const data = await response.json();
  const users = prepareUserData(data);

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

export { endpoint };
