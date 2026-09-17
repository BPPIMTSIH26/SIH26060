// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

const { 
    sendRegistrationOtp,
    register, 
    login, 
    logout, 
    updatePassword, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');

const upload = multer({ dest: 'uploads/' });

// Registration Flow
router.post('/send-registration-otp', sendRegistrationOtp);
router.post('/register', upload.single('avatar'), register);

// Login & Session
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-password', protect, updatePassword);

// Password Recovery Flow
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;