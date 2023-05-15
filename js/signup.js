"use strict";

const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";
window.addEventListener("load", initApp);

function initApp() {
  document.querySelector("#signup").addEventListener("submit", signUpClciked);
  //   document.querySelector("#membership-link").addEventListener("click", memberLinkClicked);
  //   document.querySelector("#home-link").addEventListener("click", homeLinkClicked);
  initViews();
  //   document.querySelector("#signup-accept").addEventListener("click", signUpClciked);
}

function initViews() {
  window.addEventListener("hashchange", viewChange); // whenever the hash changes (you hit a link or change the hash)
  viewChange(); // by default, call viewChange to display the first view
}

function viewChange() {
  let hashLink = "#home-section"; // default view

  if (location.hash) {
    // if there's a hash value, use as link
    hashLink = location.hash;
  }

  hideAllViews(); // hide all views

  document.querySelector(hashLink).classList.add("active"); // add .active to the view you want to show
  setActiveLink(hashLink); // set active link in nav bar
}

function setActiveLink(view) {
  const link = document.querySelector(`a.view-link[href="${view}"]`); // reference to link in nav bar
  if (link) {
    link.classList.add("active"); // add .active to active link in nav bar
  }
}

function hideAllViews() {
  // remove .active for all .view-content elements (all views) and .view-link elements (all links)
  document.querySelectorAll(".view-content").forEach((link) => link.classList.remove("active"));
  document.querySelectorAll(".view-link").forEach((link) => link.classList.remove("active"));
}

async function signUpClciked(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="swimTypes"]:checked');

  const form = event.target;
  const firstName = form.firstname.value;
  const lastName = form.lastname.value;
  const birthday = form.birthday.value;
  const street = form.street.value;
  const houseNumber = form.houseNumber.value;
  const postCode = form.postCode.value;
  const city = form.city.value;
  const email = form.email.value;
  const phoneNumber = form.phoneNumber.value;
  const memberType = form.memberType.value;
  const ageGroup = form.ageGroup.value;
  const levelType = form.levelType.value;
  const swimTypes = [];
  checkboxes.forEach((checkbox) => {
    swimTypes.push(checkbox.value);
  });

  const response = await createMember(firstName, lastName, birthday, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, swimTypes);
  if (response.ok) {
    console.log("New movie succesfully added to Firebase 🔥");
  }
}

async function createMember(firstName, lastName, birthday, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, swimTypes) {
  const newMember = {
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    street: street,
    houseNumber: houseNumber,
    postCode: postCode,
    city: city,
    email: email,
    phoneNumber: phoneNumber,
    memberType: memberType,
    ageGroup: ageGroup,
    levelType: levelType,
    swimTypes: swimTypes,

  };
  const json = JSON.stringify(newMember);

  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: json,
  });

  return response;
}
