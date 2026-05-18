// =============================================
// FloodGuard - Taman Sri Muda
// Real boundary + Evacuation Routes
// =============================================

// ACTUAL OSM boundary of Taman Sri Muda (59 points from Nominatim)
const TSM_BOUNDARY = [
    [3.0298265, 101.5253153],[3.029564,  101.525715],
    [3.0295238, 101.5285984],[3.0272042, 101.5298335],
    [3.0273676, 101.5301621],[3.0234865, 101.5321845],
    [3.0233419, 101.5319297],[3.0216397, 101.5329033],
    [3.0217991, 101.5331755],[3.0222893, 101.5331742],
    [3.0222793, 101.5333943],[3.022225,  101.5351161],
    [3.0213839, 101.5354044],[3.0204853, 101.5358993],
    [3.0236981, 101.5416312],[3.029347,  101.5416741],
    [3.0297059, 101.5418297],[3.0299256, 101.5420255],
    [3.0301773, 101.5423205],[3.0303581, 101.5426303],
    [3.0304572, 101.5428422],[3.0306353, 101.543321],
    [3.0306862, 101.5437689],[3.030697,  101.5451154],
    [3.0306541, 101.5453327],[3.0301666, 101.5464511],
    [3.030747,  101.5466687],[3.0307612, 101.5466313],
    [3.0309487, 101.5461373],[3.0312487, 101.5454668],
    [3.0314148, 101.5451208],[3.0317683, 101.5445173],
    [3.0319558, 101.5442491],[3.0321192, 101.544131],
    [3.0324379, 101.5439594],[3.0329201, 101.5438226],
    [3.0333004, 101.5437851],[3.0335281, 101.5437528],
    [3.0347736, 101.5421569],[3.0349316, 101.5410961],
    [3.0353039, 101.5411833],[3.036994,  101.5383562],
    [3.0371547, 101.5384528],[3.0374252, 101.538021],
    [3.0379502, 101.5363017],[3.0377252, 101.535961],
    [3.0379877, 101.5347728],[3.0375538, 101.5343115],
    [3.0376636, 101.5339306],[3.0382636, 101.5335363],
    [3.0385582, 101.5323508],[3.0386225, 101.5314522],
    [3.0383948, 101.5297356],[3.0377104, 101.5296892],
    [3.0355637, 101.5272975],[3.0355583, 101.5259188],
    [3.0350012, 101.5254065],[3.0298961, 101.5253165],
    [3.0298265, 101.5253153]
];

// ---- Real PPS (Pusat Pemindahan Sementara) Locations ----
const PPS_LOCATIONS = [
    {
        id: 'pps1',
        name: 'Dewan Azalea Seksyen 25',
        shortName: 'Dewan Azalea',
        coords: [3.0336, 101.5367],
        capacity: 500,
        current_pax: 450,
        type: 'primary',
        note: 'Primary Relief Centre - Used during 2021 floods'
    },
    {
        id: 'pps2',
        name: 'SK Taman Sri Muda',
        shortName: 'SK Sri Muda',
        coords: [3.0315, 101.5398],
        capacity: 800,
        current_pax: 200,
        type: 'primary',
        note: 'Primary Relief Centre - National School'
    },
    {
        id: 'pps3',
        name: 'Dewan Kenangan MBSA, Seksyen 28',
        shortName: 'Dewan MBSA Sek28',
        coords: [3.0487, 101.5421],
        capacity: 1200,
        current_pax: 1100,
        type: 'secondary',
        note: 'Secondary Relief Centre - For those unable to reach primary centre'
    },
    {
        id: 'pps4',
        name: 'SK Seksyen 16 Shah Alam',
        shortName: 'SK Seksyen 16',
        coords: [3.0576, 101.5189],
        capacity: 1000,
        current_pax: 0,
        type: 'secondary',
        note: 'Secondary Relief Centre - Via Highway'
    }
];

// ---- Evacuation Zones within TSM ----
// Each zone has a colour, label, and assigned PPS
const EVAC_ZONES = [
    {
        id: 'zone-north',
        name: 'North Zone',
        color: '#7c3aed',
        centroid: [3.0375, 101.5340],
        ppsId: 'pps3',                        // → Dewan MBSA Sek28 (north exit)
        route: [                               // Waypoints along actual roads
            [3.0375, 101.5340],
            [3.0388, 101.5320],
            [3.0410, 101.5310],
            [3.0440, 101.5350],
            [3.0487, 101.5421]
        ]
    },
    {
        id: 'zone-east',
        name: 'East Zone',
        color: '#0891b2',
        centroid: [3.0308, 101.5450],
        ppsId: 'pps2',                        // → SK Taman Sri Muda (east)
        route: [
            [3.0308, 101.5450],
            [3.0311, 101.5420],
            [3.0315, 101.5398]
        ]
    },
    {
        id: 'zone-center',
        name: 'Central Zone',
        color: '#059669',
        centroid: [3.0310, 101.5360],
        ppsId: 'pps1',                        // → Dewan Azalea (closest)
        route: [
            [3.0310, 101.5360],
            [3.0325, 101.5365],
            [3.0336, 101.5367]
        ]
    },
    {
        id: 'zone-south',
        name: 'South Zone',
        color: '#d97706',
        centroid: [3.0230, 101.5370],
        ppsId: 'pps4',                        // → SK Seksyen 16 (via lebuhraya)
        route: [
            [3.0230, 101.5370],
            [3.0215, 101.5355],
            [3.0205, 101.5300],
            [3.0240, 101.5250],
            [3.0350, 101.5210],
            [3.0450, 101.5190],
            [3.0576, 101.5189]
        ]
    },
    {
        id: 'zone-west',
        name: 'West Zone',
        color: '#be185d',
        centroid: [3.0290, 101.5265],
        ppsId: 'pps4',                        // → SK Seksyen 16 (via lebuhraya west)
        route: [
            [3.0290, 101.5265],
            [3.0270, 101.5260],
            [3.0250, 101.5270],
            [3.0240, 101.5250],
            [3.0350, 101.5210],
            [3.0576, 101.5189]
        ]
    }
];

