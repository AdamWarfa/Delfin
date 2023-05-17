"use strict";

    function Login(){
      const loginForm = document.getElementById("login-form");

      loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Forhindrer formular i at blive sendt

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Kald en funktion til at validere brugeroplysningerne
        if (validateLogin(username, password)) {
          // Redirect til den ønskede side efter succesfuld login
          window.location.href = "dashboard.html";
        } else {
          alert("Ugyldigt brugernavn eller adgangskode. Prøv igen.");
        }
      });
    

      function validateLogin(username, password) {
        // Implementer logikken til at validere brugeroplysningerne
        // F.eks. kan du sammenligne brugernavn og adgangskode med en database

        // Returner true, hvis login er gyldigt, ellers false
        return username === "admin" && password === "password";
      }
      
      
    }
    function signUpClicked(event) {
      event.preventDefault(); 
      console.log("Log ind knap blev trykket");
     
    }

    function signOutUser() {
    location.hash = "#home-section";
     document.querySelector("nav").classList.remove("hide");
    console.log("User signed out");
    }