interface Stop {
    name: string;
    lat: number;
    lon: number;
    platformCode?: string;
}

interface StopTime {
    stop: Stop;
    realtimeArrival?: number;
    realtimeDeparture?: number;
    arrivalDelay?: number;
    departureDelay?: number;
    scheduledArrival?: number;
    scheduledDeparture?: number;
}

interface Route {
    longName?: string;
    shortName?: string;
}

interface Trip {
    gtfsId: string;
    tripShortName?: string;
    tripHeadsign?: string;
}

interface TripDetails {
    gtfsId?: string;
    tripHeadsign?: string;
    trainCategoryName?: string;
    trainName?: string;
    route?: Route;
    stoptimes?: StopTime[];
}

interface VehiclePosition {
    trip?: Trip;
    vehicleId?: string;
    lat?: number;
    lon?: number;
    label?: string;
    speed?: number;
    heading?: number;
}

interface VehiclePositionsResponse {
    data: {
        vehiclePositions: VehiclePosition[];
    };
}

interface TripDetailsResponse {
    data?: {
        trip?: TripDetails;
    };
}

interface CompressedStop {
    name?: string;
    ra?: number; // realtimeArrival
    rd?: number; // realtimeDeparture
    sa?: number; // scheduledArrival
    sd?: number; // scheduledDeparture
    a?: number;  // arrivalDelay
    d?: number;  // departureDelay
    v?: string;  // platform/track (vagany)
}

interface ProcessedVehicle {
    id?: string;
    name?: string;
    headsgn?: string;
    lat?: number;
    lon?: number;
    sp?: number; // speed
    hd?: number; // heading
    delay?: number | string; // delay in minutes or "on time"
    delayColor?: string; // delay in minutes or "on time"
    stops: CompressedStop[];
}

interface ApiResponse {
    lastUpdated: number;
    totalDelay: number;
    vehicles: ProcessedVehicle[];
}