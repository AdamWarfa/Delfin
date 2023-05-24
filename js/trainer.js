"use strict";

import { getUsers, getResults, deleteResult, createResult, updateResult } from "./rest-service.js";
import { getMember } from "./rest-service.js";

/* =============== SHOW/GET RESULTS =============== */

let results;
let sortedResults;
let sortValue;

async function updateTrainerPage() {
  console.log("Testing: Updating trainer page");
  document.querySelector("#resultsTableBody").innerHTML = "";
  document.querySelector("#resultUsersCreate").innerHTML = "";
  document.querySelector("#resultUsersEdit").innerHTML = "";

  results = await getResults();
  const users = await getUsers();
  showResults(results);
  insertSwimmersDropdown(users);
  closeDialog();
}

function sortBy(type) {
  let sortPath = "#sortBy" + type;
  sortValue = type.toLowerCase();
  console.log(sortValue);

  document.querySelector("#sortByTime").classList.remove("sortActive");
  document.querySelector("#sortByMeetName").classList.remove("sortActive");
  document.querySelector("#sortByType").classList.remove("sortActive");
  document.querySelector("#sortByDiscipline").classList.remove("sortActive");
  document.querySelector("#sortBySwimmer").classList.remove("sortActive");
  document.querySelector(sortPath).classList.add("sortActive");

  if (sortValue === "meetname") {
    sortValue = "meetName";
  }

  sortedResults = results.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
  console.log(sortedResults);
  showResults(sortedResults);
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
    document.querySelector("#resultUsersEdit").insertAdjacentHTML("beforeend", /* HTML */ ` <option value="${resultObject.id}">${resultObject.firstName} ${resultObject.lastName}</option> `);
    document.querySelector("#resultUsersCreate").insertAdjacentHTML("beforeend", /* HTML */ ` <option value="${resultObject.id}">${resultObject.firstName} ${resultObject.lastName}</option> `);
  }
}
async function showResults(listOfResults) {
  document.querySelector("#resultsTableBody").innerHTML = "";

  for (const result of listOfResults) {
    try {
      await showResult(result);
    } catch (error) {
      console.log(error);
    }
  }
}

async function showResult(resultObject) {
  const user = await getMember(resultObject.swimmer);
  console.log(resultObject);
  console.log(user);
  document.querySelector("#resultsTableBody").insertAdjacentHTML(
    "beforeend",
    /* HTML */ `
      <tr>
        <td>${user.firstName} ${user.lastName}</td>
        <td>${resultObject.discipline}</td>
        <td>${resultObject.time}</td>
        <td>${resultObject.type}</td>
        <td>${resultObject.meetName}</td>
        <td>${user.ageGroup}</td>

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

async function inputResultSearchChanged(event) {
  showResults(await searchResults(event.target.value));
}

async function searchResults(searchValue) {
  let results = await getResults();
  return (results = results.filter((result) => result.swimmer.toLowerCase().includes(searchValue.toLowerCase())));
}

/* =============== CREATE RESULTS =============== */

async function createResultClicked(event) {
  const form = event.target;
  const discipline = form.discipline.value;
  const meetName = form.meetName.value;
  const swimmer = form.swimmer.value;
  const time = form.time.value;
  const type = form.type.value;
  const id = form.getAttribute("data-id");

  const response = await createResult(discipline, meetName, swimmer, time, type, id);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    updateTrainerPage();
    alert("INGEN FEJL");
    form.reset();
    closeDialog();
  } else {
    alert("MANGE FEJL");
  }
}

/* =============== EDIT RESULT =============== */

async function openEditDialog(resultObject) {
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
  const uid = form.swimmer.value;
  const time = form.time.value;
  const type = form.type.value;
  const id = form.getAttribute("data-id");

  const response = await updateResult(discipline, meetName, uid, time, type, id);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    // Opdater MoviesGrid til at displaye all film og den nye film
    updateTrainerPage();
    form.reset();
    closeDialog();
  }
}

/* =============== DELETE RESULTS =============== */

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

export { updateTrainerPage, createResultClicked, deleteResultClicked, inputResultSearchChanged, sortBy };
