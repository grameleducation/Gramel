"use client";

import { themeMaterial, type ColDef } from "ag-grid-community";
import numeral from "numeral";
import AgGridTable from "@/lib/AgGridTable";
import { PaymentTransaction } from "./types";
import ProofOfPaymentDialog from "@/components/ProofOfPaymentDialog";

const ServicesWithOptionsMap = {
  "Single Application": "Single Application - International Admissions",
  "Applications to 2 Schools":
    "Applications to 2 Schools - International Admissions",
  IELTS: "IELTS - Language Proficiency Test",
  TOEFL: "TOEFL - Language Proficiency Test",
  GRE: "GRE - Language Proficiency Test",
  "Duolingo English Test": "Duolingo English Test - Language Proficiency Test",
  "Pearson - PTE": "Pearson - PTE - Language Proficiency Test",
};

const columnDefs: ColDef[] = [
  {
    headerName: "S/N",
    maxWidth: 100,
    valueGetter: (params) =>
      typeof params.node?.rowIndex === "number" ? params.node.rowIndex + 1 : "",
  },
  {
    headerName: "Service",
    field: "service",
    filter: true,
    valueFormatter: (params: { value: keyof typeof ServicesWithOptionsMap }) =>
      ServicesWithOptionsMap[params.value] || params.value,
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
    headerName: "Created By",
    field: "created_by",
    filter: true,
    valueFormatter: (params) => params.value || "-",
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

type Payment = Pick<
  PaymentTransaction,
  | "service"
  | "amount"
  | "paid_at"
  | "transaction_reference"
  | "payment_type"
  | "created_by"
  | "proof_of_payment"
>;

export default function StaffViewPaymentHistoryTable({
  payments,
}: {
  payments: Payment[];
}) {
  return (
    <div className="table-container-scrollbar-style w-full overflow-x-auto [&_.ag-cell]:text-center [&_.ag-header-cell-label]:justify-center">
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
