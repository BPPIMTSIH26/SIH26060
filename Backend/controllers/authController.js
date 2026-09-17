// controllers/authController.js
const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtpEmail = require('../utils/sendOtpEmail');

// Helper to generate token and set cookie
const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('polar_jwt', token, {
        httpOnly: true,
        secure: isProduction, // Requires HTTPS in production
        sameSite: isProduction ? 'none' : 'strict', // Allows cross-site cookie sharing from Vercel to Render
        maxAge: 24 * 60 * 60 * 1000
    });
};

// 1. DISPATCH SIGNUP OTP
exports.sendRegistrationOtp = async (req, res) => {
    try {
        const { email, username } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ status: "error", message: "Email or Username already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.deleteMany({ email });
        await Otp.create({ email, otp });

        const sent = await sendOtpEmail(email, otp, 'signup');
        if (!sent) {
            console.log(`[Dev Fallback OTP for Signup]: ${otp}`);
        }

        res.json({ status: "success", message: 'Clearance code dispatched.' });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 2. REGISTER USER (VERIFIES OTP)
exports.register = async (req, res) => {
    try {
        const { fullName, username, email, password, role, station, otp } = req.body;

        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ status: "error", message: 'Invalid or expired clearance code' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ status: "error", message: "Email or Username already exists" });
        }

        const avatarPath = req.file ? req.file.path : "";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role,
            station: station || null,
            avatar: avatarPath
        });

        await Otp.deleteMany({ email });
        generateTokenAndSetCookie(res, user);

        res.status(201).json({ 
            status: "success", 
            message: "User registered successfully",
            data: { 
                user: { 
                    fullName: user.fullName, 
                    username: user.username,
                    email: user.email, 
                    role: user.role, 
                    station: user.station,
                    avatar: user.avatar,
                    createdAt: user.createdAt
                } 
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 3. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = await User.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user);

        res.json({
            status: "success",
            data: {
                user: {
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    station: user.station,
                    avatar: user.avatar,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 4. LOGOUT
exports.logout = (req, res) => {
    res.cookie('polar_jwt', '', { httpOnly: true, expires: new Date(0) });
    res.json({ status: "success", message: "Logged out successfully" });
};

// 5. UPDATE PASSWORD (AUTHENTICATED)
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ status: "error", message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ status: "success", message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 6. FORGOT PASSWORD (DISPATCH OTP)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "error", message: 'User not found in system' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.deleteMany({ email });
        await Otp.create({ email, otp });

        const sent = await sendOtpEmail(email, otp, 'reset');
        if (!sent) {
            console.log(`[Dev Fallback OTP for Reset]: ${otp}`);
        }

        res.json({ status: "success", message: 'Recovery code dispatched.' });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 7. VERIFY OTP & RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ status: "error", message: 'Invalid or expired override code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        await Otp.deleteMany({ email });

        res.json({ status: "success", message: 'Access codes updated successfully' });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};