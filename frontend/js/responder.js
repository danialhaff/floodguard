const API_BASE = 'http://localhost:8000';
let map;
let sosLayer;
let ppsLayer;
let sosMarkers = {};

// ACTUAL OSM boundary of Taman Sri Muda
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

const EVAC_ZONES = [
    { name: 'North Zone', color: '#7c3aed', centroid: [3.0375, 101.5340] },
    { name: 'East Zone', color: '#0891b2', centroid: [3.0308, 101.5450] },
    { name: 'Central Zone', color: '#059669', centroid: [3.0310, 101.5360] },
    { name: 'South Zone', color: '#d97706', centroid: [3.0230, 101.5370] },
    { name: 'West Zone', color: '#be185d', centroid: [3.0290, 101.5265] }
];


document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    // Refresh data every 10 seconds
    setInterval(loadData, 10000);
});

function initMap() {
    map = L.map('responder-map', {
        zoomControl: false,
        attributionControl: false
    }).setView([3.0300, 101.5300], 14);

    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Basemap Layers (Default: Google Maps Standard Green/Roadmap)
    const googleStandard = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
    }).addTo(map);

    const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
    });

    const esriDark = L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 1,
            maxNativeZoom: 16,
            maxZoom: 20,
            attribution: 'Tiles &copy; Esri'
        }),
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 1,
            maxNativeZoom: 16,
            maxZoom: 20
        })
    ]);

    L.control.layers({
        "🗺️ Google Maps (Standard)": googleStandard,
        "🛰️ Google Satellite": googleSatellite,
        "🌙 Dark Mode": esriDark
    }, null, { position: 'topright' }).addTo(map);

    sosLayer = L.layerGroup().addTo(map);
    ppsLayer = L.layerGroup().addTo(map);

    drawMapBoundaries();
}

function drawMapBoundaries() {
    // 1. TSM Boundary Outline
    L.polygon(TSM_BOUNDARY, {
        color: '#818cf8',
        weight: 2,
        dashArray: '5, 8',
        fillColor: 'transparent',
        interactive: false
    }).addTo(map);

    // 2. Zone Labels
    EVAC_ZONES.forEach(zone => {
        const markerHtml = `
            <div style="
                background: rgba(15, 23, 42, 0.8);
                border: 2px solid ${zone.color};
                color: ${zone.color};
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 700;
                white-space: nowrap;
                backdrop-filter: blur(4px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                transform: translate(-50%, -50%);
            ">${zone.name}</div>
        `;
        const icon = L.divIcon({
            className: 'custom-zone-label',
            html: markerHtml,
            iconSize: [0,0]
        });
        L.marker(zone.centroid, { icon, interactive: false }).addTo(map);
    });
}

async function loadData() {
    await Promise.all([loadSOS(), loadPPS()]);
}

