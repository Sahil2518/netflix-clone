const userService = require('../services/userService');
const emailService = require('../services/emailService');

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Adding id and name as placeholder for MERGE logic
        const user = await userService.createUser({
            id: Date.now().toString(),
            email,
            password,
            name: email.split('@')[0]
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        if (user && user.password === password) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await userService.setOTP(email, otp);
        await emailService.sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email (check console)' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const success = await userService.resetPassword(email, otp, newPassword);
        if (success) {
            res.status(200).json({ message: 'Password reset successful' });
        } else {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    signin,
    getUserById,
    forgotPassword,
    resetPassword
};
