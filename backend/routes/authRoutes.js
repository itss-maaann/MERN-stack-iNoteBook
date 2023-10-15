const express = require('express');
const { body } = require('express-validator');
const { createUser, loginUser, getUserDetails } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');

const router = express.Router();

const createUserValidationRules = [
  body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
];

const loginUserValidationRules = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').exists().withMessage('Password cannot be blank'),
];

const asyncHandler = require('../common/asyncHandler');

//Route 1: Create a user (No login required) Using POST: api/v1/auth/create-user
router.post('/create-user', createUserValidationRules, asyncHandler(createUser));

//Route 2: User login (No login required) Using POST: api/v1/auth/login
router.post('/login', loginUserValidationRules, asyncHandler(loginUser));

//Route 3: Fetch User Details (login required) Using GET: api/v1/auth/user-details
router.get('/user-details', authenticateUser, asyncHandler(getUserDetails));

module.exports = router;
