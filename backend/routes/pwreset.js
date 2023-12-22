const express = require('express');
const router = express.Router();

// controller functions
const {  forgotPassword, resetPassword } = require('../controllers/userControllers');

// forgot password route
router.put('/forgot-password', forgotPassword);

// reset password route
router.put('/reset-password/:resetToken', resetPassword);


module.exports = router;
