const API_BASE = 'http://localhost:8000';
let map;
let sosLayer;
let ppsLayer;
let sosMarkers = {};

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

    // Dark map style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    sosLayer = L.layerGroup().addTo(map);
    ppsLayer = L.layerGroup().addTo(map);
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
            const marker = L.circleMarker([pps.lat, pps.lng], {
                radius: 8, fillColor: color, color: '#fff', weight: 1, fillOpacity: 0.8
            }).bindPopup(`<b>${pps.name}</b><br>Occupancy: ${pax}/${cap}`);
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