async function loadSOS() {
    try {
        const res = await fetch(`${API_BASE}/admin/sos`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        renderSOS(data);
    } catch (e) {
        console.warn('Backend offline, using mock SOS data');
        const mockData = [
            { id: 101, name: "Siti Nurhaliza", phone: "012-3456789", status: "Pending", timestamp: new Date().toISOString(), lat: 3.0280, lng: 101.5280 },
            { id: 102, name: "Ali Bin Abu", phone: "019-8765432", status: "Dispatched", timestamp: new Date(Date.now() - 3600000).toISOString(), lat: 3.0320, lng: 101.5350 }
        ];
        renderSOS(mockData);
    }
}

async function loadPPS() {
    try {
        const res = await fetch(`${API_BASE}/admin/pps`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        renderPPS(data);
    } catch (e) {
        console.warn('Backend offline, using mock PPS data');
        const mockPPS = [
            { id: 1, name: "Dewan Azalea", capacity: 1000, current_pax: 850, lat: 3.025, lng: 101.530 },
            { id: 2, name: "SK Sri Muda", capacity: 800, current_pax: 200, lat: 3.035, lng: 101.532 }
        ];
        renderPPS(mockPPS);
    }
}

function renderSOS(sosList) {
    const container = document.getElementById('sos-list');
    container.innerHTML = '';
    sosLayer.clearLayers();
    sosMarkers = {};

    let pending = 0;
    let dispatched = 0;

    if (sosList.length === 0) {
        container.innerHTML = '<div class="loading-state">No active SOS requests</div>';
    }

    sosList.forEach(sos => {
        if (sos.status === 'Pending') pending++;
        else dispatched++;

        // Add to list
        const card = document.createElement('div');
        card.className = `sos-card ${sos.status === 'Dispatched' ? 'dispatched' : ''}`;
        
        let date = new Date(sos.timestamp);
        let timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        card.innerHTML = `
            <div class="sos-header">
                <div>
                    <div class="sos-name">${sos.name}</div>
                    <div class="sos-phone">📞 ${sos.phone}</div>
                    <div class="sos-coord" style="color: #94a3b8; font-size: 0.8rem; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${sos.lat.toFixed(5)}, ${sos.lng.toFixed(5)}
                    </div>
                </div>
                <div class="sos-time">${timeStr}</div>
            </div>
            ${sos.status === 'Pending' 
                ? `<button class="btn-dispatch" onclick="dispatchRescue(${sos.id})">Dispatch Unit</button>`
                : `<div class="badge-dispatched">✓ Dispatched</div>`
            }
        `;
        container.appendChild(card);

        // Add to map
        if (sos.status === 'Pending' && sos.lat && sos.lng) {
            const icon = L.divIcon({ className: 'sos-marker', iconSize: [16,16] });
            const marker = L.marker([sos.lat, sos.lng], {icon}).bindPopup(`<b>${sos.name}</b><br>${sos.phone}`);
            sosLayer.addLayer(marker);
            sosMarkers[sos.id] = marker;
        }
    });

    document.getElementById('sos-pending-count').textContent = pending;
    document.getElementById('sos-resolved-count').textContent = dispatched;
}

function renderPPS(ppsList) {
    const container = document.getElementById('pps-list');
    container.innerHTML = '';
    ppsLayer.clearLayers();

    ppsList.forEach(pps => {
        const pax = pps.current_pax || 0;
        const cap = pps.capacity || 1;
        const pct = Math.min((pax / cap) * 100, 100);
        let color = '#38bdf8';
        if (pct > 80) color = '#ef4444';
        else if (pct > 50) color = '#f59e0b';

        // Add to list
        const card = document.createElement('div');
        card.className = 'pps-card';
        card.innerHTML = `
            <div class="pps-name">${pps.name}</div>
            <div class="pax-bar-bg">
                <div class="pax-bar-fill" style="width: ${pct}%; background: ${color}"></div>
            </div>
            <div class="pax-text">
                <span>${pax} / ${cap} Pax</span>
                <span>${Math.round(pct)}%</span>
            </div>
        `;
        container.appendChild(card);

        // Add to map
        if (pps.lat && pps.lng) {
            const type = pps.name.includes('SK') ? 'secondary' : 'primary';
            const iconEmoji = type === 'primary' ? '🏥' : '🏫';
            const icon = L.divIcon({
                className: '',
                html: `<div class="pps-marker ${type}"><span>${iconEmoji}</span></div>`,
                iconSize: [38, 38], iconAnchor: [19, 19]
            });
            const marker = L.marker([pps.lat, pps.lng], { icon })
                .bindPopup(`
                    <div class="pps-popup">
                        <div class="pps-popup-title" style="font-weight: 700; color: #f8fafc; margin-bottom: 4px;">${pps.name}</div>
                        <div style="font-size: 0.85rem; color: #94a3b8;">Occupancy: ${pax} / ${cap} Pax</div>
                    </div>
                `);
            ppsLayer.addLayer(marker);
        }
    });
}

async function dispatchRescue(id) {
    try {
        const res = await fetch(`${API_BASE}/admin/sos/${id}/status`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: 'Dispatched' })
        });
        
        if (res.ok) {
            showToast('Rescue unit dispatched successfully!', 'success');
            loadData();
        } else {
            showToast('Failed to update status', 'error');
        }
    } catch(err) {
        showToast('Network error (Mocking success)', 'success');
        // Mock success for UI demo
        setTimeout(() => loadData(), 500);
    }
}

function showToast(msg, type='info') {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
        t.style.animation = 'slideIn 0.3s ease-out reverse forwards';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}
