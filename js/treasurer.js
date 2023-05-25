import { getUsers, deleteUserClicked, updateUser } from "./rest-service.js";
import { getAge } from "./signup.js";

let users;

window.addEventListener("load", start);

function start() {
  document.querySelector("#form-update-member").addEventListener("submit", updateMemberClicked);
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

function showUser(userObject) {
  document.querySelector("#treasurer-grid").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

<article class="list-user">
<h2 id="list-name">${userObject.firstName + " " + userObject.lastName}</h2>
<div id="user-grid" class="user-grid-border">
  <p id="list-birthday" class="user-grid-border">${userObject.birthday + " " + "Alder:" + userObject.age}</p>
  <p id="list-street" class="user-grid-border">${userObject.street + " " + userObject.houseNumber}</p>
  <p id="list-city" class="user-grid-border">${userObject.postCode + " " + userObject.city} </p>
  <p id="list-email" class="user-grid-border">${userObject.email}</p>
  <p id="list-phonenumber" class="user-grid-border">${userObject.phoneNumber}</p>
  <p id="list-membertype" class="user-grid-border">Medlemsskab: ${userObject.memberType}</p>



  </div>
  <button id="btn-show-member" type="button" class="responsive-button">Vis mere</button>
  <button id="user-btn-delete" class="responsive-button">Slet medlem</button>
  <button id="user-btn-update" class="responsive-button">Opdater medlem</button>
</article>
`
  );

  // Click events til at slette brugere
  document.querySelector("#treasurer-grid article:last-child #user-btn-delete").addEventListener("click", () => openTreasurerDialog(userObject));
  document.querySelector("#treasurer-grid article:last-child #user-btn-update").addEventListener("click", () => updateClicked(userObject));
  document.querySelector("#treasurer-grid article:last-child #btn-show-member").addEventListener("click", () => showUserInDialog(userObject));
}

function showUsersinRestance(users) {
  document.querySelector("#restance-grid").innerHTML = "";

  users.filter((user) => user.restance).forEach(showUserinRestance); // samme som
  // for (let i = 0; i < users.length; i++) {
  //   try {
  //     let userInRestance;
  //     if (users[i].restance === true) {
  //       userInRestance = users[i];
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
      <div id="user-restance-grid" class="user-grid-border">
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

  const userListMotionist = users.filter((user) => user.levelType.includes("motionist"));
  const userListKonkurrencesvømmer = users.filter((user) => user.levelType.includes("konkurrencesvømmer"));

  const contingencyExpectedMotionist = contingency(userListMotionist);
  const contingencyExpectedKonkurrencesvømmer = contingency(userListKonkurrencesvømmer);

  document.querySelector("#accounting-overview").innerHTML = "";

  document.querySelector("#accounting-overview").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

    <article class="contingency-incoming-area">
      <div>
        <h2 class="contingency-expected">Indkommende kontingent for dette år i alt: <br><b class="incoming-contingency-color">${contingencyExpectedTotal}kr.</b></h2>
        <p class="members-paying-contingency">Antal medlemmer der betaler kontingent: ${users.length}</p>
      </div>      
      
      <div>
        <h2 class="contingency-expected">Indkommende kontingent for motionister: <br><b class="incoming-contingency-color">${contingencyExpectedMotionist}kr.</b></h2>
        <p class="members-paying-contingency">Antal motionister der betaler kontingent: ${userListMotionist.length}</p>
      </div>   

      <div>
        <h2 class="contingency-expected">Indkommende kontingent for konkurrencesvømmere: <br><b class="incoming-contingency-color">${contingencyExpectedKonkurrencesvømmer}kr.</b></h2>
        <p class="members-paying-contingency">Antal konkurrencesvømmere der betaler kontingent: ${userListKonkurrencesvømmer.length}</p>
      </div>
    </article>
    `
  );
}

function closeDialog() {
  document.querySelector("#update-member-dialog").close();
  document.querySelector("#medlemsoversigt-dialog").close();
}

async function updateMemberClicked(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="swimTypes"]:checked');

  const form = event.target;
  const firstName = form.firstName.value;
  const lastName = form.lastName.value;
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

  checkboxes.forEach((checkbox) => {
    swimTypes.push(checkbox.value);
  });
  const response = await updateUser(firstName, lastName, birthday, age, street, houseNumber, postCode, city, email, phoneNumber, memberType, restance, ageGroup, levelType, swimTypes, id);

  if (response.ok) {
    updateUsersGrid();
    closeDialog();
  }
}

function showUserInDialog(userObject) {
  document.querySelector("#medlemsoversigt-dialog").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

<article class="list-user">
<h2 id="list-name">${userObject.firstName + " " + userObject.lastName}</h2>
<div id="user-information-grid" class="user-grid-border">
  <p id="list-birthday" class="user-grid-border">Fødselsdato: ${userObject.birthday + " Alder: " + userObject.age}</p>
  <p id="list-street" class="user-grid-border">Adresse: ${userObject.street + " Husnummer " + userObject.houseNumber}</p>
  <p id="list-city" class="user-grid-border">Postnummer: ${userObject.postCode + " By: " + userObject.city} </p>
  <p id="list-email" class="user-grid-border">Email: ${userObject.email}</p>
  <p id="list-phonenumber" class="user-grid-border">Telefonnummer: ${userObject.phoneNumber}</p>
  <p id="list-membertype" class="user-grid-border">Medlemsskab: ${userObject.memberType}</p>
  <p id="list-agegroup" class="user-grid-border" >Aldersgruppe: ${userObject.ageGroup}</p>
  <p id="list-leveltype" class="user-grid-border">Aktivitetsform: <br> <br> ${userObject.levelType}</p>
  <p id="list-restance" class="user-grid-border">Bruger i restance: ${userObject.restance}</p>
  <p id="list-restance" class="user-grid-border">Svømmedisciplin: ${userObject.swimTypes}</p>

  </div>
  <button id="user-btn-close" class="responsive-button">Luk</button>

</article>
`
  );
  document.querySelector("#medlemsoversigt-dialog").showModal();
  document.querySelector("#user-btn-close").addEventListener("click", () => {
    document.querySelector("#medlemsoversigt-dialog").innerHTML = "";
    document.querySelector("#medlemsoversigt-dialog").close();
  });
}

function updateClicked(userObject) {
  const updateForm = document.querySelector("#form-update-member");

  updateForm.firstName.value = userObject.firstName;
  updateForm.lastName.value = userObject.lastName;
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
  document.querySelector("#close-member-btn").addEventListener("click", () => document.querySelector("#update-member-dialog").close());
}

function openTreasurerDialog(userObject) {
  document.querySelector("#delete-dialog").showModal();
  document.querySelector("#btn-delete-dialog").addEventListener("click", () => deleteUserClicked(userObject));
  document.querySelector("#btn-delete-dialog").addEventListener("click", closeTreasurerDialog);
  document.querySelector("#btn-cancel-dialog").addEventListener("click", closeTreasurerDialog);
}

function closeTreasurerDialog() {
  document.querySelector("#delete-dialog").close();
}

/* =============== EXPORT =============== */

export { updateUsersGrid, contingency };
