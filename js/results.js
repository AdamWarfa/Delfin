"use strict";

import { getUsers, getResults } from "./rest-service.js";

const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

function editResultClicked(resultObject) {
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
}

////---------- Update and show results ----------////

async function updateResultsPage() {
  console.log("Updating results");
  document.querySelector("#resultsTableBody").innerHTML = "";
  document.querySelector("#resultsTableHeader").innerHTML = "";
  document.querySelector("#resultUsersCreate").innerHTML = "";
  document.querySelector("#resultUsersEdit").innerHTML = "";

  const results = await getResults();
  const users = await getUsers();
  showResults(results);
  insertSwimmersDropdown(users);
}

function insertSwimmersDropdown(listOfUsers) {
  console.log("TEST");
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
  console.log("Showing results");
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
  console.log("Showing result");
  document.querySelector("#resultsTableBody").insertAdjacentHTML(
    "beforeend",
    /* HTML */ `
      <tr>
        <td>${resultObject.swimmer}</td>
        <td>${resultObject.discipline}</td>
        <td>${resultObject.time}</td>
        <td>${resultObject.type}</td>
        <td>${resultObject.meetName}</td>
        <td><button id="editResult-btn" class="orangeBtn">Edit</button></td>
        <td><button id="deleteResult-btn" class="redBtn">Delete</button></td>
      </tr>
    `
  );

  document.querySelector("#resultsTableBody tr:last-child #deleteResult-btn").addEventListener("click", event => {
    event.preventDefault();
    confirmDelete(resultObject);
  });
  document.querySelector("#resultsTableBody tr:last-child #editResult-btn").addEventListener("click", event => {
    event.preventDefault();
    editResultClicked(resultObject);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeDialog();
    }
  });
}

////---------- CREATE results ----------////

async function createResultClicked(event) {
  console.log("TEST");

  const form = event.target;
  const discipline = form.discipline.value;
  const meetName = form.meetName.value;
  const swimmer = form.swimmer.value;
  const time = form.time.value;
  const type = form.type.value;
  const id = form.getAttribute("data-id");

  console.log(id);

  const response = await createResult(discipline, meetName, swimmer, time, type, id);
  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    console.log("New result added to the DB");
    //// Remove HTML from table and update shown results
    form.reset();
    updateResultsPage();
  }
}

////---------- CREATE REST ----------////

async function createResult(discipline, meetName, swimmer, time, type, id) {
  const newResult = {
    discipline: discipline,
    meetName: meetName,
    swimmer: swimmer,
    time: time,
    type: type,
    id: id,
  };
  const json = JSON.stringify(newResult);

  const response = await fetch(`${endpoint}/results.json`, {
    method: "POST",
    body: json,
  });

  return response;
}

////---------- EDIT RESULT ----------////

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
    console.log("Update  clicked!", id);
    // Opdater MoviesGrid til at displaye all film og den nye film
    updateResultsPage();
    form.reset();
    closeDialog();
  }
}

////---------- UPDATE REST ----------////

async function updateResult(discipline, meetName, swimmer, time, type, id) {
  // Opdaterer objekt med opdateret filminformation
  const resultToUpdate = {
    discipline,
    meetName,
    swimmer,
    time,
    type,
  };
  const json = JSON.stringify(resultToUpdate);

  const response = await fetch(`${endpoint}/results/${id}.json`, {
    method: "PUT",
    body: json,
  });

  return response;
}

////---------- DELETE results ----------////

async function confirmDelete(dataObject) {
  deleteResultClicked(dataObject);
}

async function deleteResultClicked(resultObject) {
  console.log("Delete result " + resultObject.id);
  const response = await deleteResult(resultObject);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    //// Remove HTML from table and update shown results
    updateResultsPage();
  }
}

////---------- DELETE REST ----------////

async function deleteResult(resultObject) {
  const response = await fetch(`${endpoint}/results/${resultObject.id}.json`, {
    method: "DELETE",
  });

  return response;
}

export { updateResultsPage, createResultClicked };
