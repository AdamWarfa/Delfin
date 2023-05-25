import { endpoint } from "./rest-service.js";

async function signUpClicked(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="swimTypes"]:checked');

  const form = event.target;
  const firstName = form.firstName.value;
  const lastName = form.lastName.value;
  const birthday = form.birthday.value;
  const age = getAge(birthday);
  const street = form.street.value;
  const houseNumber = form.houseNumber.value;
  const postCode = form.postCode.value;
  const city = form.city.value;
  const email = form.email.value;
  const phoneNumber = form.phoneNumber.value;
  const memberType = form.memberType.value;
  const ageGroup = checkAgeGroup(age);
  const levelType = form.levelType.value;
  const restance = false;
  const swimTypes = [];

  checkboxes.forEach((checkbox) => {
    swimTypes.push(checkbox.value);
  });

  const response = await createMember(firstName, lastName, birthday, age, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, restance, swimTypes);

  if (response.ok) {
    console.log("New member succesfully added to Firebase 🔥");
  }
}

async function createMember(firstName, lastName, birthday, age, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, restance, swimTypes) {
  const newMember = {
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    age: age,
    street: street,
    houseNumber: houseNumber,
    postCode: postCode,
    city: city,
    email: email,
    phoneNumber: phoneNumber,
    memberType: memberType,
    ageGroup: ageGroup,
    levelType: levelType,
    restance: restance,
    swimTypes: swimTypes,
  };

  const json = JSON.stringify(newMember);

  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: json,
  });

  return response;
}

function checkAgeGroup(age) {
  const senior = "senior";
  const junior = "junior";

  if (age >= 18) {
    return senior;
  } else if (age <= 17) {
    return junior;
  } else {
    console.log("aldersfejl");
  }
}

function getAge(birthday) {
  let birthDate = new Date(birthday);
  let age = new Date().getFullYear() - birthDate.getFullYear();
  let month = new Date().getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

let motionistRadioButton = document.querySelector("#motionist-member-type");
let konkurrencesvømmerRadioButton = document.querySelector("#konkurrencesvømmer-member-type-update");
let svømmedisciplinCheckboxes = document.getElementsByClassName("check-create");

motionistRadioButton.addEventListener("change", function () {
  let disabled = motionistRadioButton.checked; // Hvis motionist-radioknappen er markeret, skal boksene deaktiveres
  for (let i = 0; i < svømmedisciplinCheckboxes.length; i++) {
    svømmedisciplinCheckboxes[i].checked = false;
    svømmedisciplinCheckboxes[i].disabled = disabled;
  }
});

konkurrencesvømmerRadioButton.addEventListener("change", function () {
  // Hvis konkurrencesvømmer-radioknappen er markeret, skal svømmedisciplin-checkboxene aktiveres
  if (konkurrencesvømmerRadioButton.checked) {
    for (let i = 0; i < svømmedisciplinCheckboxes.length; i++) {
      svømmedisciplinCheckboxes[i].disabled = false;
    }
  }
});

/* =============== EXPORT =============== */

export { signUpClicked, createMember, getAge };
