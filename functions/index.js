const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password", // Use an app password instead of your actual Gmail password
  },
});

exports.sendWelcomeEmail = functions.https.onRequest(async (req, res) => {
  const { email, username } = req.body;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Welcome to StreetSafe!",
    text: `Hello ${username},\n\nYour account has been created successfully!\n\nBest regards,\nStreetSafe Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    res.status(500).send("Error sending email: " + error.message);
  }
});
