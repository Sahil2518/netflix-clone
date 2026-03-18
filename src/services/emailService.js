const nodemailer = require('nodemailer');

// For development, we just log the OTP to the console.
// In production, you would use an actual SMTP transporter.
const sendOTP = async (email, otp) => {
    console.log(`[EMAIL SERVICE] Sending OTP ${otp} to ${email}`);
    // Simulate email delay
    return new Promise(resolve => setTimeout(resolve, 1000));
};

module.exports = {
    sendOTP
};
