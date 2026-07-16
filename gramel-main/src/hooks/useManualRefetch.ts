import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useTransition } from "react";

export default function useManualRefetch<T>(
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<T, Error>>,
) {
  const [isManualRefetching, startTransition] = useTransition(); // Could have used isRefetching from useQuery but that also covers background fetching for stale data. Don't want that state visible to the user

  function manualRefetch() {
    startTransition(async () => {
      await refetch();
    });
  }

  return [isManualRefetching, manualRefetch] as const;
}
