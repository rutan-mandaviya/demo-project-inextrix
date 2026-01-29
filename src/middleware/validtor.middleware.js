import  { body, validationResult } from "express-validator";

const responseError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


export const registerAgentValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("firstName")
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),

  body("lastName")
    .notEmpty().withMessage("Last name is required"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),

  responseError
];


export const loginAgentValidator = [
  body("email")
    .optional()
    .isEmail().withMessage("Invalid email format"),
  (req, res, next) => {
    if (!req.body.email && !req.body.username) {
      return res.status(400).json({
        errors: [{ message: "Either email or username is required" }]
      });
    }
    next();
  },

  responseError
];



