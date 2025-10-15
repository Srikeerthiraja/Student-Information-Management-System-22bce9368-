const { body, validationResult } = require('express-validator');

const validateStudent = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('rollNum').isInt({ min: 1 }).withMessage('Valid roll number required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
    body('sclassName').notEmpty().withMessage('Class is required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateStudent };