import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { UserRoles } from "@/lib/permissions/role";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import pool from "@/utils/db";

export type Payment = {
  service: string;
  amount: number;
  paid_at: string;
  transaction_reference: string;
  payment_type: string;
  proof_of_payment: string | null;
};

export default async function PaymentHistoryPage() {
  const userRole = (session.user as any).role || "student";
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError) redirect("/");
  if (!session?.user) redirect("/login");

  // Ensure the user is a student
  if (userRole !== UserRoles.student) redirect("/");

  const [paymentsResult, error] = await tryCatch(
    async () =>
      await pool.query<Payment>(
        `SELECT service, amount, paid_at, transaction_reference, payment_type, proof_of_payment
        FROM public.payment_transactions
        LEFT JOIN public.users u ON public.payment_transactions.created_by = u.id
        WHERE user_id = $1 AND status = 'completed' ORDER BY paid_at DESC`,
        [session.user.id],
      ),
  );
  const payments = paymentsResult?.rows;

  return (
    <section className="">
      <Card className="border-0 py-0 shadow-none">
        <CardHeader className="max-lg:p-0">
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="max-lg:p-0">
          {error || !payments || payments.length === 0 ? (
            <p className="text-muted-foreground">
              Your payment history will be displayed here.
            </p>
          ) : (
            <PaymentHistoryTable payments={payments} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
