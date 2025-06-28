// app/api/railways/route.ts

import path from "path";
import fs from 'fs';
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    // This GeoJSON is generated using: https://overpass-turbo.eu/
    /***
        [out:json][timeout:25];

        // Define area (optional: can be limited to a country or region)
        area["ISO3166-1"="HU"]->.searchArea;  // Change "HU" to your target country code

        // Select main railway lines
        (
        way["railway"="rail"]["usage"="main"](area.searchArea);
        relation["railway"="rail"]["usage"="main"](area.searchArea);
        );

        out body;
        >;
        out skel qt;
    */
   
    const geojsonPath = path.join(process.cwd(), 'public', 'data', 'Main_Railways.geojson');

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
