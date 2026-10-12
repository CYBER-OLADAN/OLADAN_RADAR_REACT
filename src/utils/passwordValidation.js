export function validatePassword(password) {
  const errors = [];
  if (typeof password !== "string" || password.length < 8) {
    errors.push("At least 8 characters");
  }
  if (!/[A-Z]/.test(password || "")) {
    errors.push("At least 1 uppercase letter");
  }
  if (!/[a-z]/.test(password || "")) {
    errors.push("At least 1 lowercase letter");
  }
  if (!/[0-9]/.test(password || "")) {
    errors.push("At least 1 number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password || "")) {
    errors.push("At least 1 special character");
  }
  return errors;
}

export function isPasswordValid(password) {
  return validatePassword(password).length === 0;
}