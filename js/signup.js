import { endpoint } from "./rest-service.js";

async function signUpClicked(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="swimTypes"]:checked');

  const form = event.target;
  const firstName = form.firstname.value;
  const lastName = form.lastname.value;
  const birthday = form.birthday.value;
  const age = getAge(birthday);
  const street = form.street.value;
  const houseNumber = form.houseNumber.value;
  const postCode = form.postCode.value;
  const city = form.city.value;
  const email = form.email.value;
  const phoneNumber = form.phoneNumber.value;
  const memberType = form.memberType.value;
  const ageGroup = form.ageGroup.value;
  const levelType = form.levelType.value;
  const restance = false;
  const swimTypes = [];

  checkboxes.forEach(checkbox => {
    swimTypes.push(checkbox.value);
  });

  const response = await createMember(firstName, lastName, birthday, age, street, houseNumber, postCode, city, email, phoneNumber, memberType, ageGroup, levelType, restance, swimTypes);
  if (response.ok) {
    console.log("New member succesfully added to Firebase 🔥");
    alert("New member successfully added to Firebase 🔥");
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

function getAge(birthday) {
  let birthDate = new Date(birthday);
  let age = new Date().getFullYear() - birthDate.getFullYear();
  let month = new Date().getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function contingency(members) {
  const membershipFees = {
    passiveFee: 500,
    youthFee: 1000,
    seniorFee: 1600,
    seniorDiscount: 1200,
  };

  let totalFee = 0;
  for (const member of members) {
    let fee;
    if (member.memberType === "passive") {
      fee = membershipFees.passiveFee;
    } else if (member.memberType === "active" && member.ageGroup === "senior") {
      fee = membershipFees.seniorFee;
      if (member.age >= 60) {
        fee = membershipFees.seniorDiscount;
      }
    } else if (member.memberType === "active" && member.ageGroup === "junior") {
      fee = membershipFees.youthFee;
    }
    totalFee += fee;
    console.log(fee);
  }
  return totalFee;
}

export { signUpClicked, createMember, contingency };
