// validationMessages.ts

export const VALIDATOR_ERRORS = {
  PASSWORD:
    "Password must be at least %d characters long, contain at least %d lowercase letter, %d uppercase letter, %d number, and %d special character",
  EMAIL: "Invalid email format",
  FULLNAME: "Full name must be at least %d characters long",
};

export const AUTH_ERRORS = {
  EMAIL_EXIST: "Email already exists",
  EMAIL_NOT_FOUND: "Email not found",
  WRONG_PASSWORD: "Wrong password",
  EMAIL_AND_PASSWORD_WRONG: "Email or password is wrong",
  OLD_PASSWORD_WRONG: "Old password is wrong",
  UNAUTHORIZED: "You are not authorized to access this resource",
  INVALID_TOKEN: "Invalid token",
  AUTHENTICATION_REQUIRED: "Authentication required",
  ROLE_NOT_FOUND: "Role not found",
  JWT_NOT_DEFINED: "JWT secret is not defined",
};

export const PERMISSIONS = {
  USER: ["user", "mod", "admin"],
  MOD: ["mod", "admin"],
  ADMIN: ["admin"],
};
