"use strict";

import { updateTrainerPage, createResultClicked, deleteResultClicked, inputResultSearchChanged, sortBy } from "./trainer.js";
import { signUpClicked } from "./signup.js";
import { updateUsersGrid } from "./treasurer.js";
import { getResults } from "./rest-service.js";

window.addEventListener("load", initApp);
const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

function initApp() {
  globalEventListeners();
  initViews();
  updateResultsGrid();

  document.querySelector("#form-delete-result").addEventListener("submit", deleteResultClicked);
  document.querySelector("#trainer-link").addEventListener("click", updateTrainerPage);
  document.querySelector("#createResultForm").addEventListener("submit", createResultClicked);
  // document.querySelector("#input-search-result").addEventListener("keyup", inputResultSearchChanged);
  // document.querySelector("#input-search-result").addEventListener("search", inputResultSearchChanged);

  document.querySelector("#sortBySwimmer").addEventListener("click", () => sortBy("Swimmer"));
  document.querySelector("#sortByDiscipline").addEventListener("click", () => sortBy("Discipline"));
  document.querySelector("#sortByTime").addEventListener("click", () => sortBy("Time"));
  document.querySelector("#sortByType").addEventListener("click", () => sortBy("Type"));
  document.querySelector("#sortByMeetName").addEventListener("click", () => sortBy("MeetName"));

  document.querySelector("#membership-link").addEventListener("click", membershipClicked);
  document.querySelector("#om-medlemskab").addEventListener("click", membershipClicked);
  document.querySelector("#signup-nav-link").addEventListener("click", membershipClicked);

  document.querySelector("#treasurer-link").addEventListener("click", accountingClicked);
  document.querySelector("#member-overview-link").addEventListener("click", accountingClicked);
  document.querySelector("#accounting-link").addEventListener("click", accountingClicked);

  updateUsersGrid();
  updateTrainerPage();
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
  changeHeader(hashLink);
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

function changeHeader(hashLink) {
  if (hashLink === "#home-section") {
    document.querySelector("header").style.backgroundColor = "transparent";
    document.querySelector("header").style.position = "absolute";
  } else {
    document.querySelector("header").style.backgroundColor = "#394867";
    document.querySelector("header").style.position = "fixed";
  }
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
  const response = await fetch(`${endpoint}/users/${uid}.json`);
  const user = await response.json();
  return user;
}

function showAllTop5(listOfResults) {
  const sortedResults = listOfResults.sort(sortTop5);
  console.log(sortedResults);
  document.querySelector("#front-grid-crawl").innerHTML = "";
  document.querySelector("#front-grid-brystsvømning").innerHTML = "";
  document.querySelector("#front-grid-butterfly").innerHTML = "";
  document.querySelector("#front-grid-rygcrawl").innerHTML = "";

  const filteredResultsCrawl = sortedResults.filter((result) => result.discipline.includes("Crawl")).slice(0, 5);
  console.log(filteredResultsCrawl);

  const filteredResultsBrystsvømning = sortedResults.filter((result) => result.discipline.includes("Brystsvømning")).slice(0, 5);
  console.log(filteredResultsBrystsvømning);

  const filteredResultsButterfly = sortedResults.filter((result) => result.discipline.includes("Butterfly")).slice(0, 5);
  console.log(filteredResultsButterfly);

  const filteredResultsRygcrawl = sortedResults.filter((result) => result.discipline.includes("Rygcrawl")).slice(0, 5);
  console.log(filteredResultsRygcrawl);

  showTop5(filteredResultsCrawl, "crawl");
  showTop5(filteredResultsBrystsvømning, "brystsvømning");
  showTop5(filteredResultsButterfly, "butterfly");
  showTop5(filteredResultsRygcrawl, "rygcrawl");
}

function sortTop5(a, b) {
  return a.time.localeCompare(b.time);
}
// Funktion til DOM-manipulation

async function showTop5(results, discipline) {
  for (const result of results) {
    try {
      console.log(result);

      const user = await getMember(result.swimmer);
      console.log(user);

      console.log("#front-grid-" + discipline);
      const grid = document.querySelector("#front-grid-" + discipline);
      console.log(grid);

      grid.insertAdjacentHTML(
        "beforeend",
        /*html*/ `

<article class="top5-card">
  <div id="top5-color">
    <h2>${user.firstName} ${user.lastName}</h2>
  </div>
  <p>${user.ageGroup}</p>
  <p>${result.meetName}</p>
  <p>${result.discipline}</p>
  <p>${result.time}</p>

</article>
`
      );
    } catch (error) {
      console.log(`fejl i result ${result.id}`);
    }
  }
}
export { getMember };
