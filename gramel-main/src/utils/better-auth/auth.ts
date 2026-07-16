import "server-only";

import { betterAuth, BetterAuthOptions } from "better-auth";
import { customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import server_env from "../env.server";
import bcrypt from "bcrypt";
import transporter from "../emailTransporter";
import { forgotPassword, signupVerification } from "@/lib/emailTemplates";
import { waitUntil } from "@vercel/functions";
import client_env from "../env.client";
import { startCase } from "lodash";
import assignStudentToStaff from "../studentStaffAssignment";
import pool from "../db";

// GENERATE AND MIGRATE DATABASE SCHEMA. --config is not required if you used defualt better-auth file structure
// npx @better-auth/cli generate --config src/utils/better-auth/auth.ts
// npx @better-auth/cli migrate --config src/utils/better-auth/auth.ts

const options = {
  appName: "Gramel Education",
  trustedOrigins: ["http://localhost:3000", client_env.NEXT_PUBLIC_BASE_URL],
  baseURL: client_env.NEXT_PUBLIC_BASE_URL, // Optional. Default to env variable BETTER_AUTH_URL
  database: pool,
  emailAndPassword: {
    enabled: true,
    password: {
      // using bcrypt for password hashing instead of default scrypt
      hash: async (password) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        return await bcrypt.compare(password, hash);
      },
    },
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 15, // 15 minutes
    sendResetPassword: async (data) => {
      // Use waitUntil to send email to ensure email is sent before the serverless function is terminated
      waitUntil(
        transporter.sendMail({
          from: server_env.SMTP_USER,
          to: data.user.email,
          subject: "Reset Your Password",
          text: forgotPassword.text({ resetLink: data.url }),
          html: forgotPassword.html({ resetLink: data.url }),
        }),
      );
    },
    onPasswordReset: async (user) => {
      // MARK: TODO: send info mail that password has been reset
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true, // Send a verification email automatically on sign in when the user's email is not verified
    sendVerificationEmail: async (data) => {
      // Use waitUntil to send email to ensure email is sent before the serverless function is terminated
      waitUntil(
        transporter.sendMail({
          from: server_env.SMTP_USER,
          to: data.user.email,
          subject: "Verify Your Account",
          text: signupVerification.text({ confirmLink: data.url }),
          html: signupVerification.html({ confirmLink: data.url }),
        }),
      );
    },
    afterEmailVerification: async (user) => {
      // assign staff to student after email verification
      await assignStudentToStaff(pool, user);
    },
    autoSignInAfterVerification: true,
    expiresIn: 60 * 15, // 15 minutes
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: server_env.GOOGLE_CLIENT_ID,
      clientSecret: server_env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser(profile) {
        const first_name = profile.given_name
          ? startCase(profile.given_name)
          : profile.name?.split(" ")[0] || null;
        const last_name = profile.family_name
          ? startCase(profile.family_name)
          : profile.name?.split(" ").slice(1).join(" ") || null;

        return {
          ...(profile.name ? { name: startCase(profile.name) } : {}),
          first_name,
          last_name,
        };
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (account) => {
          // assign staff to student if account is created with google
          if (account.providerId !== "credential") {
            await assignStudentToStaff(pool, account);
          }
        },
      },
    },
  },
  user: {
    modelName: "users",
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      emailVerified: "email_verified",
    },
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "student" },

      // Personal Info
      first_name: { type: "string", required: false },
      last_name: { type: "string", required: false },
      middle_name: { type: "string", required: false },

      // NOTE: Below fields commented out cos better-auth returns all the data in user object even though they are not needed. The fields will be added manually in the sql migration file.
      // date_of_birth: { type: "date", required: false },
      // passport_no: { type: "string", required: false },
      // passport_expiry_date: { type: "date", required: false },
      // gender: { type: "string", required: false },
      // marital_status: { type: "string", required: false },
      // address: { type: "string", required: false },
      // phone: { type: "string", required: false },
      profile_picture_url: { type: "string", required: false },

      // Education Summary
      // highest_education: { type: "string", required: false },
      // highest_edu_country: { type: "string", required: false },
      // highest_edu_grading_scale: { type: "string", required: false },
      // highest_edu_grade_average: { type: "string", required: false },

      // JSON fields for extensible structures
      // next_of_kin: { type: "json", required: true, defaultValue: "{}" },
      // higher_institutions: { type: "json", required: true, defaultValue: "[]" },
      // secondary_schools: { type: "json", required: true, defaultValue: "[]" },
      // other_education: { type: "json", required: true, defaultValue: "[]" },

      // Staff Assignment
      // assigned_staff_id: {
      //   type: "string",
      //   required: false,
      //   references: { model: "users", field: "id", onDelete: "set null" },
      // },
    },
  },
  account: {
    fields: {
      accessToken: "access_token",
      accessTokenExpiresAt: "access_token_expires_at",
      accountId: "account_id",
      createdAt: "created_at",
      idToken: "id_token",
      providerId: "provider_id",
      refreshToken: "refresh_token",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      updatedAt: "updated_at",
      userId: "user_id",
    },
  },
  verification: {
    fields: {
      createdAt: "created_at",
      expiresAt: "expires_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    fields: {
      createdAt: "created_at",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      updatedAt: "updated_at",
      userAgent: "user_agent",
      userId: "user_id",
    },
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
    },
  },
  plugins: [],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...options.plugins,
    customSession(async ({ user, session }) => {
      return { user, session };
    }, options),
    nextCookies(),
  ],
});

export type Auth = typeof auth;
