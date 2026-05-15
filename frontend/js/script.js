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
        type: 'primary',
        note: 'Primary Relief Centre - Used during 2021 floods'
    },
    {
        id: 'pps2',
        name: 'SK Taman Sri Muda',
        shortName: 'SK Sri Muda',
        coords: [3.0315, 101.5398],
        capacity: 800,
        type: 'primary',
        note: 'Primary Relief Centre - National School'
    },
    {
        id: 'pps3',
        name: 'Dewan Kenangan MBSA, Seksyen 28',
        shortName: 'Dewan MBSA Sek28',
        coords: [3.0487, 101.5421],
        capacity: 1200,
        type: 'secondary',
        note: 'Secondary Relief Centre - For those unable to reach primary centre'
    },
    {
        id: 'pps4',
        name: 'SK Seksyen 16 Shah Alam',
        shortName: 'SK Seksyen 16',
        coords: [3.0576, 101.5189],
        capacity: 1000,
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
    const marker = L.marker(pps.coords, { icon })
        .addTo(map)
        .bindPopup(`
            <div class="pps-popup">
                <div class="pps-popup-title">${pps.name}</div>
                <div class="pps-popup-tag ${pps.type}">${pps.type === 'primary' ? '🔴 Primary Centre' : '🟡 Secondary Centre'}</div>
                <div class="pps-popup-row">👥 Capacity: <b>${pps.capacity.toLocaleString()} people</b></div>
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
