const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // free domain
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    console.log("✅ Email sent:", response);
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;