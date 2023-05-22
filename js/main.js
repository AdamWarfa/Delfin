"use strict";

import { updateTrainerPage, createResultClicked, deleteResultClicked } from "./trainer.js";
import { signUpClicked } from "./signup.js";
import { updateUsersGrid } from "./treasurer.js";
import { getResults } from "./rest-service.js";

window.addEventListener("load", initApp);

function initApp() {
  const fem = "05:42";
  console.log(fem);
  console.log(Number(fem));

  globalEventListeners();
  initViews();
  updateResultsGrid();
  //   document.querySelector("#signup-accept").addEventListener("click", signUpClicked);
  document.querySelector("#form-delete-result").addEventListener("submit", deleteResultClicked);
  document.querySelector("#trainer-link").addEventListener("click", updateTrainerPage);
  document.querySelector("#createResultForm").addEventListener("submit", createResultClicked);
  // document.querySelector("sortByTime-btn").addEventListener("click", event => {
  //   event.preventDefault();
  //   sortResultClicked(resultObject);
  // });

  document.querySelector("#membership-link").addEventListener("click", membershipClicked);
  document.querySelector("#om-medlemskab").addEventListener("click", membershipClicked);
  document.querySelector("#signup-nav-link").addEventListener("click", membershipClicked);

  document.querySelector("#treasurer-link").addEventListener("click", accountingClicked);
  document.querySelector("#member-overview-link").addEventListener("click", accountingClicked);
  document.querySelector("#accounting-link").addEventListener("click", accountingClicked);

  updateUsersGrid();
}

function globalEventListeners() {
  document.querySelector("#signup").addEventListener("submit", signUpClicked);
  document.querySelector("#membership-link").addEventListener("click", membershipClicked);
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
  } else {
    console.error(`Link not found for view: ${view}`);
  }
}

function hideAllViews() {
  // remove .active for all .view-content elements (all views) and .view-link elements (all links)
  document.querySelectorAll(".view-content").forEach((link) => link.classList.remove("active"));
  document.querySelectorAll(".view-link").forEach((link) => link.classList.remove("active"));
  closeDropdowns();
}

function membershipClicked() {
  const membershipMenu = document.querySelector("#menu-membership");
  document.querySelector("#menu-membership").classList.remove("hide");
  if (membershipMenu.classList.contains("menu-closed")) {
    membershipMenu.classList.remove("menu-closed");
    membershipMenu.classList.add("menu-open");
  } else if (membershipMenu.classList.contains("menu-open")) {
    membershipMenu.classList.remove("menu-open");
    membershipMenu.classList.add("menu-closed");
  }
}

function accountingClicked() {
  const accountingMenu = document.querySelector("#menu-accounting");
  document.querySelector("#menu-accounting").classList.remove("hide");
  if (accountingMenu.classList.contains("menu-closed")) {
    accountingMenu.classList.remove("menu-closed");
    accountingMenu.classList.add("menu-open");
  } else if (accountingMenu.classList.contains("menu-open")) {
    accountingMenu.classList.remove("menu-open");
    accountingMenu.classList.add("menu-closed");
  }
}

function closeDropdowns() {
  const membershipMenu = document.querySelector("#menu-membership");
  const accountingMenu = document.querySelector("#menu-accounting");

  if (membershipMenu.classList.contains("menu-open") || accountingMenu.classList.contains("menu-open")) {
    membershipMenu.classList.remove("menu-open");
    accountingMenu.classList.remove("menu-open");
    membershipMenu.classList.add("menu-closed");
    accountingMenu.classList.add("menu-closed");
  } else {
    return null;
  }
}

async function updateResultsGrid() {
  const listOfResults = await getResults();
  showAllTop5(listOfResults);
}

async function getMember(uid) {
  const response = await fetch(`${endpoint}/users/${uid.json}`);
  const user = await response.json();
  return user;
}


function showAllTop5(listOfResults) {
  
  const sortedResults = listOfResults.sort(sortTop5);
  console.log(sortedResults);
  document.querySelector("#front-grid").innerHTML = "";

  sortedResults
    .filter((result) => result.discipline.includes("Crawl"))
    .slice(0, 5)
    .forEach(showTop5);

  sortedResults
    .filter((result) => result.discipline.includes("Brystsvømning"))
    .slice(0, 5)
    .forEach(showTop5);

  sortedResults
    .filter((result) => result.discipline.includes("Butterfly"))
    .slice(0, 5)
    .forEach(showTop5);

  sortedResults
    .filter((result) => result.discipline.includes("Rygcrawl"))
    .slice(0, 5)
    .forEach(showTop5);
}

function sortTop5(a, b) {
  return a.time.localeCompare(b.time);
}
// Funktion til DOM-manipulation
async function showTop5(resultsObject) {
    const user = await getMember(resultsObject.uid);

  document.querySelector("#front-grid").insertAdjacentHTML(
    "beforeend",
    /*html*/ `

<article class="top5-card">
<h2 id="list-name">${user.firstname}</h2>
<p id="list-name">${resultsObject.discipline}</p>
<p id="list-name">${resultsObject.time}</p>

</article>
`
  );
}
