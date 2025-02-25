const { body } = require('express-validator');
const User = require('../models/user');

const reportValidationSchema = [
    body('reportee')
        .isMongoId().withMessage('Invalid reportee ID.')
        .bail()
        .custom(async (id) => {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('Reportee ID does not exist.');
            }
        }),
    body('reason')
        .isString().withMessage('Reason must be a string.')
        .notEmpty().withMessage('Reason is required.')
        .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters.') 
];

module.exports = reportValidationSchema;