import { loginPage } from "./log-ind.js";
import { signUpClicked } from "./signup.js";
import { updateUsersGrid } from "./treasurer.js";
import { updateResultsGrid } from "./top5.js";
import { updateTrainerPage, createResultClicked, deleteResultClicked, sortBy } from "./trainer.js";

window.addEventListener("load", initApp);

function initApp() {
  globalEventListeners();
  initViews();
  loginPage();
  updateUsersGrid();
  updateResultsGrid();
  updateTrainerPage();
}

function globalEventListeners() {
  document.querySelector("#form-delete-result").addEventListener("submit", deleteResultClicked);
  document.querySelector("#trainer-link").addEventListener("click", updateTrainerPage);
  document.querySelector("#createResultForm").addEventListener("submit", createResultClicked);

  document.querySelector("#sortBySwimmer").addEventListener("click", () => sortBy("Swimmer"));
  document.querySelector("#sortByDiscipline").addEventListener("click", () => sortBy("Discipline"));
  document.querySelector("#sortByTime").addEventListener("click", () => sortBy("Time"));
  document.querySelector("#sortByType").addEventListener("click", () => sortBy("Type"));
  document.querySelector("#sortByMeetName").addEventListener("click", () => sortBy("MeetName"));

  document.querySelector("#signup").addEventListener("submit", signUpClicked);

  document.querySelector("#membership-link").addEventListener("click", membershipClicked);
  document.querySelector("#about-membership").addEventListener("click", membershipClicked);
  document.querySelector("#signup-nav-link").addEventListener("click", membershipClicked);

  document.querySelector("#treasurer-link").addEventListener("click", accountingClicked);
  document.querySelector("#member-overview-link").addEventListener("click", accountingClicked);
  document.querySelector("#accounting-link").addEventListener("click", accountingClicked);

  document.querySelector("#restance-grid").addEventListener("click", initViews);
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
  updateUsersGrid();
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
