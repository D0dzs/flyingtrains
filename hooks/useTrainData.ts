import { useQuery } from '@tanstack/react-query';

async function fetchTrainData() {
    const response = await fetch('/api/train-data');
    if (!response.ok) {
        throw new Error('Failed to fetch train data');
    }
    return response.json();
}

export function useTrainDataQuery() {
    return useQuery({
        queryKey: ['trainData'],
        queryFn: fetchTrainData,
        refetchInterval: 2 * 60 * 1000, // 2 minute
        refetchIntervalInBackground: true,
        staleTime: 59000, // Consider data stale after 59 seconds
        retry: 3,
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}
