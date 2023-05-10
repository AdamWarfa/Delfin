"use strict";

const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";
window.addEventListener("load", initApp);

function initApp() {
  document.querySelector("#signup").addEventListener("submit", signUpClciked);
  //   document.querySelector("#signup-accept").addEventListener("click", signUpClciked);
}

async function signUpClciked(event) {
  event.preventDefault();

  const form = event.target;
  const firstName = form.firstname.value;
  const lastName = form.lastname.value;
  const birthday = form.birthday.value;

  const response = await createMember(firstName, lastName, birthday);
}
if (response.ok) {
  console.log("New movie succesfully added to Firebase 🔥");
}

async function createMember(firstName, lastName, birthday) {
  const newMember = {
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
  };
  const json = JSON.stringify(newMember);

  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: json,
  });

  return response;
}
