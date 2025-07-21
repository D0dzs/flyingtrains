import { useQuery } from "@tanstack/react-query";

async function fetchTrainData() {
  const response = await fetch("/api/train-data");
  if (!response.ok) {
    throw new Error("Failed to fetch train data");
  }
  return response.json();
}

export function useTrainDataQuery() {
  return useQuery({
    queryKey: ["trainData"],
    queryFn: fetchTrainData,
    refetchInterval: 30 * 1000, // 30 seconds
    refetchIntervalInBackground: true,
    staleTime: 29000, // Consider data stale after 29 seconds
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
