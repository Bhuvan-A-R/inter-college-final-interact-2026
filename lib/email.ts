import nodemailer from "nodemailer";

function getCommonEmailTemplate(content: string, title: string = "Hello Participants!") {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.gatinteract.com';
  const logoUrl = `${baseUrl}/gat-logos/Logo%20Lock-Up.png`;
  const interactLogoUrl = "https://www.gatinteract.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FINTERACT2K26.b18fba55.png&w=384&q=75";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6fb;">
<div style="font-family: 'Segoe UI', sans-serif; padding: 30px 15px;">
    <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.08);">
        <!-- HEADER WITH LOGO -->
        <div style="background-color: #0e2045; text-align: center; padding: 25px;">
           <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="right" style="padding-right: 15px; vertical-align: middle;">
        <div style="background-color: #ffffff; padding: 10px 15px; border-radius: 10px; display: inline-block;">
          <img src="${logoUrl}" alt="GAT Logo" width="130" style="display: block;">
        </div>
      </td>
      <td align="left" style="padding-left: 15px; vertical-align: middle;">
        <img src="${interactLogoUrl}" alt="Interact Logo" width="120" style="display: block;">
      </td>
    </tr>
  </table>
        </div>

        <!-- CONTENT -->
        <div style="padding: 40px 30px; color:#333; line-height:1.6;">
            <h2 style="color:#0e2045; margin-top:0;">${title}</h2>
            <div style="font-size:15px; color: #444;">
                ${content}
            </div>
            <!-- CTA BUTTON -->
            <div style="text-align:center; margin-top: 40px;">
                <a href="${baseUrl}/events"
                   style="background:#2362ec; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block; font-size: 16px;">
                    Explore Events
                </a>
            </div>
        </div>

        <!-- DETAILED FOOTER -->
        <div style="background:#0e2045; padding:40px 30px; color:#ffffff; border-top:1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="color: #ffffff;">
                <tr>
                    <td width="50%" style="padding-bottom: 30px; vertical-align: top; padding-right: 20px;">
                        <h3 style="color: #f3c317; font-size: 18px; margin: 0 0 15px 0;">GAT INTERACT</h3>
                        <p style="color: #8b97b6; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
                            Join Global Academy of Technology for INTERACT 2026 – a celebration of innovation, creativity, and technology. Where Code Meets Culture.
                        </p>
                        <div style="margin-bottom: 10px;">
                            <a href="https://www.instagram.com/interact2026/" style="display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #8b97b6; text-decoration: none; font-size: 12px;">@interact2026</a>
                        </div>
                        <div>
                            <a href="https://www.instagram.com/gatbengaluru/" style="display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #8b97b6; text-decoration: none; font-size: 12px;">@gatbengaluru</a>
                        </div>
                    </td>
                    <td width="50%" style="padding-bottom: 30px; vertical-align: top;">
                        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 15px 0;">Quick Links</h3>
                        <div style="font-size: 13px; line-height: 2;">
                            <a href="${baseUrl}" style="color: #8b97b6; text-decoration: none;">Home</a><br>
                            <a href="${baseUrl}/about/gat" style="color: #8b97b6; text-decoration: none;">About GAT</a><br>
                            <a href="${baseUrl}/about/fest" style="color: #8b97b6; text-decoration: none;">About FEST</a><br>
                            <a href="${baseUrl}/gallery" style="color: #8b97b6; text-decoration: none;">Gallery</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 20px;">
                        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0;">Website Issues</h3>
                        <p style="font-size: 13px; color: #f3c317; margin: 0;">Bhuvan A R</p>
                        <p style="font-size: 13px; color: #8b97b6; margin: 0 0 15px 0;">+91 83174 62097</p>

                        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0;">Event Issues</h3>
                        <p style="font-size: 12px; color: #f3c317; margin: 0;">Cultural Coordinator</p>
                        <p style="font-size: 12px; color: #8b97b6; margin: 0 0 10px 0;">Sohan Soorya K - +91 95380 06513</p>
                        <p style="font-size: 12px; color: #f3c317; margin: 0;">Technical Coordinator</p>
                        <p style="font-size: 12px; color: #8b97b6; margin: 0 0 10px 0;">Vignesh - +91 89511 85530</p>
                        <p style="font-size: 12px; color: #f3c317; margin: 0;">Sports Coordinator</p>
                            <p style="font-size: 12px; color: #8b97b6; margin: 0 0 10px 0;">Sharath - +91 97400 35208
                            </p>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0;">Registration & Payment</h3>
                        <p style="font-size: 12px; color: #f3c317; margin: 0;">Registration Coordinator</p>
                        <p style="font-size: 12px; color: #8b97b6; margin: 0 0 10px 0;">Siri P - +91 72593 43558</p>
                        <p style="font-size: 12px; color: #f3c317; margin: 0;">Payment Coordinator</p>
                        <p style="font-size: 12px; color: #8b97b6; margin: 0 0 20px 0;">Yashaswi P M - +91 93805 33506</p>
                        
                        <p style="font-size: 14px; color: #ffffff; margin: 0;">
                            Email Us: <a href="mailto:noreply@gatinteract.com" style="color: #8b97b6; text-decoration: none;">noreply@gatinteract.com</a>
                        </p>
                    </td>
                </tr>
            </table>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(139, 151, 182, 0.2); text-align: center;">
                <p style="color: #8b97b6; font-size: 11px; margin: 0;">
                    Copyright © 2026 Interact Global Academy of Technology · All Rights Reserved.
                </p>
                <p style="color: #8b97b6; font-size: 11px; margin: 5px 0 0;">
                    Developed with ♥ by the Interact 2026 Website Team
                </p>
            </div>
        </div>
    </div>
