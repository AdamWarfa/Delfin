"use strict";

import { signUpClicked, createMember } from "./signup.js";
import { getResults, updateResults, prepareData, showResults, updateResultClicked, deleteResultClicked, createResultClicked } from "./results.js";

const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", initApp);

function initApp() {
  document.querySelector("#signup").addEventListener("submit", signUpClicked);
  //   document.querySelector("#membership-link").addEventListener("click", memberLinkClicked);
  //   document.querySelector("#home-link").addEventListener("click", homeLinkClicked);
  initViews();
  //   document.querySelector("#signup-accept").addEventListener("click", signUpClicked);
  document.querySelector("#results-link").addEventListener("click", updateResults);
  document.querySelector("#createResultForm").addEventListener("submit", createResultClicked);
  document.querySelector("#deleteResult-btn").addEventListener("click", deleteResultClicked);
  // document.querySelector("#updateResult-btn").addEventListener("click", createResultClicked);
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
  document.querySelectorAll(".view-content").forEach(link => link.classList.remove("active"));
  document.querySelectorAll(".view-link").forEach(link => link.classList.remove("active"));
}
