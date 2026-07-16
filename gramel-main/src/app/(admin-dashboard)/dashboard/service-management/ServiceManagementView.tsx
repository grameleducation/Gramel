"use client";

import { useState } from "react";
import { updateServicePriceAction } from "./serverAction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import numeral from "numeral";
import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ManagedService, PriceHistoryEntry } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { themeMaterial, type ColDef } from "ag-grid-community";
import AgGridTable from "@/lib/AgGridTable";
import { normalize } from "@/utils/normalize";
import { useAuthContext } from "@/context/AuthContext";

function koboToNaira(kobo: number) {
  return kobo / 100;
}

function formatMoneyNaira(n: number) {
  return `₦${numeral(n).format("0,0.00")}`;
}

function optionKey(serviceSlug: string, optionName: string | null) {
  return normalize(`${serviceSlug}::${optionName ?? "BASE"}`);
}

type PendingUpdate = {
  serviceSlug: string;
  serviceTitle: string;
  optionName: string | null;
  currentPrice: number;
  newPrice: number;
};

function PriceHistoryTable({ history }: { history: PriceHistoryEntry[] }) {
  const { user } = useAuthContext();

  const columnDefs: ColDef[] = [
    {
      headerName: "Date of Change",
      field: "changedAt",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "-",
    },
    {
      headerName: "Changed By",
      field: "actorName",
      valueFormatter: (params) => {
        const actorName = params.value;
        const actorId = params.data?.actorId;
        return user?.id === actorId ? `${actorName} (Yourself)` : actorName;
      },
    },
    {
      headerName: "Old Price",
      field: "oldPriceKobo",
      valueFormatter: (params) =>
        params.value === 0
          ? "0"
          : params.value
            ? `₦${numeral(params.value / 100).format("0,0.00")}`
            : "-",
    },
    {
      headerName: "New Price",
      field: "newPriceKobo",
      valueFormatter: (params) =>
        params.value === 0
          ? "0"
          : params.value
            ? `₦${numeral(params.value / 100).format("0,0.00")}`
            : "-",
    },
  ];

  const myTheme = themeMaterial.withParams({
    wrapperBorder: "1px solid #E5E7EB",
    wrapperBorderRadius: 12,
    headerBackgroundColor: "#F9FAFB",
    headerColumnResizeHandleColor: "#C5C6CA",
  });

  return (
    <div className="table-container-scrollbar-style w-full overflow-x-auto [&_.ag-cell]:text-center [&_.ag-header-cell-label]:justify-center">
      <AgGridTable<PriceHistoryEntry>
        theme={myTheme}
        rowData={history}
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

export default function ServiceManagementView({
  services,
}: {
  services: ManagedService[];
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<PendingUpdate | null>(
    null,
  );

  async function handleSaveConfirm() {
    if (!pendingUpdate) return;
    const { serviceSlug, optionName, newPrice } = pendingUpdate;

    const key = optionKey(serviceSlug, optionName);
    setSavingKey(key);

    try {
      const res = await updateServicePriceAction({
        serviceSlug,
        optionName,
        newPriceNaira: newPrice,
      });

      if (!res.success) return toast.error(res.error);

      toast.success("Price updated.");
      setDrafts((d) => {
        const copy = { ...d };
        delete copy[key];
        return copy;
      });
      setPendingUpdate(null);
      router.refresh();
    } catch {
      toast.error("Failed to update price. Please try again.");
    } finally {
      setSavingKey(null);
    }
  }

  function getCurrentRow(service: ManagedService, optionName: string | null) {
    if (optionName === null) return service;
    return (
      service.tests?.find((t) => normalize(t.name) === normalize(optionName)) ||
      service.applicationOptions?.find((o) => o.name === optionName)
    );
  }

  function openConfirmation(
    service: ManagedService,
    optionName: string | null,
  ) {
    const row = getCurrentRow(service, optionName);
    if (!row) return toast.error("Row not found.");

    const key = optionKey(service.serviceSlug, optionName);
    const raw = drafts[key];
    if (!raw) return toast.error("Price is required.");

    const value = Number(raw);
    if (Number.isNaN(value)) return toast.error("Invalid price value.");

    setPendingUpdate({
      serviceSlug: service.serviceSlug,
      serviceTitle: service.title,
      optionName,
      currentPrice: koboToNaira(row.price),
      newPrice: value,
    });
  }

  return (
    <div className="px-6 md:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Services Price Management
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Update service prices in Naira. Every change is saved to the price
          history.
        </p>
      </div>

      <div className="space-y-6">
        {services.map((s) => {
          const hasOptions =
            !!s.tests?.length || !!s.applicationOptions?.length;

          return (
            <Card
              key={s.serviceSlug}
              className="max-w-full overflow-hidden border-none shadow-md"
            >
              <CardHeader className="bg-white">
                <CardTitle className="text-xl text-primary">
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasOptions ? null : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] md:grid-cols-1 lg:grid-cols-[1fr_auto]">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-700">
                        Price
                      </p>
                      <p className="text-sm text-gray-500">
                        Current: {formatMoneyNaira(koboToNaira(s.price))}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        disabled={!!savingKey}
                        value={drafts[optionKey(s.serviceSlug, null)] ?? ""}
                        placeholder="Enter new price (₦)"
                        onChange={(e) => {
                          const key = optionKey(s.serviceSlug, null);
                          setDrafts((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        className="grow text-sm inset-shadow-sm sm:w-41"
                      />
                      <Button
                        onClick={() => openConfirmation(s, null)}
                        disabled={!!savingKey}
                      >
                        {savingKey === optionKey(s.serviceSlug, null) ? (
                          <>
                            <LoaderCircle className="mr-2 size-4 animate-spin" />
                            Saving
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 size-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Option rows */}
                {s.tests?.length ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Tests</p>
                    <div className="space-y-3">
                      {s.tests.map((t) => {
                        const key = optionKey(s.serviceSlug, t.name);
                        return (
                          <div
                            key={key}
                            className="rounded-lg border border-gray-200 p-3"
                          >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] md:grid-cols-1 lg:grid-cols-[1fr_auto]">
                              <div className="">
                                <p className="text-sm font-semibold text-gray-800">
                                  {t.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Current:{" "}
                                  {formatMoneyNaira(koboToNaira(t.price))}
                                </p>
                              </div>
                              <div className="flex items-start gap-3">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={drafts[key] ?? ""}
                                  disabled={!!savingKey}
                                  placeholder="Enter new price (₦)"
                                  onChange={(e) =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="grown text-sm inset-shadow-sm sm:w-41"
                                />
                                <Button
                                  onClick={() => openConfirmation(s, t.name)}
                                  disabled={!!savingKey}
                                >
                                  {savingKey === key ? (
                                    <>
                                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                                      Saving
                                    </>
                                  ) : (
                                    <>
                                      <Save className="mr-2 size-4" />
                                      Save
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {t.history.length > 0 && (
                              <div className="mt-3">
                                <p className="mb-1 font-bold text-primary-300 uppercase">
                                  Price Change History for {t.name}
                                </p>
                                <PriceHistoryTable history={t.history} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {s.applicationOptions?.length ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Application packages
                    </p>
                    <div className="space-y-3">
                      {s.applicationOptions.map((o) => {
                        const key = optionKey(s.serviceSlug, o.name);
                        return (
                          <div
                            key={key}
                            className="rounded-lg border border-gray-200 p-3"
                          >
                            <div className="grid grid-cols-1 gap-4 px-3 sm:grid-cols-[1fr_auto] md:grid-cols-1 lg:grid-cols-[1fr_auto]">
                              <div className="">
                                <p className="text-sm font-semibold text-gray-800">
                                  {o.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Current:{" "}
                                  {formatMoneyNaira(koboToNaira(o.price))}
                                </p>
                              </div>
                              <div className="flex items-start gap-3">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={drafts[key] ?? ""}
                                  disabled={!!savingKey}
                                  placeholder="Enter new price (₦)"
                                  onChange={(e) =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="w-41 grow text-sm inset-shadow-sm"
                                />
                                <Button
                                  onClick={() => openConfirmation(s, o.name)}
                                  disabled={!!savingKey}
                                >
                                  {savingKey === key ? (
                                    <>
                                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                                      Saving
                                    </>
                                  ) : (
                                    <>
                                      <Save className="mr-2 size-4" />
                                      Save
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {o.history.length > 0 && (
                              <div className="mt-3">
                                <p className="mb-1 font-bold text-primary-300 uppercase">
                                  Price Change History for {o.name}
                                </p>
                                <PriceHistoryTable history={o.history} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {s.history.length > 0 && !hasOptions ? (
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="mb-1 font-bold text-primary-300 uppercase">
                      Price Change History for {s.title}
                    </p>
                    <PriceHistoryTable history={s.history} />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={!!pendingUpdate}
        onOpenChange={(open) => !open && setPendingUpdate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm price update</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the details below before saving this price change.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingUpdate && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {pendingUpdate.serviceTitle}
              </p>
              {pendingUpdate.optionName && (
                <p>
                  <span className="font-semibold">Option:</span>{" "}
                  {pendingUpdate.optionName}
                </p>
              )}
              <p>
                <span className="font-semibold">Current price:</span>{" "}
                {formatMoneyNaira(pendingUpdate.currentPrice)}
              </p>
              <p>
                <span className="font-semibold">New price:</span>{" "}
                {formatMoneyNaira(pendingUpdate.newPrice)}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogAction asChild disabled={!!savingKey}>
              <Button
                onClick={() => setPendingUpdate(null)}
                disabled={!!savingKey}
                className="cursor-pointer bg-red-500 text-white duration-200 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed"
              >
                Cancel
              </Button>
            </AlertDialogAction>
            <AlertDialogAction asChild>
              <Button onClick={handleSaveConfirm} disabled={!!savingKey}>
                {savingKey ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Confirm and save"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
