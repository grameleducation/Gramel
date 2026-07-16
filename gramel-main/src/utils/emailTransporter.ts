import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import server_env from "./env.server";

// Create transporter once
const transporter: Transporter = nodemailer.createTransport({
  host: server_env.SMTP_HOST,
  port: server_env.SMTP_PORT,
  secure: true,
  auth: {
    user: server_env.SMTP_USER,
    pass: server_env.SMTP_PASSWORD,
  },
});

// Verify transporter connection
transporter
  .verify()
  // .then(() => {
  //   console.log("Email transporter is ready");
  // })
  .catch((error) => {
    console.error("Error with email transporter:", error);
  });

export default transporter;
