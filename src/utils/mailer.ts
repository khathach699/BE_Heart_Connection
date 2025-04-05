import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 465,
  secure: false,
  auth: {
    user: "e2663260cd36ad",
    pass: "69f60b1862defd",
  },
});

export const sendMailForgotPassword = async function (to: any, resetURL: any) {
  return await transporter.sendMail({
    to: to,
    subject: "Reset Your Password",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Please click the link below to proceed:</p>
          <p>
            <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not request a password reset, please ignore this email or contact support.</p>
          <p>Thank you,<br>Your App Team</p>
        </div>
      `,
  });
};
