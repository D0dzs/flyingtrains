type LeafletMapProps = Readonly<{
    trainData: ApiResponse;
    isTrainLoading: boolean;
    trainError: Error | null;
}>