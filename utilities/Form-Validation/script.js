const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");
const successMsg = document.getElementById("successMsg");

// Regex
const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

function validateField(input, regex, errorElem, errorMsg) {
  const val = input.value.trim();
  if (val === "") {
    errorElem.textContent = "This field is required";
    errorElem.classList.add("invalid");
    errorElem.classList.remove("valid");
    return false;
  }
  if (!regex.test(val)) {
    errorElem.textContent = errorMsg;
    errorElem.classList.add("invalid");
    errorElem.classList.remove("valid");
    return false;
  }
  errorElem.textContent = "";
  errorElem.classList.add("valid");
  errorElem.classList.remove("invalid");
  return true;
}

function validateConfirm() {
  const val = confirmInput.value;
  if (val === "") {
    confirmError.textContent = "This field is required";
    confirmError.classList.add("invalid");
    confirmError.classList.remove("valid");
    return false;
  }

  if (val != passwordInput.value) {
    confirmError.textContent = "Password do not match";
    confirmError.classList.add("invalid");
    confirmError.classList.remove("valid");
    return false;
  }

  confirmError.textContent = "";
  confirmError.classList.add("valid");
  confirmError.classList.remove("invalid");
  return true;
}

//live validate

nameInput.addEventListener("input", () =>
  validateField(nameInput, nameRegex, nameError, "Only char and spaces")
);

emailInput.addEventListener("input", () =>
  validateField(emailInput, emailRegex, emailError, "Enter valid email")
);

passwordInput.addEventListener("input", () =>
  validateField(
    passwordInput,
    passwordRegex,
    passwordError,
    "Min 6 char, uppercase , lowercase, num, special char"
  )
);

confirmInput.addEventListener("input", validateConfirm);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMsg.textContent = "";

  const isNameValid = validateField(
    nameInput,
    nameRegex,
    nameError,
    "Only char and spaces"
  );

  const isEmailValid = validateField(
    emailInput,
    emailRegex,
    emailError,
    "Enter valid email"
  );

  const isPasswordValid = validateField(
    passwordInput,
    passwordRegex,
    passwordError,
    "Min 6 char, uppercase , lowercase, num, special char"
  );

  const isConfirmValid = validateConfirm();

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
    successMsg.innerHTML = `<p>Name: ${nameInput.value}</p><p>Email: ${emailInput.value}</p>`;

    form.reset();
    [nameInput, emailInput, passwordInput, confirmInput].forEach((input) =>
      input.classList.remove("valid")
    );
  }
});
