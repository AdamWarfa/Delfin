"use strict";

window.addEventListener("load", initAuth);

function initAuth() {
  runApp();
  document.querySelector("#btn-sign-out").addEventListener("click", openLogOutDialog);
  document.querySelector("#btn-log-out-cancel").addEventListener("click", closeLogOutDialog);
  document.querySelector("#btn-log-out-final").addEventListener("click", signOutUser);

  const treasurer = localStorage.getItem("authTreasurer");
  const coach = localStorage.getItem("authCoach");

  if (treasurer) {
    coachIsSignedOut();
    treasurerIsSignedIn();
  } else if (coach) {
    treasurerIsSignedOut();
    coachIsSignedIn();
  } else {
    treasurerIsSignedOut();
    coachIsSignedOut();
  }
}
function treasurerIsSignedIn() {
  location.hash = "#treasurer-section";
  // document.querySelector("nav").classList.remove("hide");
  document.querySelector("#treasurer-link").classList.remove("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.remove("log-in-hidden");
  document.querySelector("#log-ind-link").classList.add("log-in-hidden");
}

function treasurerIsSignedOut() {
  location.hash = "#home-section";
  // document.querySelector("nav").classList.add("hide");
  document.querySelector("#treasurer-link").classList.add("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.add("log-in-hidden");
  document.querySelector("#log-ind-link").classList.remove("log-in-hidden");
}

function runApp() {
  document.querySelector("#login-form").addEventListener("submit", treasurerLogin);
  document.querySelector("#login-form").addEventListener("submit", coachLogin);
  // document.querySelector("#btn-sign-out").addEventListener("click", signOutUser);
}
function treasurerLogin(event) {
  event.preventDefault();
  const mail = event.target.mail.value;
  const password = event.target.password.value;

  if (mail === "kasper@kea.dk" && password === "test123") {
    localStorage.setItem("authTreasurer", mail);
    document.querySelector("#signin-message").textContent = "";

    treasurerIsSignedIn();
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

function coachIsSignedIn() {
  location.hash = "#trainer-section";
  // document.querySelector("nav").classList.remove("hide");
  document.querySelector("#trainer-link").classList.remove("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.remove("log-in-hidden");
  document.querySelector("#log-ind-link").classList.add("log-in-hidden");
}

function coachIsSignedOut() {
  location.hash = "#home-section";
  // document.querySelector("nav").classList.add("hide");
  document.querySelector("#trainer-link").classList.add("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.add("log-in-hidden");
  document.querySelector("#log-ind-link").classList.remove("log-in-hidden");
}

function coachLogin(event) {
  event.preventDefault();
  const mail = event.target.mail.value;
  const password = event.target.password.value;

  if (mail === "coach@kea.dk" && password === "coach123") {
    localStorage.setItem("authCoach", mail);
    document.querySelector("#signin-message").textContent = "";

    coachIsSignedIn();
  } else {
    document.querySelector("#signin-message").textContent = "Wrong mail and/or password";
  }
}

function signOutUser() {
  closeLogOutDialog();
  localStorage.removeItem("authTreasurer");
  localStorage.removeItem("authCoach");
  coachIsSignedOut();
  treasurerIsSignedOut();

  // allerede udkommenteret
  // location.hash = "#home-section";
  //  document.querySelector("nav").classList.remove("hide");
  //  console.log("User signed out");
}
