import { useQuery } from '@tanstack/react-query';

async function fetchMainRailways() {
    const response = await fetch('/api/railways/main');
    if (!response.ok) {
        throw new Error('Failed to fetch railways');
    }
    return response.json();
}

async function fetchStandardRailways() {
    const response = await fetch('/api/railways/standard');
    if (!response.ok) {
        throw new Error('Failed to fetch railways');
    }
    return response.json();
}

async function fetchBoundary() {
    const response = await fetch('/api/boundary');
    if (!response.ok) {
        throw new Error('Failed to fetch boundary');
    }
    return response.json();
}

export function useMainRailwaysDataQuery() {
    return useQuery({
        queryKey: ['railways'],
        queryFn: fetchMainRailways,
    });
}

export function useStandardRailwaysDataQuery() {
    return useQuery({
        queryKey: ['standardRailways'],
        queryFn: fetchStandardRailways,
    });
}

export function useBoundaryQuery() {
    return useQuery({
        queryKey: ['boundary'],
        queryFn: fetchBoundary,
    });
}