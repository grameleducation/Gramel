This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project

### Colors

- primary: #09225A
- primary-900: #5C5C61
- primary-300: #62A9DC
- neutral-500: #0C0C13
- neutral-300: #5C5C61
- neutral-50: #FAFAFA

### Payment Integration

The project includes Paystack payment integration for service purchases. To set up payments:

1. **Environment Variables**: Add the following to your `.env.local`:

   ```
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   ```

2. **Database Setup**: Run the SQL files in `src/sql/` to create the payment_transactions table.

3. **Service Codes**: Each service has a unique 4-character code for payment reference:

   - IADM: International Admissions
   - DOCV: Document Verification
   - SCHL: Scholarships
   - VISA: Visa Assistance
   - LANG: Language Proficiency Tests
   - LOAN: Student Loan
   - ADVS: Advisory Services

4. **Payment Flow**:
   - User clicks payment button
   - Server validates service and user authentication
   - Paystack transaction is initialized with unique reference
   - User completes payment on Paystack
   - Callback verifies transaction and updates database
   - Success/cancellation toasts are shown to user
