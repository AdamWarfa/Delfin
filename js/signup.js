"use strict";

export { signUpClicked, createMember };

const endpoint = "https://delfinen-d6932-default-rtdb.europe-west1.firebasedatabase.app/";

async function signUpClicked(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="swimTypes"]:checked');

  const form = event.target;
  const firstName = form.firstname.value;
  const lastName = form.lastname.value;
  const birthday = form.birthday.value;
  const street = form.street.value;
  const houseNumber = form.houseNumber.value;
  const postCode = form.postCode.value;
  const city = form.city.value;
  const email = form.email.value;
  const phoneNumber = form.phoneNumber.value;
  const memberType = form.memberType.value;
  const ageGroup = form.ageGroup.value;
  const levelType = form.levelType.value;
  const swimTypes = [];
  checkboxes.forEach((checkbox) => {
    swimTypes.push(checkbox.value);
  });

  const response = await createMember(firstName, lastName, birthday, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, swimTypes);
  if (response.ok) {
    console.log("New movie succesfully added to Firebase 🔥");
  }
}

async function createMember(firstName, lastName, birthday, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, swimTypes) {
  const newMember = {
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    street: street,
    houseNumber: houseNumber,
    postCode: postCode,
    city: city,
    email: email,
    phoneNumber: phoneNumber,
    memberType: memberType,
    ageGroup: ageGroup,
    levelType: levelType,
    swimTypes: swimTypes,
  };
  const json = JSON.stringify(newMember);

  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: json,
  });

  return response;
}
