"use strict";

window.addEventListener("load", start);

// Globale variabler

function start() {
  //   globalEventListeners();
}

// function globalEventListeners() {
//   document.querySelector;
// }

const members = {
  name: "",
  dob: "05-02-2001",
  email: "",
  phone: "",
  address: "",
  active: "",
  restance: "",
  type: "",
};

// navn, dob, email, tlf, aktiv, passiv, restance,

function getAge(dob) {
  const today = new Date();
  const userBirthday = new Date(dob);
  const checkIfSenior = today.getTime() - userBirthday.getTime();

  return checkIfSenior;
}
