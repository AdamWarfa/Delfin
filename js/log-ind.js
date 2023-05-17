"use strict";

window.addEventListener("load", initAuth);

function initAuth() {
  runApp();

  const user = localStorage.getItem("authUser");

  if (user) {
    userIsSignedIn();
  } else {
    userIsSignedOut();
  }
}
function userIsSignedIn() {
  location.hash = "#home-link";
  document.querySelector("nav").classList.remove("hide");
}
function userIsSignedOut() {
  location.hash = "#login-section";
  document.querySelector("nav").classList.add("hide");
}

function runApp() {
  document.querySelector("#btn-sign-up").addEventListener("submit", signUpClicked);
  document.querySelector("#btn-sign-out").addEventListener("click", signOutUser);
}
function login(event) {
  event.preventDefault();
  const mail = event.target.mail.value;
  const password = event.target.password.value;

  if (mail === "test@kea.dk" && password === "test123") {
    localStorage.setItem("authUser", mail);
    document.querySelector("#signin-message").textContent = "";

    userIsSignedIn();
  } else {
    document.querySelector("#signin-message").textContent = "Wrong mail and/or password";
  }
}

function signUpClicked(event) {
  event.preventDefault();
  console.log("Log ind knap blev trykket");
}

function signOutUser() {
  localStorage.removeItem("authUser");
  userIsSignedOut();
  // location.hash = "#home-section";
  //  document.querySelector("nav").classList.remove("hide");
  //  console.log("User signed out");
}
