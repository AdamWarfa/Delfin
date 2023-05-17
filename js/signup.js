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

function getAge(birthday) {
  let birthDate = new Date(birthday);
  let age = new Date().getFullYear() - birthDate.getFullYear();
  let month = new Date().getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
console.log(getAge("1995/11/07"));

function contingency(members) {
  const passiveFee = 500;
  const youthFee = 1000;
  const seniorFee = 1600;
  const seniorDiscount = 1200;

  let fee;
  for (const member of members) {
    if (member.memberType === "passive") {
      fee = passiveFee;
    } else if (member.memberType === "active" && member.ageGroup === "senior") {
      fee = seniorFee;
      if (member.age >= 60) {
        fee = seniorDiscount;
      }
    } else if (member.memberType === "active" && member.ageGroup === "junior") {
      fee = youthFee;
    }
    console.log(fee);
  }

  return fee;
}

export { signUpClicked, createMember, contingency };
