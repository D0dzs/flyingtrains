// app/api/railways/route.ts

import path from "path";
import fs from 'fs';
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    // This GeoJSON is generated using: https://overpass-turbo.eu/
    /***
        [out:json][timeout:25];
        // adjust the search radius (in meters) here
        {{radius=1000}}
        // gather results
        relation["type"="boundary"](around:{{radius}},{{geocodeCoords:hungary}});
        // print results
        out geom;



        {{style: 
        *[boundary=administrative]
        { color: #e41a1c; fill-color:transparent; }

        node
        { color:transparent; fill:transparent; fill-color:transparent; }
        }}
    */
   
    const geojsonPath = path.join(process.cwd(), 'public', 'data', 'Boundary.geojson');

    try {
        const data = fs.readFileSync(geojsonPath, 'utf8');
        if (data) {
            return new NextResponse(data, {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        return NextResponse.json({ error: 'Failed to load GeoJSON data' }, { status: 500 });
    } catch (error) {
        return new NextResponse(`Error reading GeoJSON file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { status: 500, headers: { 'Content-Type': 'text/plain' } })
    }
}