// ---- Ray-Casting Point-in-Polygon ----
function pointInPolygon(lat, lng, polygon) {
    let inside = false;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = polygon[i][1], yi = polygon[i][0];
        const xj = polygon[j][1], yj = polygon[j][0];
        const intersect = ((yi > lat) !== (yj > lat)) &&
            (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// ---- Grid config (A: 60×60 for smoothness) ----
const minLat = Math.min(...TSM_BOUNDARY.map(p => p[0]));
const maxLat = Math.max(...TSM_BOUNDARY.map(p => p[0]));
const minLng = Math.min(...TSM_BOUNDARY.map(p => p[1]));
const maxLng = Math.max(...TSM_BOUNDARY.map(p => p[1]));
const GRID_ROWS = 60, GRID_COLS = 60;
const latStep = (maxLat - minLat) / GRID_ROWS;
const lngStep = (maxLng - minLng) / GRID_COLS;

// ---- Multi-octave seeded noise (D: organic edges) ----
function seededRandom(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

function fbmNoise(r, c, octaves) {
    let val = 0, amp = 1, freq = 1, max = 0;
    for (let o = 0; o < octaves; o++) {
        val += seededRandom(r * freq * 137 + c * freq * 241 + o * 997) * amp;
        max += amp;
        amp *= 0.5;
        freq *= 2;
    }
    return val / max;
}

// ---- River proximity (B: radial gradient from river/low areas) ----
// Sungai Klang runs along the north-east; low-lying center is the flood epicenter
const FLOOD_EPICENTERS = [
    { lat: 3.0295, lng: 101.5370, weight: 1.0 },   // River-adjacent center
    { lat: 3.0260, lng: 101.5340, weight: 0.8 },   // Southern low area
    { lat: 3.0320, lng: 101.5400, weight: 0.7 },   // East near river bend
];

function getEpicenterInfluence(lat, lng) {
    let maxInfluence = 0;
    for (const ep of FLOOD_EPICENTERS) {
        const dist = Math.hypot(
            (lat - ep.lat) / (maxLat - minLat),
            (lng - ep.lng) / (maxLng - minLng)
        );
        const influence = ep.weight * Math.max(0, 1 - dist * 1.8);
        maxInfluence = Math.max(maxInfluence, influence);
    }
    return maxInfluence;
}

// Pre-build cells with organic vulnerability
const cells = [];
for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
        const cLat = minLat + (r + 0.5) * latStep;
        const cLng = minLng + (c + 0.5) * lngStep;
        if (!pointInPolygon(cLat, cLng, TSM_BOUNDARY)) continue;

        // (B) Radial gradient from epicenters
        const epicenterInfl = getEpicenterInfluence(cLat, cLng);

        // (D) Multi-octave noise for organic edges
        const noise = fbmNoise(r, c, 4);
        const edgeNoise = (noise - 0.5) * 0.5; // range: -0.25 to +0.25

        // Distance to polygon boundary for soft edge erosion
        let minBoundaryDist = Infinity;
        for (const bp of TSM_BOUNDARY) {
            const d = Math.hypot(cLat - bp[0], cLng - bp[1]);
            minBoundaryDist = Math.min(minBoundaryDist, d);
        }
        const edgeFade = Math.min(1, minBoundaryDist / 0.003); // soft fade near boundary

        const rawVuln = epicenterInfl * 0.7 + noise * 0.3;
        const vulnerability = Math.max(0, Math.min(1.0, rawVuln * edgeFade + edgeNoise * edgeFade));

        // (D) Skip cells at organic edges (erosion)
        if (vulnerability < 0.03) continue;

        cells.push({
            swLat: minLat + r * latStep, swLng: minLng + c * lngStep,
            neLat: minLat + (r + 1) * latStep, neLng: minLng + (c + 1) * lngStep,
            cLat, cLng,
            vulnerability
        });
    }
}

// ---- Map Init ----
const map = L.map('map', { zoomControl: true }).setView([3.0295, 101.5360], 14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap contributors · © CARTO',
    subdomains: 'abcd'
}).addTo(map);

