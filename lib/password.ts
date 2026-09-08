export const PASSWORD_MIN_LENGTH = 8;

export function getPasswordErrors(password: string) {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(
      "La contraseña debe incluir una letra mayúscula."
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push(
      "La contraseña debe incluir una letra minúscula."
    );
  }

  if (!/\d/.test(password)) {
    errors.push("La contraseña debe incluir un número.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(
      "La contraseña debe incluir un carácter especial, por ejemplo: _, !, @ o #."
    );
  }

  return errors;
}

export function isPasswordValid(password: string) {
  return getPasswordErrors(password).length === 0;
}