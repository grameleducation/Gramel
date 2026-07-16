"use client";

import { themeMaterial, type ColDef } from "ag-grid-community";
import numeral from "numeral";
import AgGridTable from "@/lib/AgGridTable";
import ProofOfPaymentDialog from "@/components/ProofOfPaymentDialog";
import type { Payment } from "./page";

const columnDefs: ColDef[] = [
  {
    headerName: "Service",
    field: "service",
    filter: true,
    valueFormatter: (params: { value: string }) => params.value,
  },
  {
    headerName: "Amount",
    field: "amount",
    valueFormatter: (params) =>
      params.value ? `₦${numeral(params.value / 100).format("0,0.00")}` : "-",
  },
  {
    headerName: "Paid Date",
    field: "paid_at",
    valueFormatter: (params) =>
      params.value ? new Date(params.value).toLocaleString() : "-",
  },
  {
    headerName: "Transaction Reference",
    field: "transaction_reference",
    filter: true,
  },
  {
    headerName: "Payment Type",
    field: "payment_type",
    filter: true,
  },
  {
    headerName: "Offline Proof of Payment",
    field: "proof_of_payment",
    cellRenderer: (params: { value: string | null }) => {
      return params.value ? (
        <ProofOfPaymentDialog proofUrl={params.value} />
      ) : (
        "-"
      );
    },
  },
];

const myTheme = themeMaterial.withParams({
  wrapperBorder: "1px solid #E5E7EB",
  wrapperBorderRadius: 16,
  headerBackgroundColor: "#F9FAFB",
  headerColumnResizeHandleColor: "#C5C6CA",
});

export default function PaymentHistoryTable({
  payments,
}: {
  payments: Payment[];
}) {
  return (
    <div className="table-container-scrollbar-style w-full overflow-x-auto">
      <AgGridTable<Payment>
        theme={myTheme}
        rowData={payments}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        suppressCellFocus
        alwaysShowHorizontalScroll
        scrollbarWidth={8}
        autoSizeStrategy={{ type: "fitCellContents" }}
      />
    </div>
  );
}
