const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationURL = `${process.env.BASE_URL}/api/auth/verify/${token}`;

  console.log("📧 Verification URL:", verificationURL);

  await transporter.sendMail({
    from: `"ReconX Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your ReconX Account",
    html: `
      <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#0f172a,#0ea5e9);padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;">ReconX Security</h1>
            <p style="margin:8px 0 0;color:#cbd5e1;font-size:14px;">
              Secure Cyber Operations Platform
            </p>
          </div>

          <div style="padding:32px;text-align:left;">
            <h2 style="margin-top:0;color:#111827;">Verify Your Email</h2>
            <p style="color:#374151;font-size:15px;line-height:1.6;">
              Welcome to ReconX. Please verify your email address to activate your account.
            </p>

            <div style="margin:28px 0;text-align:center;">
              <a href="${verificationURL}"
                 style="display:inline-block;padding:14px 28px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;">
                Verify Email
              </a>
            </div>

            <p style="margin-top:20px;color:#6b7280;font-size:13px;line-height:1.6;">
              If you did not create this account, you can safely ignore this email.
            </p>
          </div>
        </div>
      </div>
    `,
  });
};

module.exports = sendVerificationEmail;