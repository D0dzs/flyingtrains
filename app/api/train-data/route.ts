// app/api/train-data/route.ts
import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = "https://emma.mav.hu/otp2-backend/otp/routers/default/index/graphql";

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

function getServiceDay(): string {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function delayColor(min: number) {
    if (min >= 90) return 'bg-red-950'; // 90+ minutes
    if (min >= 60) return 'bg-red-500';
    if (min >= 15) return 'bg-orange-500';
    if (min >= 5) return 'bg-yellow-500';
    return 'bg-lime-500';
}


const now = new Date();
const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

function getCurrentDelay(stops: CompressedStop[], now: number) {
    for (const stop of stops) {
        const arrivalTime = stop.ra; // realtimeArrival in seconds since midnight
        if (arrivalTime! > now) {
            return stop.a || stop.d || 0; // Prefer arrival delay, fallback to departure
        }
    }

    // Fallback: use last known stop
    const lastStop = stops[stops.length - 1];
    return lastStop ? (lastStop.a || lastStop.d || 0) : 0;
}


async function fetchVehiclePositions(): Promise<VehiclePosition[]> {
    const query = `
    {
      vehiclePositions(
        swLat: 45.5,
        swLon: 16.1,
        neLat: 48.7,
        neLon: 22.8,
        modes: [RAIL, RAIL_REPLACEMENT_BUS]
      ) {
        trip {
          gtfsId
          tripShortName
          tripHeadsign
        }
        vehicleId
        lat
        lon
        label
        speed
        heading
      }
    }
  `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: VehiclePositionsResponse = await response.json();
    return data.data.vehiclePositions;
}

async function fetchTripDetails(gtfsId: string, serviceDay: string): Promise<TripDetails> {
    const query = `
    {
      trip(id: "${gtfsId}", serviceDay: "${serviceDay}") {
        gtfsId
        tripHeadsign
        trainCategoryName
        trainName
        route {
          longName(language: "hu")
          shortName
        }
        stoptimes {
          stop {
            name
            lat
            lon
            platformCode
          }
          realtimeArrival
          realtimeDeparture
          arrivalDelay
          departureDelay
          scheduledArrival
          scheduledDeparture
        }
      }
    }
  `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TripDetailsResponse = await response.json();
    return data.data?.trip || {};
}

export async function GET(request: NextRequest) {
    const verification = await checkBotId();
    if (verification.isBot) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    try {
        const serviceDay = getServiceDay();
        console.log("Fetching vehicle positions... [" + new Date().toLocaleString("hu-HU") + "]");

        const vehicles = await fetchVehiclePositions();

        const allData: ApiResponse = {
            lastUpdated: Date.now(),
            totalDelay: 0,
            vehicles: []
        };

        // Process each vehicle
        for (const vehicle of vehicles) {
            const trip = vehicle.trip;
            const gtfsId = trip?.gtfsId;

            if (gtfsId) {
                try {
                    const tripDetails = await fetchTripDetails(gtfsId, serviceDay);

                    const tripShortName = trip?.tripShortName;
                    const tripHeadsign = trip?.tripHeadsign;
                    const vehicleId = vehicle.vehicleId;
                    const lat = vehicle.lat;
                    const lon = vehicle.lon;
                    const label = vehicle.label;
                    const speed = vehicle.speed;
                    const heading = vehicle.heading;
                    const trainCat = tripDetails.trainCategoryName;
                    const trainName = tripDetails.trainName;
                    const routeLongName = tripDetails.route?.longName;
                    const routeShortName = tripDetails.route?.shortName;
                    const stopTimes = tripDetails.stoptimes || [];

                    // Compress stop data
                    const stopsCompressed: CompressedStop[] = stopTimes.map(stop => {
                        const st = stop.stop;
                        return {
                            name: st?.name,
                            ra: stop.realtimeArrival,
                            rd: stop.realtimeDeparture,
                            sa: stop.scheduledArrival,
                            sd: stop.scheduledDeparture,
                            a: stop.arrivalDelay,
                            d: stop.departureDelay,
                            v: st?.platformCode
                        };
                    });

                    // Determine name
                    let name = tripShortName;
                    if (routeLongName && routeLongName.length < 6) {
                        name = `[${routeLongName}] ${tripShortName}`;
                    }

                    const delayInSec = getCurrentDelay(stopsCompressed, nowSec);

                    allData.totalDelay += delayInSec;
                    const delayInMin = Math.floor(delayInSec / 60);
                    const delayCategory = delayColor(delayInMin);

                    allData.vehicles.push({
                        id: gtfsId,
                        name: name,
                        headsgn: tripHeadsign,
                        lat: lat,
                        lon: lon,
                        sp: speed,
                        hd: heading,
                        stops: stopsCompressed,
                        delay: delayInMin,
                        delayColor: delayCategory
                    });
                } catch (error) {
                    console.error(`Error fetching trip details for ${gtfsId}:`, error);
                    // Continue with next vehicle even if one fails
                }
            }
        }

        return NextResponse.json(allData, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('Error fetching train data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch train data' },
            { status: 500 }
        );
    }
}