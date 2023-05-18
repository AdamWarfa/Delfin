"use strict";

window.addEventListener("load", initAuth);

function initAuth() {
  runApp();
  document.querySelector("#btn-sign-out").addEventListener("click", openLogOutDialog);
  document.querySelector("#btn-log-out-cancel").addEventListener("click", closeLogOutDialog);
  document.querySelector("#btn-log-out-final").addEventListener("click", signOutUser);

  const user = localStorage.getItem("authUser");

  if (user) {
    userIsSignedIn();
  } else {
    userIsSignedOut();
  }
}
function userIsSignedIn() {
  location.hash = "#home-link";
  // document.querySelector("nav").classList.remove("hide");
  document.querySelector("#treasurer-link").classList.remove("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.remove("log-in-hidden");
  document.querySelector("#log-ind-link").classList.add("log-in-hidden");
}

function userIsSignedOut() {
  location.hash = "#home-section";
  // document.querySelector("nav").classList.add("hide");
  document.querySelector("#treasurer-link").classList.add("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.add("log-in-hidden");
  document.querySelector("#log-ind-link").classList.remove("log-in-hidden");
}

function runApp() {
  document.querySelector("#login-form").addEventListener("submit", login);
  // document.querySelector("#btn-sign-out").addEventListener("click", signOutUser);
}
function login(event) {
  event.preventDefault();
  const mail = event.target.mail.value;
  const password = event.target.password.value;

  if (mail === "kasper@kea.dk" && password === "test123") {
    localStorage.setItem("authUser", mail);
    document.querySelector("#signin-message").textContent = "";

    userIsSignedIn();
  } else {
    document.querySelector("#signin-message").textContent = "Wrong mail and/or password";
  }
}

function openLogOutDialog() {
  document.querySelector("#log-out-dialog").showModal();
}
function closeLogOutDialog() {
  document.querySelector("#log-out-dialog").close();
}

function signOutUser() {
  closeLogOutDialog();
  localStorage.removeItem("authUser");
  userIsSignedOut();

  // allerede udkommenteret
  // location.hash = "#home-section";
  //  document.querySelector("nav").classList.remove("hide");
  //  console.log("User signed out");
}
