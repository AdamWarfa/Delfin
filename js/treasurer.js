import { getUsers } from "./rest-service.js";

let users;

async function updateUsersGrid() {
  users = await getUsers();
  showUsers(users);
  getUserinRestance(users);
}

function showUsers(listOfUsers) {
  document.querySelector("#treasurer-grid").innerHTML = "";

  /* 
  Når man laver et nyt "create post", giver den fejlbesked i konsollen, da objektets datastruktur ikke stemmer overens med databasen.
  Derfor implementerede vi en try catch som gerne skulle fange fejlbeskederne.
  */
  for (const user of listOfUsers) {
    try {
      showUser(user);
    } catch (error) {
      console.log(error);
    }
  }
}

// Funktion til DOM-manipulation
function showUser(userObject) {
  document.querySelector("#treasurer-grid").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

<article class="list-entry">
  <h2 id="list-name">${userObject.firstName + userObject.lastName}</h2>
  <p id="list-birthday">Fødselsdato: ${userObject.birthday}</p>
  <p id="list-age">Alder: ${userObject.age}</p>
  <p id="list-street" >Adresse: ${userObject.street}</p>
  <p id="list-housenumber" >Husnummer: ${userObject.houseNumber}</p>
  <p id="list-postcode" >Postkode: ${userObject.postCode}</p>
  <p id="list-city" >By: ${userObject.city}</p>
  <p id="list-email" >Email: ${userObject.email}</p>
  <p id="list-phonenumber" >Telefon nummer: ${userObject.phoneNumber}</p>
  <p id="list-membertype" >Medlemsskab: ${userObject.memberType}</p>
  <p id="list-agegroup" >Aldersgruppe: ${userObject.ageGroup}</p>
  <p id="list-leveltype" >Aktivitetsform: ${userObject.levelType}</p>
  <p id="list-restance" >Bruger i restance: ${userObject.restance}</p>
  <button id="btn-delete">DELETE</button>
</article>
`
  );
}

async function getUserinRestance(users) {
  users = await getUsers();
  for (let i = 0; i < users.length; i++) {
    let userInRestance;
    if (users[i].restance === true) {
      userInRestance = users[i];
      showUserinRestance(userInRestance);
      console.log(userInRestance);
    }
  }
  showUserinRestance(users);
}

function showUserinRestance(users) {
  document.querySelector("#restance-grid").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

<article class="list-restance">
  <h2 id="list-fullname">${users.firstName} ${users.lastName}</h2>
  <p id="list-balance" >Bruger i restance: ${users.restance}</p>
</article>
`
  );
}

export { updateUsersGrid };
