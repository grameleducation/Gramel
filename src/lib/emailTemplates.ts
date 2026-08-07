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

// Welcome onboarding email for consultation booking
export const welcomeOnboarding: EmailTemplate<{ name: string }> = {
  subject: "Welcome to Your Study Abroad Journey - Your Consultation is Confirmed!",
  text: ({ name }) => `
Welcome to Gramel Education, ${name}!

Thank you for booking a consultation with us. We're excited to help you start your study abroad journey!

What to Expect:
• Your dedicated education advisor will review your consultation details
• We'll discuss your academic goals, preferences, and timeline
• You'll learn about scholarships, programs, and funding options
• Next steps will be clearly outlined for your application journey

Next Steps:
A member of our team will reach out to you shortly to confirm your consultation time. Keep an eye on your email and phone for communication from us.

In the meantime, explore these resources:
• Search our 1,500+ partner schools
• Explore scholarship opportunities
• Read student success stories on our website

Questions?
Feel free to reply to this email or contact us:
• Phone: 07041041810
• Email: info@grameleducation.com
• Visit: www.grameleducation.com

We're here to support every step of your journey!

Best regards,
The Gramel Education Team
Empowering Students. Unlocking Global Opportunities.`,
  html: ({ name }) => `
    <div style="font-family: ${styles.fonts.main}; max-width: 600px; margin: 0 auto; padding: 20px; background: ${styles.colors.background}; border: 1px solid ${styles.colors.border}; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: ${styles.colors.primary}; margin: 0; font-size: 28px;">Welcome to Your Study Abroad Journey!</h1>
      </div>

      <div style="color: ${styles.colors.text}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        <p>Hi ${name},</p>
        <p>Thank you for booking a consultation with us. We're excited to help you start your study abroad journey!</p>
      </div>

      <div style="background-color: #f9f9f9; border-left: 4px solid ${styles.colors.primary}; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
        <h3 style="color: ${styles.colors.primary}; margin-top: 0;">What to Expect:</h3>
        <ul style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.8;">
          <li>Your dedicated education advisor will review your consultation details</li>
          <li>We'll discuss your academic goals, preferences, and timeline</li>
          <li>You'll learn about scholarships, programs, and funding options</li>
          <li>Next steps will be clearly outlined for your application journey</li>
        </ul>
      </div>

      <div style="background-color: #e8f4f8; border-left: 4px solid #62a9dc; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
        <h3 style="color: #09225a; margin-top: 0;">Next Steps:</h3>
        <p style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.6;">A member of our team will reach out to you shortly to confirm your consultation time. Keep an eye on your email and phone for communication from us.</p>
      </div>

      <div style="background-color: #f0f0f0; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
        <h3 style="color: ${styles.colors.primary}; margin-top: 0;">In the Meantime:</h3>
        <ul style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.8;">
          <li>Search our 1,500+ partner schools</li>
          <li>Explore scholarship opportunities</li>
          <li>Read student success stories on our website</li>
        </ul>
      </div>

      <div style="background-color: #f5f5f5; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
        <h3 style="color: ${styles.colors.primary}; margin-top: 0;">Questions?</h3>
        <p style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.6;">Feel free to reply to this email or contact us:</p>
        <ul style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.8;">
          <li><strong>Phone:</strong> 07041041810</li>
          <li><strong>Email:</strong> info@grameleducation.com</li>
          <li><strong>Website:</strong> www.grameleducation.com</li>
        </ul>
      </div>

      <div style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        <p>We're here to support every step of your journey!</p>
      </div>

      <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid ${styles.colors.border}; color: ${styles.colors.text}; font-size: 14px; text-align: center;">
        <p><strong>The Gramel Education Team</strong><br>Empowering Students. Unlocking Global Opportunities.</p>
      </div>
    </div>
  `,
};

// New job application received (admin notification)
export const jobApplicationReceived: EmailTemplate<{
  roleTitle: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  message?: string;
}> = {
  subject: "New Job Application Received",
  text: ({ roleTitle, fullName, email, phone, cvUrl, message }) => `
A new application has been submitted on Gramel Education's careers page.

Role: ${roleTitle}
Applicant: ${fullName}
Email: ${email}
Phone: ${phone}
CV: ${cvUrl}
${message ? `\nMessage:\n${message}\n` : ""}
Best regards,
Gramel Education
`,
  html: ({ roleTitle, fullName, email, phone, cvUrl, message }) => `
  <div
    style="font-family: ${styles.fonts.main}; max-width: 600px; margin: 0 auto; padding: 20px; background: ${styles.colors.background}; border: 1px solid ${styles.colors.border}; border-radius: 5px;"
  >
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: ${styles.colors.primary}; margin: 0;">
        New Job Application Received
      </h2>
    </div>

    <div style="color: ${styles.colors.text}; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      <p>A new application has been submitted on Gramel Education's careers page.</p>
    </div>

    <div style="color: ${styles.colors.text}; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      <p><strong>Role:</strong> ${roleTitle}</p>
      <p><strong>Applicant:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>CV:</strong> <a href="${cvUrl}">${cvUrl}</a></p>
      ${
        message
          ? `<p><strong>Message:</strong></p><div style="white-space: pre-wrap; background-color: #f9f9f9; border-radius: 4px; padding: 10px;">${message}</div>`
          : ""
      }
    </div>

    <div
      style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${styles.colors.border}; color: ${styles.colors.text}; font-size: 13px; text-align: center;"
    >
      <p>Best regards,<br>Gramel Education</p>
    </div>
  </div>
`,
};
