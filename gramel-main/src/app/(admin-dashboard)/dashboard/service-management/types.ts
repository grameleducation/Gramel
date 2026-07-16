import type { ServiceDetail } from "@/app/(general-view)/services/[slug]/types";

export type PriceHistoryEntry = {
  changedAt: string;
  actorName: string;
  actorId: string;
  actorEmail: string | null;
  oldPriceKobo: number;
  newPriceKobo: number;
};

export type ServicePriceOption = {
  name: string;
  serviceCode: string;
  price: number;
  history: PriceHistoryEntry[];
};

export type ManagedService = Omit<
  ServiceDetail,
  "tests" | "applicationOptions"
> & {
  serviceSlug: string;
  history: PriceHistoryEntry[];
  tests?: ServicePriceOption[];
  applicationOptions?: ServicePriceOption[];
};
