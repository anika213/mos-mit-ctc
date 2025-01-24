const { body } = require('express-validator');

const userValidationSchema = [
    body('username')
        .isString().withMessage("Username must be a String.")
        .notEmpty().withMessage("Username cannot be empty.")
        .isLength({ min: 5, max: 32 }).withMessage("Username must be between 5 and 32 characters."),

    body('password')
        .isString().withMessage("Password must be a String.")
        .isLength({ min: 8, max: 32 }).withMessage("Password must be between 8 and 32 characters.")
        .matches(/[A-Z]/).withMessage("Password must include an uppercase letter.")
        .matches(/[a-z]/).withMessage("Password must include a lowercase letter.")
        .matches(/[0-9]/).withMessage("Password must include a number.")
        .matches(/[^A-Za-z0-9]/).withMessage("Password must include a special character."), // NOT A-Z, a-z, 0-9.

    body('score')
        .optional()
        .isInt().withMessage("Score must be an integer."),
];

module.exports = userValidationSchema;