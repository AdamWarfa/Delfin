import { getUsers, deleteUserClicked, updateUser } from "./rest-service.js";
import { getAge } from "./signup.js";

let users;

window.addEventListener("load", start);

function start() {
  document.querySelector("#form-update-member").addEventListener("submit", updateMemberClciked);
}

async function updateUsersGrid() {
  users = await getUsers();
  showUsers(users);
  showUsersinRestance(users);
  showIncomingContingency(users);
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

<article class="list-user">
<h2 id="list-name">${userObject.firstName + " " + userObject.lastName}</h2>
<div id="user-grid" class="user-grid-border">
  <p id="list-birthday" class="user-grid-border">Fødselsdato: ${userObject.birthday}</p>
  <p id="list-age" class="user-grid-border">Alder: ${userObject.age}</p>
  <p id="list-street" class="user-grid-border">Adresse: ${userObject.street}</p>
  <p id="list-housenumber"class="user-grid-border">Husnummer: ${userObject.houseNumber}</p>
  <p id="list-postcode" class="user-grid-border">Postkode: ${userObject.postCode}</p>
  <p id="list-city" class="user-grid-border">By: ${userObject.city}</p>
  <p id="list-email" class="user-grid-border">Email: ${userObject.email}</p>
  <p id="list-phonenumber" class="user-grid-border">Telefon nummer: ${userObject.phoneNumber}</p>
  <p id="list-membertype" class="user-grid-border">Medlemsskab: ${userObject.memberType}</p>
  <p id="list-agegroup" class="user-grid-border" >Aldersgruppe: ${userObject.ageGroup}</p>
  <p id="list-leveltype" class="user-grid-border">Aktivitetsform: <br> <br> ${userObject.levelType}</p>
  <p id="list-restance" class="user-grid-border">Bruger i restance: ${userObject.restance}</p>
  </div>
  <button id="user-btn-delete">Slet medlem</button>
  <button id="user-btn-update">Opdater medlem</button>
</article>
`
  );

  // Click events til at slette brugere
  document.querySelector("#treasurer-grid article:last-child #user-btn-delete").addEventListener("click", () => deleteUserClicked(userObject));
  document.querySelector("#treasurer-grid article:last-child #user-btn-update").addEventListener("click", () => updateClicked(userObject));
}

function showUsersinRestance(users) {
  document.querySelector("#restance-grid").innerHTML = "";

  users.filter(user => user.restance).forEach(showUserinRestance); // samme som
  // for (let i = 0; i < users.length; i++) {
  //   try {
  //     let userInRestance;
  //     if (users[i].restance === true) {
  //       userInRestance = users[i];
  //       console.log(userInRestance);
  //       showUserinRestance(userInRestance);
  //     }
  //   } catch (error) {
  //     console.log("fejl");
  //   }
  // }
}

function showUserinRestance(users) {
  document.querySelector("#restance-grid").insertAdjacentHTML(
    "beforeend",
    /*html*/ `
    
    <article class="list-restance">
      <div id="user-grid" class="user-grid-border">
        <a href="#treasurer-section" id="restance-user-styling"><h2 id="list-fullname">${users.firstName} ${users.lastName}</h2></a>
        <p id="list-balance" >${users.firstName} er i restance</p>
      </div>
    </article>
`
  );
}

function contingency(members) {
  const membershipFees = {
    passiveFee: 500,
    youthFee: 1000,
    seniorFee: 1600,
    seniorDiscount: 1200,
  };

  let fee;
  let totalFee = 0;

  for (const member of members) {
    if (member.memberType === "passive") {
      fee = membershipFees.passiveFee;
    } else if (member.memberType === "active" && member.ageGroup === "senior") {
      fee = membershipFees.seniorFee;
      if (member.age >= 60) {
        fee = membershipFees.seniorDiscount;
      }
    } else if (member.memberType === "active" && member.ageGroup === "junior") {
      fee = membershipFees.youthFee;
    }
    totalFee += fee;
  }
  return totalFee;
}

function showIncomingContingency(users) {
  const contingencyExpectedTotal = contingency(users);

  const userListMotionist = users.filter(user => user.levelType.includes("motionist"));
  const userListKonkurrencesvømmer = users.filter(user => user.levelType.includes("konkurrencesvømmer"));

  const contingencyExpectedMotionist = contingency(userListMotionist);
  const contingencyExpectedKonkurrencesvømmer = contingency(userListKonkurrencesvømmer);

  document.querySelector("#accounting-overview").innerHTML = "";

  document.querySelector("#accounting-overview").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

    <article class="contingency-incoming">
      <div>
        <h2 class="contingency-expected">Indkommende kontingent for denne måned i alt: <br>${contingencyExpectedTotal}kr.</h2>
        <p class="members-paying-contingency">Antal medlemmer der betaler kontingent: ${users.length}</p>
      </div>      
      
      <div>
        <h2 class="contingency-expected">Indkommende kontingent for motionister: <br>${contingencyExpectedMotionist}kr.</h2>
        <p class="members-paying-contingency">Antal motionister der betaler kontingent: ${userListMotionist.length}</p>
      </div>   

      <div>
        <h2 class="contingency-expected">Indkommende kontingent for konkurrencesvømmere: <br>${contingencyExpectedKonkurrencesvømmer}kr.</h2>
        <p class="members-paying-contingency">Antal konkurrencesvømmere der betaler kontingent: ${userListKonkurrencesvømmer.length}</p>
      </div>
    </article>
    `
  );
}

function closeDialog() {
  document.querySelector("#update-member-dialog").close();
}

async function updateMemberClciked(event) {
  event.preventDefault();

  const form = event.target;
  const firstname = form.firstname.value;
  const lastname = form.lastname.value;
  const birthday = form.birthday.value;
  const age = getAge(birthday);
  const street = form.street.value;
  const houseNumber = form.houseNumber.value;
  const postCode = form.postCode.value;
  const city = form.city.value;
  const email = form.email.value;
  const phoneNumber = form.phoneNumber.value;
  const memberType = form.memberType.value;
  const ageGroup = form.ageGroup.value;
  const levelType = form.levelType.value;
  const restance = form.restance.value === "true";
  const swimTypes = [];
  const id = form.getAttribute("data-id");

  const response = await updateUser(firstname, lastname, birthday, age, street, houseNumber, postCode, city, email, phoneNumber, memberType, restance, ageGroup, levelType, swimTypes, id);

  if (response.ok) {
    console.log("Update clicked", id);
    updateUsersGrid();
    closeDialog();
  }
}

function updateClicked(userObject) {
  const updateForm = document.querySelector("#form-update-member");

  updateForm.firstname.value = userObject.firstName;
  updateForm.lastname.value = userObject.lastname;
  updateForm.birthday.value = userObject.birthday;
  updateForm.street.value = userObject.street;
  updateForm.houseNumber.value = userObject.houseNumber;
  updateForm.postCode.value = userObject.postCode;
  updateForm.city.value = userObject.city;
  updateForm.email.value = userObject.email;
  updateForm.phoneNumber.value = userObject.phoneNumber;
  updateForm.memberType.value = userObject.memberType;
  updateForm.ageGroup.value = userObject.ageGroup;
  updateForm.levelType.value = userObject.levelType;
  updateForm.restance.value = userObject.restance;
  updateForm.swimTypes.value = userObject.swimTypes;
  updateForm.setAttribute("data-id", userObject.id);

  document.querySelector("#update-member-dialog").showModal();
}

export { updateUsersGrid, contingency };
