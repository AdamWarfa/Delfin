"use strict";

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
  document.querySelector("main").classList.add("dim");
  document.querySelector("header").classList.add("dim");
}

function closeDialog() {
  // Lukker dialog, fjerner formørkelse
  document.querySelector("#dialog-edit-movie").close();
  document.querySelector("#results-section").classList.remove("dim");
  document.querySelector("header").classList.remove("dim");
}

////---------- Update and show results ----------////

async function updateShownResults() {
  console.log("Updating results");
  document.querySelector("#resultsTableBody").innerHTML = "";
  document.querySelector("#resultsTableHeader").innerHTML = "";
  const results = await getResults();
  showResults(results);
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
        <td><button id="editResult-btn">Edit</button></td>
        <td><button id="deleteResult-btn">Delete</button></td>
      </tr>
    `
  );

  document.querySelector("#resultsTableBody tr:last-child #deleteResult-btn").addEventListener("click", event => {
    event.preventDefault();
    deleteResultClicked(resultObject);
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

////---------- GET results ----------////

async function getResults() {
  const response = await fetch(`${endpoint}/results.json`); // fetch request, (GET)    method: "GET",
  const data = await response.json(); // parse JSON to JavaScript
  const results = prepareData(data); // convert object of object to array of objects
  return results; // return results
}

function prepareData(dataObject) {
  const resultsArray = [];

  // for in som pusher fetchede JSON data ind i vores array
  for (const key in dataObject) {
    try {
      const result = dataObject[key];
      result.id = key;
      resultsArray.push(result);
    } catch (error) {
      console.log(`Nogen har ødelagt vores result så de giver ${dataObject[key]}`);
    }
  }
  // console.log(movieArray);
  return resultsArray;
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
    updateShownResults();
    form.reset();
    alert("Result added");
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
  const discipline = form.discipline - update.value;
  const meetName = form.meetName - update.value;
  const swimmer = form.swimmer - update.value;
  const time = form.time - update.value;
  const type = form.type - update.value;
  const id = form.getAttribute("data-id");

  const response = await updateResult(discipline, meetName, swimmer, time, type, id);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    console.log("Update  clicked!", id);
    // Opdater MoviesGrid til at displaye all film og den nye film
    updateShownResults();
    closeDialog();
    alert("Result updated!");
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
  const json = JSON.stringify(movieToUpdate);

  const response = await fetch(`${endpoint}/results/${id}.json`, {
    method: "PUT",
    body: json,
  });

  return response;
}

////---------- DELETE results ----------////

async function deleteResultClicked(resultObject) {
  console.log("Delete result " + resultObject.id);
  const response = await deleteResult(resultObject);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    //// Remove HTML from table and update shown results
    updateShownResults();
  }
}

////---------- DELETE REST ----------////

async function deleteResult(resultObject) {
  const response = await fetch(`${endpoint}/results/${resultObject.id}.json`, {
    method: "DELETE",
  });

  return response;
}

export { updateShownResults, createResultClicked };