</div>
</body>
</html>
  `;
}

function createTransporter() {

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendOtpEmail(
  email: string,
  otp: string
): Promise<void> {
  const transporter = createTransporter();
  const content = `
    <p style="color:#6b7280;margin-bottom:24px;">Your one-time verification code is:</p>
    <div style="background:#f3f4f6;border-radius:10px;padding:20px 24px;text-align:center;margin-bottom:24px;border: 1px solid #e5e7eb;">
      <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#0e2045;display:block;">${otp}</span>
    </div>
    <p style="color:#6b7280;font-size:14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
  `;
  await transporter.sendMail({
    from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
    to: email,
    cc: ["interact2k26@gmail.com"],
    subject: "Your OTP for INTERACT 2K26 Registration",
    html: getCommonEmailTemplate(content, "Verification Code"),
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const transporter = createTransporter();
  const content = `
    <p style="color:#6b7280;margin-bottom:24px;">We received a request to reset your account password. Click the button below to proceed. This link expires in <strong>15 minutes</strong>.</p>
    <div style="text-align:center; margin-bottom:24px;">
      <a href="${resetUrl}" style="display:inline-block;background:#0e2045;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;">Reset Password</a>
    </div>
    <p style="color:#9ca3af;font-size:13px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
  `;
  await transporter.sendMail({
    from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
    to: email,
    cc: ["interact2k26@gmail.com"],
    subject: "Reset your INTERACT 2K26 password",
    html: getCommonEmailTemplate(content, "Reset Password"),
  });
}

export async function sendPaymentUploadReceivedEmail(
  email: string
): Promise<void> {
  const transporter = createTransporter();
  const content = `
    <p style="color:#6b7280;margin-bottom:18px;">
      Your payment proof has reached the admin board. Please wait 24 hours for verification of your payment and registration status.
    </p>
    <p style="color:#6b7280;font-size:14px;">
      You will receive another email once our team verifies your transaction.
    </p>
  `;
  await transporter.sendMail({
    from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
    to: email,
    cc: ["interact2k26@gmail.com"],
    subject: "Payment proof received",
    html: getCommonEmailTemplate(content, "Payment Received"),
  });
}

export async function sendPaymentVerifiedEmail(
  email: string
): Promise<void> {
  const transporter = createTransporter();
  const content = `
    <div style="background:#f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin-bottom: 20px;">
      <p style="color:#166534; font-weight: 600; margin: 0;">Payment verified successfully!</p>
    </div>
    <p style="color:#6b7280;margin-bottom:18px;">
      Congratulations! You are successfully registered for the event. You can now access your dashboard to view your team details and event schedule.
    </p>
  `;
  await transporter.sendMail({
    from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
    to: email,
    cc: ["interact2k26@gmail.com"],
    subject: "Payment verified",
    html: getCommonEmailTemplate(content, "Registration Confirmed"),
  });
}

export async function sendPaymentRejectedEmail(
  email: string,
  REJECTED_REASON: string
): Promise<void> {
  const transporter = createTransporter();
  const content = `
    <div style="background:#fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 20px;">
      <p style="color:#991b1b; font-weight: 600; margin: 0;">Registration Rejected</p>
    </div>
    <p style="color:#6b7280;margin-bottom:18px;">
      Your registration was rejected for the following reason:
    </p>
    <p style="color:#dc2626; font-weight: 700; background: #fef2f2; padding: 10px; border-radius: 6px;">
      ${REJECTED_REASON}
    </p>
    <p style="color:#6b7280; font-size: 14px; margin-top: 20px;">
      Please re-verify your details and upload a valid payment proof again through your dashboard.
    </p>
  `;
  await transporter.sendMail({
    from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
    to: email,
    cc: ["interact2k26@gmail.com"],
    subject: "Payment rejected",
    html: getCommonEmailTemplate(content, "Action Required"),
  });
}


export async function sendMaintenanceEndEmail(
  emails: string[]
): Promise<void> {
  if (emails.length === 0) return;

  const transporter = createTransporter();
  const content = `
    <p style="color:#6b7280;margin-bottom:18px;">
      The maintenance is complete and the INTERACT 2K26 website is now live! 
      You can now login, register for events, and continue your journey with us.
    </p>
    <div style="margin-top:24px; text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://interact2k26.com'}" 
         style="display:inline-block;background:#0e2045;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;">
        Go to Website
      </a>
    </div>
  `;
  await transporter.sendMail({
    from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
    bcc: emails,
    subject: "INTERACT 2K26 is Back Online!",
    html: getCommonEmailTemplate(content, "Maintenance Complete"),
  });
}
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendBulkEmail(
  emails: string[],
  subject: string,
  content: string
): Promise<void> {
  if (emails.length === 0) return;

  const transporter = createTransporter();

  // Aggressive chunking for strict providers like Hostinger
  // Using 30 recipients per batch with a 4-second delay to stay under hourly/per-minute limits
  const CHUNK_SIZE = 30; 
  console.log(`[Email] Starting bulk send to ${emails.length} recipients in chunks of ${CHUNK_SIZE}...`);
  
  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE);
    const batchNum = Math.floor(i / CHUNK_SIZE) + 1;
    const totalBatches = Math.ceil(emails.length / CHUNK_SIZE);
    
    console.log(`[Email] Sending batch ${batchNum}/${totalBatches} (${chunk.length} recipients)...`);
    
    await transporter.sendMail({
      from: `"INTERACT 2K26" <${process.env.SMTP_EMAIL}>`,
      bcc: chunk,
      cc: ["interact2k26@gmail.com"],
      subject: subject,
      html: getCommonEmailTemplate(`<div style="white-space: pre-wrap;">${content}</div>`),
    });

    // Add a significant delay between chunks to avoid rate limiting
    if (i + CHUNK_SIZE < emails.length) {
      console.log(`[Email] Waiting 4s before next batch...`);
      await delay(4000); 
    }
  }
  console.log(`[Email] Bulk send complete.`);
}
