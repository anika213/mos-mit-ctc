const { body } = require('express-validator');

const userValidationSchema = [
    body('username')
        .isString().withMessage("Username must be a String.")
        .notEmpty().withMessage("Username cannot be empty.")
        .isLength({ min: 5, max: 32 }).withMessage("Username must be between 5 and 32 characters."),

    body('password')
        .isString().withMessage("Password must be a String.")
        .notEmpty().withMessage("Password cannot be empty.")
        .isLength({ min: 8, max: 32 }).withMessage("Password must be between 8 and 32 characters."),
    body('score')
        .optional()
        .isInt().withMessage("Score must be an integer."),
];

module.exports = userValidationSchema;