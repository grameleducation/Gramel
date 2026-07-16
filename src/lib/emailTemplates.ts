import "server-only";

// Email templates

interface EmailTemplate<T> {
  subject: string;
  text: (params: T) => string;
  html: (params: T) => string;
}

// Common styling variables
const styles = {
  colors: {
    primary: "#09225a",
    text: "#1e1e1e",
    background: "#ffffff",
    border: "#8f8f923d",
  },
  fonts: {
    main: "Arial, sans-serif",
  },
};

// Signup verification email template
export const signupVerification: EmailTemplate<{ confirmLink: string }> = {
  subject: "Verify Your Account",
  text: ({ confirmLink }) => `
Welcome to Gramel!

Thank you for creating an account with us. To complete your registration, please verify your account by clicking the link below:
${confirmLink}

This link will expire in 15 minutes.

If you didn't create an account, you can safely ignore this email.

Best regards,
Gramel Education`,
  html: ({ confirmLink }) => `
    <div
      style="font-family: 'Arial, sans-serif'; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border: 1px solid #8f8f923d; border-radius: 5px;"
    >
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #09225a; margin: 0;">Welcome to Gramel!</h2>
      </div>
          
      <div style="color: #1e1e1e; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        <p>Thank you for creating an account with us. To complete your registration, please verify your account by clicking the button below:</p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${confirmLink}"
          style="display: inline-block; padding: 12px 24px; background-color: #09225a; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;"
        >
          Verify Email Address
        </a>
      </div>

      <div style="color: #1e1e1e; font-size: 14px; line-height: 20px;">
        <p>This will expire in <span style="font-weight: bold;">15 minutes</span>. If you didn't create an account, you can safely ignore this email.</p>
      </div>

      <div 
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #8f8f923d; color: #1e1e1e; font-size: 14px; text-align: center;">
        <p>Best regards,<br>Gramel Education</p>
      </div>
    </div>
  `,
};

export const forgotPassword: EmailTemplate<{ resetLink: string }> = {
  subject: "Reset Your Password",
  text: ({ resetLink }) => `
Reset Password

We received a request to reset the password for your <strong>Gramel Education</strong> account. Click the button below to set a new password:
${resetLink}

This link will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.

Best regards,
Gramel Education`,
  html: ({ resetLink }) => `
    <div
      style="font-family: 'Arial, sans-serif'; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border: 1px solid #8f8f923d; border-radius: 5px;"
    >
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #09225a; margin: 0;">Reset Password</h2>
      </div>

      <div style="color: #1e1e1e; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        <p>
          We received a request to reset the password for your <strong>Gramel Education</strong> account.  
          Click the button below to set a new password:
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a
          href="${resetLink}"
          style="display: inline-block; padding: 12px 24px; background-color: #09225a; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >Reset Password</a
        >
      </div>

      <div style="color: #1e1e1e; font-size: 14px; line-height: 20px;">
        <p>
          This link will expire in <span style="font-weight: bold;">15 minutes</span>.  
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #8f8f923d; color: #1e1e1e; font-size: 14px; text-align: center;"
      >
        <p>Best regards,<br />Gramel Education</p>
      </div>
    </div>`,
};

export const contactPageMessage: EmailTemplate<{
  name: string;
  email: string;
  message: string;
}> = {
  subject: "New Message from Gramel User",
  text: (data) => `New Message from Gramel User

Sent by: ${data.name}
Email: ${data.email}

Message:
${data.message}

--
Sent from Gramel Education website's Contact page`,

  html: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #EC1552; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0;">
        <div style="margin: 0; font-size: 20px; font-weight: bold;">New Message from Gramel User</div>
      </div>
      <div style="padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 0 0 8px 8px;">
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #666666;">Sent by:</div>
          <div>${data.name}</div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #666666;">Email:</div>
          <div>${data.email}</div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; color: #666666;">Message:</div>
          <div style="white-space: pre-wrap; background-color: #f9f9f9; border-radius: 4px; margin-top: 5px; padding: 10px;">${data.message}</div>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666;">
          Sent from Gramel Education website's Contact page
        </div>
      </div>
    </body>
    </html>`,
};

// Offline payment entry created for a student (admin notification)
export const offlinePaymentEntryCreated: EmailTemplate<{
  studentName: string;
  studentEmail: string;
  serviceName: string;
  amount: string;
  paidAt: string;
  actorName: string;
}> = {
  subject: "Offline Payment Recorded for Student",
  text: ({
    studentName,
    studentEmail,
    serviceName,
    amount,
    paidAt,
    actorName,
  }) => `
An offline payment has been recorded for a student on Gramel Education.

Student: ${studentName} (${studentEmail})
Service: ${serviceName}
Amount: ₦${amount}
Paid on: ${paidAt}

Recorded by: ${actorName}

You can log in to the admin dashboard to view more details.

Best regards,
Gramel Education
`,
  html: ({
    studentName,
    studentEmail,
    serviceName,
    amount,
    paidAt,
    actorName,
  }) => `
  <div
    style="font-family: ${styles.fonts.main}; max-width: 600px; margin: 0 auto; padding: 20px; background: ${styles.colors.background}; border: 1px solid ${styles.colors.border}; border-radius: 5px;"
  >
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: ${styles.colors.primary}; margin: 0;">
        Offline Payment Recorded for Student
      </h2>
    </div>

    <div style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      <p>An offline payment has been recorded for a student on <strong>Gramel Education</strong>.</p>
    </div>

    <div style="color: ${styles.colors.text}; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      <p><strong>Student:</strong> ${studentName} (${studentEmail})</p>
      <p><strong>Service:</strong> ${serviceName}</p>
      <p><strong>Amount:</strong> ₦${amount}</p>
      <p><strong>Paid on:</strong> ${paidAt}</p>
      <p><strong>Recorded by:</strong> ${actorName}</p>
    </div>

    <div style="color: ${styles.colors.text}; font-size: 14px; line-height: 1.6; margin-top: 20px;">
      <p>You can log in to the admin dashboard to review this payment and related details.</p>
    </div>

    <div 
      style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${styles.colors.border}; color: ${styles.colors.text}; font-size: 13px; text-align: center;"
    >
      <p>Best regards,<br>Gramel Education</p>
    </div>
  </div>
`,
};
