import { getUsers, deleteUserClicked } from "./rest-service.js";

let users;

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
  <p id="list-leveltype" class="user-grid-border">Aktivitetsform: ${userObject.levelType}</p>
  <p id="list-restance" class="user-grid-border">Bruger i restance: ${userObject.restance}</p>
  </div>
  <button id="user-btn-delete">DELETE</button>
</article>
`
  );

  // Click events til at slette brugere
  document.querySelector("#treasurer-grid article:last-child #user-btn-delete").addEventListener("click", () => deleteUserClicked(userObject));
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
        <h2 id="list-fullname">${users.firstName} ${users.lastName}</h2>
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

  let totalFee = 0;
  for (const member of members) {
    let fee;
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
  const totalContingencyExpected = contingency(users);
  document.querySelector("#accounting-overview").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

    <article class="contingency-incoming">
      <div>
        <h2 class="contingency-expected">Indkommende kontingent for denne måned: <br>${totalContingencyExpected}kr.</h2>
        <p class="members-paying-contingency">Antal medlemmer der betaler kontingent: ${users.length}</p>
      </div>
    </article>
    `
  );
}

export { updateUsersGrid, contingency };
