require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");


const app = express();

app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-sms", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await client.messages.create({
      body: `New Portfolio Message
Name: ${name}
Email: ${email}
Message: ${message}`,
      from: process.env.TWILIO_PHONE,
      to: process.env.YOUR_PHONE
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting me",
      text: `Hi ${name},

Thank you for reaching out through my portfolio.

I have received your message and will get back to you shortly.

Best regards,
Rajesh`
    });

    res.json({
      success: true,
      message: "SMS and email sent successfully"
    });
  } catch (error) {
    console.error("Send error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/download-resume", (req, res) => {
  const path = require("path");
  const filePath = path.join(__dirname, "resume.pdf");

  res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
  res.setHeader("Content-Type", "application/octet-stream");

  res.download(filePath);
});
const path = require("path");

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});