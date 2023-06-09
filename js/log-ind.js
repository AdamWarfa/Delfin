function loginPage() {
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
  document.querySelector("#treasurer-link").classList.remove("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.remove("log-in-hidden");
  document.querySelector("#login-link").classList.add("log-in-hidden");
  moveDropdownsTreasurer();
}

function treasurerIsSignedOut() {
  location.hash = "#home-section";
  document.querySelector("#treasurer-link").classList.add("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.add("log-in-hidden");
  document.querySelector("#login-link").classList.remove("log-in-hidden");
  moveDropdownsUser();
}

function runApp() {
  document.querySelector("#login-form").addEventListener("submit", treasurerLogin);
  document.querySelector("#login-form").addEventListener("submit", coachLogin);
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
  document.querySelector("#trainer-link").classList.remove("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.remove("log-in-hidden");
  document.querySelector("#login-link").classList.add("log-in-hidden");
  moveDropdownsCoach();
}

function coachIsSignedOut() {
  location.hash = "#home-section";
  document.querySelector("#trainer-link").classList.add("log-in-hidden");
  document.querySelector("#btn-sign-out").classList.add("log-in-hidden");
  document.querySelector("#login-link").classList.remove("log-in-hidden");
  moveDropdownsUser();
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
}

function moveDropdownsTreasurer() {
  const menuMembership = document.querySelector("#menu-membership");
  menuMembership.style.right = "590px";
}

function moveDropdownsCoach() {
  const menuMembership = document.querySelector("#menu-membership");
  menuMembership.style.right = "595px";
}

function moveDropdownsUser() {
  const menuMembership = document.querySelector("#menu-membership");
  menuMembership.style.right = "439px";
}

/* =============== EXPORT =============== */

export { loginPage };
