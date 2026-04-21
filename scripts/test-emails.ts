import 'dotenv/config';
import {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendPaymentUploadReceivedEmail,
  sendPaymentVerifiedEmail,
  sendPaymentRejectedEmail
} from '../lib/email';
import nodemailer from "nodemailer";

async function run() {
  const emailToUse = "noreply@gatinteract.com";
  console.log(`Starting to test all email templates. Destination 'to' is ${emailToUse}`);
  console.log(`Note: These are also set up to CC 'noreply@gatinteract.com' and 'interact2k26@gmail.com'`);

  // 1. Test lib/email.ts functions
  console.log("1. Sending OTP Email (lib/email.ts)...");
  await sendOtpEmail(emailToUse, "123456");

  console.log("2. Sending Password Reset Email (lib/email.ts)...");
  await sendPasswordResetEmail(emailToUse, "https://gatinteract.com/reset");

  console.log("3. Sending Payment Upload Received Email (lib/email.ts)...");
  await sendPaymentUploadReceivedEmail(emailToUse);

  console.log("4. Sending Payment Verified Email (lib/email.ts)...");
  await sendPaymentVerifiedEmail(emailToUse);

  console.log("5. Sending Payment Rejected Email (lib/email.ts)...");
  await sendPaymentRejectedEmail(emailToUse, "Invalid payment proof provided.");

  // Test API route templates manually with full HTML
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  console.log("6. Sending Signup API Email...");
  const mailOptionsSignup = {
    from: process.env.SMTP_EMAIL,
    to: emailToUse,
    cc: ["interact2k26@gmail.com"],
    subject: "Login Credentials for Interact-2025 Registration Portal",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Registration Successful</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .container {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #262626;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #CFA000;
      border-radius: 8px;
      background-color: #FFF9DB;
    }
  </style>
</head>
<body>
  <div class="container">
    <p style="margin-bottom: 16px;">Respect Principal,</p>
    <p style="margin-bottom: 16px;"><strong>TEST COLLEGE NAME</strong></p>
    <p style="margin-bottom: 16px;">Greetings from Global Academy of Technology.</p>
    <p style="margin-bottom: 16px;">
      We are pleased to inform you that your institution’s registration on the official website for Interact-2025 – The 24th VTU Youth Fest has been successfully created.
      Below are your login credentials to access the portal:
    </p>
    <ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong>Username:</strong> test@college.edu</li>
      <li><strong>Password:</strong> TEST_PASSWORD</li>
    </ul>
    <p style="margin-bottom: 16px;">Please use these credentials to log in and complete the participant registration process for the fest.</p>
    <p style="margin-bottom: 16px;">
      <strong>Website Link:</strong>
      <a href="https://gatinteract.com" target="_blank" style="color: #2563eb; text-decoration: none;">
        gatinteract.com
      </a>
    </p>
    <p style="margin-bottom: 16px;">
      We look forward to your institution’s active participation in this grand cultural event.
      Should you require any assistance, feel free to reach out to us.
    </p>
    <p style="margin-bottom: 16px;">
      For any queries, contact:<br/>
      • Mr. Abhishek, Junior Cultural Coordinator – 📞 <a href="tel:8660041943">8660041943</a><br/>
      • Akshith M, Student Convener – 📞 <a href="tel:9945864767">9945864767</a>
    </p>
    <p style="margin-bottom: 16px;">Thank you for your support and cooperation.</p>
    <p style="margin-bottom: 0;">Warm regards,<br/>Team Interact<br/>Global Academy of Technology</p>
  </div>
</body>
</html>
    `,
  };
  await transporter.sendMail(mailOptionsSignup);

  console.log("7. Sending Send Password API Email...");
  const mailOptionsPassword = {
    from: process.env.SMTP_EMAIL,
    to: emailToUse,
    cc: ["interact2k26@gmail.com"],
    subject: "Your Account Password",
    text: `Your account has been created successfully. Your password is: TEST_PASSWORD. Please change it after logging in.`,
  };
  await transporter.sendMail(mailOptionsPassword);

  console.log("8. Sending Contact Us Email...");
  const mailOptionsContact = {
    from: process.env.SMTP_EMAIL,
    to: emailToUse,
    cc: ["interact2k26@gmail.com"],
    subject: "New Contact Form Submission",
    text: `
      Name: Test Sender
      Email: test@sender.com
      Phone: 1234567890
      College: Global Academy of Technology
      Message: This is a test contact submission.
    `,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> Test Sender</p>
      <p><strong>Email:</strong> test@sender.com</p>
      <p><strong>Phone:</strong> 1234567890</p>
      <p><strong>College:</strong> Global Academy of Technology</p>
      <p><strong>Message:</strong> This is a test contact submission.</p>
    `,
  };
  await transporter.sendMail(mailOptionsContact);

  console.log("9. Sending General OTP Email...");
  const mailOptionsOTP = {
    from: process.env.SMTP_EMAIL,
    to: emailToUse,
    cc: ["interact2k26@gmail.com"],
    subject: "Your OTP for Verification",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your OTP for Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .container {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #262626;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #CFA000;
      border-radius: 8px;
      background-color: #FFF9DB;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      background-color: #FFC107;
      padding: 10px 20px;
      border-radius: 8px;
      display: inline-block;
      letter-spacing: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 style="margin-bottom:16px;">Your OTP for Verification</h2>
    <p style="margin-bottom:16px;">Use the following One-Time Password (OTP) to complete your verification process:</p>
    <div style="margin-bottom:16px; text-align: center;">
      <span class="otp">890123</span>
    </div>
    <p style="margin-bottom:16px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
    <p style="margin-top:20px; font-size:14px; color:#6c757d;">If you did not request this, please ignore this email.</p>
  </div>
</body>
</html>`,
  };
  await transporter.sendMail(mailOptionsOTP);

  console.log("Successfully fired all 9 test emails.");
}

run().catch((error) => {
  console.error("Error occurred while sending test emails:", error);
});