// (E) Create custom pane for shimmer effect
map.createPane('floodPane');
map.getPane('floodPane').style.zIndex = 350;
map.createPane('contourPane');
map.getPane('contourPane').style.zIndex = 355;

// TSM boundary outline
L.polygon(TSM_BOUNDARY, {
    color: '#818cf8', weight: 2.5, opacity: 0.8,
    fill: false, dashArray: '8, 5'
}).addTo(map).bindTooltip('Taman Sri Muda', {
    permanent: true, direction: 'center', className: 'area-label'
});

// ---- PPS Markers ----
const ppsIconPrimary = L.divIcon({
    className: '',
    html: `<div class="pps-marker primary"><span>🏥</span></div>`,
    iconSize: [38, 38], iconAnchor: [19, 19]
});
const ppsIconSecondary = L.divIcon({
    className: '',
    html: `<div class="pps-marker secondary"><span>🏫</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 17]
});

const ppsMap = {};
PPS_LOCATIONS.forEach(pps => {
    const icon = pps.type === 'primary' ? ppsIconPrimary : ppsIconSecondary;
    const paxPct = Math.min(100, Math.round((pps.current_pax / pps.capacity) * 100));
    const paxColor = paxPct > 90 ? '#ef4444' : paxPct > 70 ? '#f59e0b' : '#10b981';
    const marker = L.marker(pps.coords, { icon })
        .addTo(map)
        .bindPopup(`
            <div class="pps-popup">
                <div class="pps-popup-title">${pps.name}</div>
                <div class="pps-popup-tag ${pps.type}">${pps.type === 'primary' ? '🔴 Primary Centre' : '🟡 Secondary Centre'}</div>
                <div class="pps-popup-row" style="margin-top:8px;">👥 Capacity: <b>${pps.capacity.toLocaleString()}</b></div>
                <div class="pps-popup-row">
                    🏕️ Occupancy: <b style="color:${paxColor}">${pps.current_pax}</b> (${paxPct}%)
                    <div class="pax-bar-container">
                        <div class="pax-bar-fill" style="width: ${paxPct}%; background: ${paxColor}"></div>
                    </div>
                </div>
                <div class="pps-popup-note">${pps.note}</div>
            </div>
        `, { maxWidth: 260 });
    ppsMap[pps.id] = marker;
});

// ---- Zone Labels ----
EVAC_ZONES.forEach(zone => {
    const zoneIcon = L.divIcon({
        className: '',
        html: `<div class="zone-label" style="border-color:${zone.color};color:${zone.color}">${zone.name}</div>`,
        iconSize: [90, 26], iconAnchor: [45, 13]
    });
    L.marker(zone.centroid, { icon: zoneIcon, interactive: false }).addTo(map);
});

// ---- Evacuation Route Layers (Redesigned) ----
let routeLayers = [];
let routeAnimFrame = null;

// Create route pane above flood
map.createPane('routeGlowPane');
map.getPane('routeGlowPane').style.zIndex = 400;
map.createPane('routeLinePane');
map.getPane('routeLinePane').style.zIndex = 405;
map.createPane('routeArrowPane');
map.getPane('routeArrowPane').style.zIndex = 410;

// Compute bearing angle between two latlng points (in degrees)
function bearing(from, to) {
    const dLng = to[1] - from[1];
    const dLat = to[0] - from[0];
    return Math.atan2(dLng, dLat) * (180 / Math.PI);
}

// Get the midpoint of a segment
function midpoint(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

// Create a proper SVG triangle arrowhead marker
function createArrowMarker(position, angle, color, size) {
    const icon = L.divIcon({
        className: '',
        html: `<div class="route-arrow" style="transform:rotate(${angle - 90}deg)">
            <svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <polygon points="4,2 20,12 4,22" fill="${color}" opacity="0.95"/>
                <polygon points="4,2 20,12 4,22" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            </svg>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
    return L.marker(position, { icon, interactive: false, pane: 'routeArrowPane' });
}

function drawEvacuationRoutes(rainfall) {
    // Clean up
    routeLayers.forEach(l => map.removeLayer(l));
    routeLayers = [];
    if (routeAnimFrame) { cancelAnimationFrame(routeAnimFrame); routeAnimFrame = null; }
    if (rainfall < 50) return;

    const urgency = rainfall >= 150 ? 'high' : rainfall >= 100 ? 'moderate' : 'low';
    const glowWeight = urgency === 'high' ? 12 : 8;
    const lineWeight = urgency === 'high' ? 4.5 : 3;
    const arrowSize = urgency === 'high' ? 22 : 18;

    EVAC_ZONES.forEach(zone => {
        const pps = PPS_LOCATIONS.find(p => p.id === zone.ppsId);

        // Layer 1: Glow trail (wide, semi-transparent, blurred feel)
        const glowLine = L.polyline(zone.route, {
            color: zone.color,
            weight: glowWeight,
            opacity: 0.15,
            lineCap: 'round',
            lineJoin: 'round',
            pane: 'routeGlowPane',
            interactive: false
        }).addTo(map);

        // Layer 2: Main route line (solid with animated dash)
        const routeLine = L.polyline(zone.route, {
            color: zone.color,
            weight: lineWeight,
            opacity: 0.9,
            dashArray: '12, 8',
            lineCap: 'round',
            lineJoin: 'round',
            pane: 'routeLinePane',
            className: `evac-route evac-route--${urgency}`
        }).addTo(map);

        // Layer 3: Filled triangle arrows at midpoints of each segment
        for (let i = 0; i < zone.route.length - 1; i++) {
            const from = zone.route[i];
            const to = zone.route[i + 1];
            const mid = midpoint(from, to);
            const angle = bearing(from, to);
            const arrow = createArrowMarker(mid, angle, zone.color, arrowSize);
            arrow.addTo(map);
            routeLayers.push(arrow);

            // For long segments, add an extra arrow at 75%
            const segLen = Math.hypot(to[0] - from[0], to[1] - from[1]);
            if (segLen > 0.008) {
                const q3 = [from[0] + (to[0] - from[0]) * 0.75, from[1] + (to[1] - from[1]) * 0.75];
                const arrow2 = createArrowMarker(q3, angle, zone.color, arrowSize - 2);
                arrow2.addTo(map);
                routeLayers.push(arrow2);
            }
        }

        // Origin pulse marker
        const originIcon = L.divIcon({
            className: '',
            html: `<div class="route-origin-marker ${urgency}">
                <div class="route-origin-ring" style="border-color:${zone.color}"></div>
                <div class="route-origin-core" style="background:${zone.color}"></div>
            </div>`,
            iconSize: [24, 24], iconAnchor: [12, 12]
        });
        const originMarker = L.marker(zone.centroid, { icon: originIcon, interactive: false }).addTo(map);

        // Destination highlight ring on PPS
        const destIcon = L.divIcon({
            className: '',
            html: `<div class="route-dest-ring" style="border-color:${zone.color}"></div>`,
            iconSize: [44, 44], iconAnchor: [22, 22]
        });
        const destMarker = L.marker(zone.route[zone.route.length - 1], { icon: destIcon, interactive: false }).addTo(map);

        // Popup on route click
        routeLine.bindPopup(`
            <div class="route-popup">
                <div class="route-popup-title" style="color:${zone.color}">🚨 Evacuation Route — ${zone.name}</div>
                <div class="route-popup-dest">→ <b>${pps.name}</b></div>
                <div class="route-popup-cap">Capacity: ${pps.capacity.toLocaleString()} people</div>
                <div class="route-popup-urgent ${urgency}">
                    ${urgency === 'high' ? '⚠️ EVACUATE NOW! Dangerous flood level!' :
                      urgency === 'moderate' ? '⚡ Prepare to evacuate' :
                      '📢 Monitor situation, stay alert'}
                </div>
            </div>
        `, { maxWidth: 240 });

        routeLayers.push(glowLine, routeLine, originMarker, destMarker);
    });
}

// ---- Flood Visualization (A-F: Complete overhaul) ----
let gridLayer = null;
let contourLayer = null;
let shimmerActive = false;

// (C) Dramatic color ramp: transparent → cyan → indigo → magenta → crimson
function getFloodColor(rainfall, vulnerability) {
    const intensity = Math.min(1.0, (rainfall / 200) * 1.5 * vulnerability);
    if (rainfall === 0 || intensity < 0.03) return null;

    // Smooth HSL interpolation for cinematic gradient
    let h, s, l, opacity;
    if (intensity < 0.15) {
        // Very low: transparent cyan
        h = 195; s = 80; l = 70; opacity = 0.12 + intensity * 1.2;
    } else if (intensity < 0.30) {
        // Low: cyan
        const t = (intensity - 0.15) / 0.15;
        h = 195 - t * 10; s = 85; l = 65 - t * 8; opacity = 0.28 + t * 0.12;
    } else if (intensity < 0.50) {
        // Medium: deep blue / indigo
        const t = (intensity - 0.30) / 0.20;
        h = 225 + t * 15; s = 75 + t * 10; l = 50 - t * 10; opacity = 0.40 + t * 0.15;
    } else if (intensity < 0.70) {
        // High: indigo → magenta
        const t = (intensity - 0.50) / 0.20;
        h = 260 + t * 30; s = 80; l = 42 - t * 5; opacity = 0.55 + t * 0.12;
    } else if (intensity < 0.85) {
        // Very high: magenta → warm red
        const t = (intensity - 0.70) / 0.15;
        h = 330 + t * 20; s = 80 + t * 10; l = 45 - t * 5; opacity = 0.65 + t * 0.10;
    } else {
        // Danger: crimson red
        const t = Math.min(1, (intensity - 0.85) / 0.15);
        h = 0; s = 85 + t * 10; l = 45 - t * 8; opacity = 0.75 + t * 0.12;
    }

    return { fill: `hsl(${h}, ${s}%, ${l}%)`, opacity };
}

// (F) Contour iso-lines at depth thresholds
function buildContourRings(rainfall) {
    if (contourLayer) { map.removeLayer(contourLayer); contourLayer = null; }
    if (rainfall < 30) return;

    const thresholds = [0.25, 0.50, 0.75];
    const contourColors = ['rgba(56,189,248,0.25)', 'rgba(129,140,248,0.35)', 'rgba(236,72,153,0.45)'];
    const contourWeights = [1, 1.2, 1.5];
    const contours = [];

    thresholds.forEach((thresh, ti) => {
        const intensity = thresh;
        // Find cells near the threshold boundary
        cells.forEach(cell => {
            const cellIntensity = Math.min(1.0, (rainfall / 200) * 1.5 * cell.vulnerability);
            const diff = Math.abs(cellIntensity - intensity);
            if (diff < 0.06) {
                // Draw a small ring segment at this cell
                const ring = L.rectangle(
                    [[cell.swLat, cell.swLng], [cell.neLat, cell.neLng]],
                    {
                        color: contourColors[ti],
                        weight: contourWeights[ti],
                        opacity: 0.6,
                        fill: false,
                        dashArray: '3, 4',
                        interactive: false,
                        pane: 'contourPane'
                    }
                );
                contours.push(ring);
            }
        });
    });

    if (contours.length > 0) {
        contourLayer = L.layerGroup(contours).addTo(map);
    }
}

// (E) Shimmer animation via CSS on the flood pane
function toggleShimmer(active) {
    const pane = map.getPane('floodPane');
    if (!pane) return;
    if (active && !shimmerActive) {
        pane.classList.add('flood-shimmer');
        shimmerActive = true;
    } else if (!active && shimmerActive) {
        pane.classList.remove('flood-shimmer');
        shimmerActive = false;
    }
}

function drawFloodGrid(rainfall) {
    if (gridLayer) { map.removeLayer(gridLayer); gridLayer = null; }
    toggleShimmer(false);
    if (rainfall == 0) { buildContourRings(0); return; }

    const layers = cells.map(cell => {
        const style = getFloodColor(rainfall, cell.vulnerability);
        if (!style) return null;
        return L.rectangle(
            [[cell.swLat, cell.swLng], [cell.neLat, cell.neLng]],
            {
                // (A) No visible borders — weight 0
                color: 'transparent', weight: 0,
                fillColor: style.fill, fillOpacity: style.opacity,
                interactive: false,
                pane: 'floodPane'
            }
        );
    }).filter(Boolean);

    gridLayer = L.layerGroup(layers).addTo(map);

    // (E) Activate shimmer
    toggleShimmer(true);

    // (F) Draw contour iso-lines
    buildContourRings(rainfall);
}

// ---- Legend ----
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
        <div class="legend-title">🌊 Flood Level</div>
        <div class="legend-item"><span style="background:#bfdbfe"></span> Very Low</div>
        <div class="legend-item"><span style="background:#60a5fa"></span> Low</div>
        <div class="legend-item"><span style="background:#2563eb"></span> Moderate</div>
        <div class="legend-item"><span style="background:#1e3a8a"></span> High</div>
        <div class="legend-item"><span style="background:#f97316"></span> Very High</div>
        <div class="legend-item"><span style="background:#ef4444"></span> ⚠️ Danger</div>
        <div class="legend-divider"></div>
        <div class="legend-title">🚨 Evacuation Routes</div>
        <div class="legend-item"><span style="background:#7c3aed"></span> North Zone → Dewan MBSA</div>
        <div class="legend-item"><span style="background:#0891b2"></span> East Zone → SK Sri Muda</div>
        <div class="legend-item"><span style="background:#059669"></span> Central Zone → Dewan Azalea</div>
        <div class="legend-item"><span style="background:#d97706"></span> South Zone → SK Sek16</div>
        <div class="legend-item"><span style="background:#be185d"></span> West Zone → SK Sek16</div>
        <div class="legend-note">Routes appear when rainfall &gt; 50mm</div>
    `;
    return div;
};
legend.addTo(map);

// ---- Slider & API ----
const slider        = document.getElementById('rainfall-slider');
const sliderValue   = document.getElementById('rainfall-value');
const rainfallBar   = document.getElementById('rainfall-bar');
const riskLevelSpan = document.getElementById('risk-level');
const riskCard      = document.getElementById('risk-indicator');
const riskIcon      = document.getElementById('risk-icon');
const evacBadge     = document.getElementById('evac-badge');
const checklist     = document.getElementById('checklist');
const API_URL       = 'http://localhost:8000';

const RISK_ICONS = { safe: '🛡️', low: '🌧️', moderate: '⚡', high: '🚨' };

slider.addEventListener('input', function () {
    const val = Number(this.value);
    sliderValue.textContent = val;
    rainfallBar.style.width = (val / 200 * 100) + '%';
    simulateFlood(val);
});

// ---- Live Weather Mode ----
const weatherWidget = document.getElementById('weather-widget');
const wTemp = document.getElementById('weather-temp');
const wCond = document.getElementById('weather-cond');
const wRain = document.getElementById('weather-rain');
const wUpdate = document.getElementById('weather-update');

let liveInterval = null;

document.body.addEventListener('change', function(e) {
    if (e.target.id === 'mode-toggle' || e.target.id === 'mode-toggle-m') {
        const isChecked = e.target.checked;
        
        // Sync both toggles if they exist
        const mainToggle = document.getElementById('mode-toggle');
        const clonedToggle = document.getElementById('mode-toggle-m');
        if (mainToggle) mainToggle.checked = isChecked;
        if (clonedToggle) clonedToggle.checked = isChecked;

        // Update labels for all wrappers
        document.querySelectorAll('.mode-toggle-wrap').forEach(wrap => {
            const sim = wrap.querySelector('#label-sim') || wrap.querySelector('#label-sim-m');
            const liv = wrap.querySelector('#label-live') || wrap.querySelector('#label-live-m');
            if (isChecked) {
                if (sim) sim.classList.remove('active');
                if (liv) liv.classList.add('active');
            } else {
                if (liv) liv.classList.remove('active');
                if (sim) sim.classList.add('active');
            }
        });

        const clonedSlider = document.getElementById('rainfall-slider-m');
        if (isChecked) {
            // Live Mode
            slider.disabled = true; slider.style.opacity = '0.5';
            if (clonedSlider) { clonedSlider.disabled = true; clonedSlider.style.opacity = '0.5'; }
            if (weatherWidget) weatherWidget.style.display = 'block';
            fetchLiveWeather();
            liveInterval = setInterval(fetchLiveWeather, 60000);
        } else {
            // Sim Mode
            slider.disabled = false; slider.style.opacity = '1';
            if (clonedSlider) { clonedSlider.disabled = false; clonedSlider.style.opacity = '1'; }
            if (weatherWidget) weatherWidget.style.display = 'none';
            if (liveInterval) clearInterval(liveInterval);
            simulateFlood(slider.value);
        }
    }
});

async function fetchLiveWeather() {
    try {
        const res = await fetch(`${API_URL}/weather/live`);
        const data = await res.json();
        
        // Update widget
        if (wTemp) wTemp.textContent = `${data.temperature_c}°C`;
        if (wCond) wCond.textContent = data.condition;
        if (wRain) wRain.innerHTML = `${data.rainfall_1h_mm} mm/h`;
        if (wUpdate) wUpdate.textContent = `Updated: ${data.timestamp}`;
        
        // Emulate rain level on UI
        const mm = data.rainfall_1h_mm;
        sliderValue.textContent = mm;
        rainfallBar.style.width = Math.min((mm / 200 * 100), 100) + '%';
        slider.value = mm;
        
        // Trigger simulation
        simulateFlood(mm);
    } catch (e) {
        console.error("Live weather failed", e);
        if (wCond) wCond.textContent = "API Offline";
    }
}

async function simulateFlood(rainfall) {
    try {
        const res = await fetch(`${API_URL}/simulate?rainfall=${rainfall}`);
        const data = await res.json();
        updateRiskIndicator(data.risk_level);
        updateChecklist(data.risk_level);
    } catch (_) {
        // Fallback: determine risk locally if API is unavailable
        let level = 'Safe';
        if (rainfall >= 150) level = 'High';
        else if (rainfall >= 100) level = 'Moderate';
        else if (rainfall >= 50) level = 'Low';
        updateRiskIndicator(level);
        updateChecklist(level);
    }
    drawFloodGrid(Number(rainfall));
    drawEvacuationRoutes(Number(rainfall));

    const existingBanner = document.getElementById('warning-banner');
    if (rainfall >= 150) {
        if (!existingBanner) {
            const banner = document.createElement('div');
            banner.id = 'warning-banner';
            banner.innerHTML = '⚠️ <strong>CRITICAL WARNING:</strong> Evacuate low-lying zones immediately. Follow the glowing routes to your designated PPS.';
            banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#ef4444; color:white; padding:12px 24px; border-radius:8px; z-index:9999; box-shadow:0 4px 12px rgba(239,68,68,0.4); animation: fadeIn 0.3s; font-family:var(--font);';
            document.body.appendChild(banner);
        }
    } else if (existingBanner) {
        existingBanner.remove();
    }

    // Toggle evacuation badge
    if (evacBadge) evacBadge.style.display = rainfall >= 50 ? '' : 'none';
}

function updateRiskIndicator(level) {
    const key = level.toLowerCase();
    riskLevelSpan.textContent = level;
    riskLevelSpan.className = 'risk-value';
    riskCard.setAttribute('data-risk', key);
    riskIcon.textContent = RISK_ICONS[key] || '🛡️';
}

function updateChecklist(level) {
    const items = {
        Safe:     ['Monitor weather updates.', 'Keep emergency kits ready.'],
        Low:      ['Clear drains around your house.', 'Move valuables to higher ground.', 'Stay alert for sirens.'],
        Moderate: ['Park vehicles on high ground.', 'Prepare to evacuate if instructed.', 'Keep phones fully charged.'],
        High:     ['EVACUATE IMMEDIATELY to nearest centre!', 'Turn off main electrical switches.', 'Follow authorities\' instructions.']
    };
    checklist.innerHTML = (items[level] || items.Safe).map(i => `<li>${i}</li>`).join('');
}

simulateFlood(0);

// =============================================
// Mobile Drawer (Bottom Sheet) Logic
// =============================================
(function () {
    const fab        = document.getElementById('mobile-fab');
    const drawer     = document.getElementById('mobile-drawer');
    const overlay    = document.getElementById('mobile-overlay');
    const closeBtn   = document.getElementById('drawer-close-btn');
    const drawerBody = document.getElementById('drawer-content');

    if (!fab || !drawer || !overlay || !drawerBody) return;

    // --- Populate drawer with sidebar content ---
    // We clone the desktop sidebar panels into the drawer so they share IDs
    // and remain live (same DOM nodes, just moved).
    function populateDrawer() {
        if (drawerBody.children.length > 0) return; // already populated
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        // Move children into the drawer
        Array.from(sidebar.children).forEach(child => {
            drawerBody.appendChild(child.cloneNode(true));
        });

        // Re-wire the cloned slider to drive the originals
        const clonedSlider = drawerBody.querySelector('#rainfall-slider');
        if (clonedSlider) {
            // Give cloned elements unique IDs to avoid conflicts
            clonedSlider.id = 'rainfall-slider-m';
            const clonedValue  = drawerBody.querySelector('#rainfall-value');
            const clonedBar    = drawerBody.querySelector('#rainfall-bar');
            const clonedRisk   = drawerBody.querySelector('#risk-indicator');
            const clonedLevel  = drawerBody.querySelector('#risk-level');
            const clonedIcon   = drawerBody.querySelector('#risk-icon');
            const clonedList   = drawerBody.querySelector('#checklist');
            if (clonedValue)  clonedValue.id  = 'rainfall-value-m';
            if (clonedBar)    clonedBar.id    = 'rainfall-bar-m';
            if (clonedRisk)   clonedRisk.id   = 'risk-indicator-m';
            if (clonedLevel)  clonedLevel.id  = 'risk-level-m';
            if (clonedIcon)   clonedIcon.id   = 'risk-icon-m';
            if (clonedList)   clonedList.id   = 'checklist-m';
            
            // Rename toggle IDs so delegation finds them
            const clonedToggle = drawerBody.querySelector('#mode-toggle');
            if (clonedToggle) {
                clonedToggle.id = 'mode-toggle-m';
                const wrap = clonedToggle.closest('.mode-toggle-wrap');
                if (wrap) {
                    const lSim = wrap.querySelector('#label-sim');
                    const lLive = wrap.querySelector('#label-live');
                    if (lSim) lSim.id = 'label-sim-m';
                    if (lLive) lLive.id = 'label-live-m';
                }
                const mainToggle = document.getElementById('mode-toggle');
                if (mainToggle) clonedToggle.checked = mainToggle.checked;
            }

            // Sync cloned slider value with main slider value on open
            clonedSlider.value = slider.value;
            if (clonedValue) clonedValue.textContent = slider.value;
            if (clonedBar)   clonedBar.style.width = (Number(slider.value) / 200 * 100) + '%';

            // Mirror risk state
            const mainRisk = document.getElementById('risk-indicator');
            if (clonedRisk && mainRisk) {
                clonedRisk.setAttribute('data-risk', mainRisk.getAttribute('data-risk') || 'safe');
            }
            if (clonedLevel) clonedLevel.textContent = riskLevelSpan.textContent;
            if (clonedIcon)  clonedIcon.textContent  = riskIcon.textContent;
            if (clonedList)  clonedList.innerHTML     = checklist.innerHTML;

            clonedSlider.addEventListener('input', function () {
                const val = Number(this.value);
                // Update cloned display
                if (clonedValue) clonedValue.textContent = val;
                if (clonedBar)   clonedBar.style.width   = (val / 200 * 100) + '%';
                // Also update the main (hidden) slider so state is consistent
                slider.value = val;
                rainfallBar.style.width = (val / 200 * 100) + '%';
                sliderValue.textContent = val;
                simulateFlood(val);
                // Keep cloned risk in sync (simulateFlood updates originals)
                setTimeout(() => {
                    const mainRisk = document.getElementById('risk-indicator');
                    if (clonedRisk && mainRisk) {
                        clonedRisk.setAttribute('data-risk', mainRisk.getAttribute('data-risk') || 'safe');
                    }
                    if (clonedLevel) clonedLevel.textContent = riskLevelSpan.textContent;
                    if (clonedIcon)  clonedIcon.textContent  = riskIcon.textContent;
                    if (clonedList)  clonedList.innerHTML     = checklist.innerHTML;
                    updateFabLabel(riskLevelSpan.textContent);
                }, 120);
            });
        }
    }

    function updateFabLabel(risk) {
        const label = fab.querySelector('span') || fab;
        // Update aria-label only — visual label stays concise
        fab.setAttribute('aria-label', `Open controls — Risk: ${risk}`);
    }

    // --- Open / Close ---
    function openDrawer() {
        populateDrawer();
        overlay.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        fab.style.opacity = '0';
        fab.style.pointerEvents = 'none';
    }

    function closeDrawer() {
        overlay.classList.remove('active');
        drawer.classList.remove('active');
        document.body.style.overflow = '';
        fab.style.opacity = '1';
        fab.style.pointerEvents = '';
    }

    fab.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // --- Swipe-down to dismiss ---
    let touchStartY = 0;
    let drawerStartTranslate = 0;

    drawer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        drawerStartTranslate = 0;
        drawer.style.transition = 'none';
    }, { passive: true });

    drawer.addEventListener('touchmove', (e) => {
        const dy = e.touches[0].clientY - touchStartY;
        if (dy > 0) {
            drawer.style.transform = `translateY(${dy}px)`;
        }
    }, { passive: true });

    drawer.addEventListener('touchend', (e) => {
        drawer.style.transition = '';
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dy > 100) {
            closeDrawer();
            drawer.style.transform = '';
        } else {
            drawer.style.transform = '';
        }
    });

    // --- Keyboard dismiss ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) closeDrawer();
    });
})();

// =============================================
// Mobile Legend Toggle
// =============================================
(function () {
    const btn  = document.getElementById('mobile-legend-btn');
    const wrap = document.getElementById('mobile-legend-wrap');
    if (!btn || !wrap) return;

    const LEGEND_HTML = `
        <div class="mobile-legend-popup" id="mobile-legend-popup">
            <div class="legend-title">🌊 Flood Level</div>
            <div class="legend-item"><span style="background:#bfdbfe"></span> Very Low</div>
            <div class="legend-item"><span style="background:#60a5fa"></span> Low</div>
            <div class="legend-item"><span style="background:#2563eb"></span> Moderate</div>
            <div class="legend-item"><span style="background:#1e3a8a"></span> High</div>
            <div class="legend-item"><span style="background:#f97316"></span> Very High</div>
            <div class="legend-item"><span style="background:#ef4444"></span> ⚠️ Danger</div>
            <div class="legend-divider"></div>
            <div class="legend-title">🚨 Evacuation Routes</div>
            <div class="legend-item"><span style="background:#7c3aed"></span> North → Dewan MBSA</div>
            <div class="legend-item"><span style="background:#0891b2"></span> East → SK Sri Muda</div>
            <div class="legend-item"><span style="background:#059669"></span> Central → Dewan Azalea</div>
            <div class="legend-item"><span style="background:#d97706"></span> South → SK Sek16</div>
            <div class="legend-item"><span style="background:#be185d"></span> West → SK Sek16</div>
            <div class="legend-note">Routes appear when rainfall &gt; 50mm</div>
        </div>`;

    let open = false;
    let popup = null;

    function openLegend() {
        if (open) return;
        open = true;
        btn.setAttribute('aria-expanded', 'true');
        wrap.insertAdjacentHTML('beforeend', LEGEND_HTML);
        popup = document.getElementById('mobile-legend-popup');
        // Close on outside tap
        setTimeout(() => {
            document.addEventListener('touchstart', outsideTap, { passive: true });
            document.addEventListener('click', outsideTap);
        }, 50);
    }

    function closeLegend() {
        if (!open) return;
        open = false;
        btn.setAttribute('aria-expanded', 'false');
        if (popup) { popup.remove(); popup = null; }
        document.removeEventListener('touchstart', outsideTap);
        document.removeEventListener('click', outsideTap);
    }

    function outsideTap(e) {
        if (!wrap.contains(e.target)) closeLegend();
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        open ? closeLegend() : openLegend();
    });
})();

// =============================================
// SOS Feature (First Responder)
// =============================================
(function () {
    const btnSos = document.getElementById('btn-sos');
    const modalSos = document.getElementById('modal-sos');
    const btnCancel = document.getElementById('btn-cancel-sos');
    const formSos = document.getElementById('form-sos');

    if (!btnSos || !modalSos) return;

    btnSos.addEventListener('click', () => {
        modalSos.style.display = 'flex';
    });

    btnCancel.addEventListener('click', () => {
        modalSos.style.display = 'none';
    });

    modalSos.addEventListener('click', (e) => {
        if (e.target === modalSos) modalSos.style.display = 'none';
    });

    formSos.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('sos_name').value;
        const phone = document.getElementById('sos_phone').value;
        
        // Simulate grabbing GPS coords (Taman Sri Muda area)
        const lat = 3.0300 + (Math.random() * 0.005 - 0.0025);
        const lng = 101.5300 + (Math.random() * 0.005 - 0.0025);

        try {
            const res = await fetch(`${API_URL}/sos`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, phone, lat, lng })
            });
            if(res.ok) {
                alert("🚨 SOS Sent Successfully!\n\nFirst responders have been notified of your location. Please stay safe and try to reach higher ground.");
                modalSos.style.display = 'none';
                formSos.reset();
            } else {
                alert("Failed to send SOS. Please call 999 directly.");
            }
        } catch(err) {
            console.error(err);
            alert("Network error. Your location could not be transmitted. Call 999 immediately.");
        }
    });
})();
