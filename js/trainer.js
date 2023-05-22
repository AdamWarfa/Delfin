"use strict";

import { getUsers, getResults, deleteResult, createResult, updateResult } from "./rest-service.js";

////---------- SHOW/GET results ----------////

async function updateTrainerPage() {
  console.log("Testing: Updating trainer page");
  document.querySelector("#resultsTableBody").innerHTML = "";
  document.querySelector("#resultsTableHeader").innerHTML = "";
  document.querySelector("#resultUsersCreate").innerHTML = "";
  document.querySelector("#resultUsersEdit").innerHTML = "";


  location.hash = "#trainer-section";
  const results = await getResults();
  const users = await getUsers();
  showResults(results);
  insertSwimmersDropdown(users);
  closeDialog();
}

function insertSwimmersDropdown(listOfUsers) {
  for (const user of listOfUsers) {
    try {
      insertSwimmerDropdown(user);
    } catch (error) {
      console.log(error);
    }
  }

  function insertSwimmerDropdown(resultObject) {
    document
      .querySelector("#resultUsersEdit")
      .insertAdjacentHTML("beforeend", /* HTML */ ` <option value="${resultObject.firstName} ${resultObject.lastName}">${resultObject.firstName} ${resultObject.lastName}</option> `);
    document
      .querySelector("#resultUsersCreate")
      .insertAdjacentHTML("beforeend", /* HTML */ ` <option value="${resultObject.firstName} ${resultObject.lastName}">${resultObject.firstName} ${resultObject.lastName}</option> `);
  }
}
function showResults(listOfResults) {
  document.querySelector("#resultsTableHeader").insertAdjacentHTML(
    "beforeend",
    /* html */
    `
      <tr>
        <td>Svømmer</td>
        <td>Disciplin</td>
        <td>Tid</td>
        <td>Type</td>
        <td>Stævne</td>
        <td>Aldersgruppe</td>
      </tr>
    `
  );

  /* 
  Når man laver et nyt "create post", giver den fejlbesked i konsollen, da objektets datastruktur ikke stemmer overens med databasen.
  Derfor implementerede vi en try catch som gerne skulle fange fejlbeskederne.
  */
  for (const result of listOfResults) {
    try {
      showResult(result);
    } catch (error) {
      console.log(error);
    }
  }
}

function showResult(resultObject) {
  document.querySelector("#resultsTableBody").insertAdjacentHTML(
    "beforeend",
    /* HTML */ `
      <tr>
        <td>${resultObject.swimmer}</td>
        <td>${resultObject.discipline}</td>
        <td>${resultObject.time}</td>
        <td>${resultObject.type}</td>
        <td>${resultObject.meetName}</td>
        <td>${resultObject.aldersgruppe}</td>

        <td><button id="editResult-btn" class="orangeBtn">Edit</button></td>
        <td><button id="deleteResult-btn" class="redBtn">Delete</button></td>
      </tr>
    `
  );

  document.querySelector("#resultsTableBody tr:last-child #deleteResult-btn").addEventListener("click", (event) => {
    event.preventDefault();
    openDeleteDialog(resultObject);
  });
  document.querySelector("#resultsTableBody tr:last-child #editResult-btn").addEventListener("click", (event) => {
    event.preventDefault();
    openEditDialog(resultObject);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDialog();
    }
  });
}

////---------- CREATE results ----------////

async function createResultClicked(event) {
  const form = event.target;
  const discipline = form.discipline.value;
  const meetName = form.meetName.value;
  const swimmer = form.swimmer.value;
  const time = form.time.value;
  const type = form.type.value;
  const agegroup = form.type.value;
  const id = form.getAttribute("data-id");

  const response = await createResult(discipline, meetName, swimmer, time, type, agegroup, id);
  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    updateTrainerPage();
    form.reset();
    closeDialog();
  }
}

////---------- EDIT RESULT ----------////

function openEditDialog(resultObject) {
  const updateForm = document.querySelector("#editResultForm");

  updateForm.swimmer.value = resultObject.swimmer;
  updateForm.discipline.value = resultObject.discipline;
  updateForm.time.value = resultObject.time;
  updateForm.type.value = resultObject.type;
  updateForm.meetName.value = resultObject.meetName;
  updateForm.setAttribute("data-id", resultObject.id);

  document.querySelector("#dialog-edit-result").showModal();

  document.querySelector("#editResultForm").addEventListener("submit", updateResultClicked);
  document.querySelector("#cancelUpdateResult-btn").addEventListener("click", closeDialog);
}

function closeDialog() {
  // Lukker dialog, fjerner formørkelse
  document.querySelector("#dialog-edit-result").close();
  document.querySelector("#dialog-delete-result").close();
}

async function updateResultClicked(event) {
  event.preventDefault();

  const form = event.target;
  const discipline = form.discipline.value;
  const meetName = form.meetName.value;
  const swimmer = form.swimmer.value;
  const time = form.time.value;
  const type = form.type.value;
  const id = form.getAttribute("data-id");

  const response = await updateResult(discipline, meetName, swimmer, time, type, id);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    // Opdater MoviesGrid til at displaye all film og den nye film
    updateTrainerPage();
    form.reset();
    closeDialog();
  }
}

////---------- DELETE results ----------////

async function openDeleteDialog(dataObject) {
  document.querySelector("#form-delete-result").setAttribute("data-id", dataObject.id);
  document.querySelector("#dialog-delete-result").showModal();
  document.querySelector("#cancelDeleteResult-btn").addEventListener("click", closeDialog);
}

async function deleteResultClicked() {
  let id = document.querySelector("#form-delete-result").getAttribute("data-id");
  console.log(`Testing: ${id} deleted`);
  const response = await deleteResult(id);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    updateTrainerPage();
  }
}

export { updateTrainerPage, createResultClicked, deleteResultClicked };
