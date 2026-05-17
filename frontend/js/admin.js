const API_BASE = "http://localhost:8000";

// --- Authentication Check ---
if (!sessionStorage.getItem('admin_token')) {
    window.location.href = 'login.html';
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    loadDashboardData();
    initCRUD();
});

// --- Navigation Logic ---
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const views = document.querySelectorAll('.admin-view');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state on nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch views
            const target = item.getAttribute('data-target');
            views.forEach(view => view.classList.remove('active-view'));
            document.getElementById(`view-${target}`).classList.add('active-view');

            // Update title
            pageTitle.textContent = item.textContent.trim();

            // Load specific data based on view
            if (target === 'dashboard') loadDashboardData();
            if (target === 'zones') loadZonesData();
            if (target === 'pps') loadPPSData();
            if (target === 'history') loadHistoryData();
        });
    });
}

// --- Data Fetching ---

async function fetchAPI(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`Fetch error for ${endpoint}:`, error);
        return null;
    }
}

async function loadDashboardData() {
    const data = await fetchAPI('/admin/stats');
    if (data) {
        document.getElementById('stat-zones').textContent = data.zones || 0;
        document.getElementById('stat-pps').textContent = data.pps || 0;
        document.getElementById('stat-history').textContent = data.history || 0;
    }
}

async function loadZonesData() {
    const tbody = document.getElementById('table-zones');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Loading data...</td></tr>';
    
    const data = await fetchAPI('/admin/zones');
    if (!data) return tbody.innerHTML = '<tr><td colspan="4" class="text-center">Error loading data</td></tr>';
    if (data.length === 0) return tbody.innerHTML = '<tr><td colspan="4" class="text-center">No zones found</td></tr>';

    tbody.innerHTML = data.map(z => `
        <tr>
            <td>#${z.id}</td>
            <td><strong>${z.zone_name}</strong></td>
            <td>${z.elevation_m !== null ? z.elevation_m.toFixed(2) + 'm' : 'N/A'}</td>
            <td><span class="badge">Monitored</span></td>
        </tr>
    `).join('');
}

async function loadPPSData() {
    const tbody = document.getElementById('table-pps');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading data...</td></tr>';
    
    const data = await fetchAPI('/admin/pps');
    if (!data) return tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading data</td></tr>';
    if (data.length === 0) return tbody.innerHTML = '<tr><td colspan="5" class="text-center">No PPS found</td></tr>';

    tbody.innerHTML = data.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.capacity} pax</td>
            <td><span class="badge">Active</span></td>
            <td><button class="btn-danger" onclick="deletePPS(${p.id})">Delete</button></td>
        </tr>
    `).join('');
}

async function loadHistoryData() {
    const tbody = document.getElementById('table-history');
    tbody.innerHTML = '<tr><td colspan="3" class="text-center">Loading data...</td></tr>';
    
    const data = await fetchAPI('/historical-data');
    if (!data) return tbody.innerHTML = '<tr><td colspan="3" class="text-center">Error loading data</td></tr>';
    if (data.length === 0) return tbody.innerHTML = '<tr><td colspan="3" class="text-center">No history found</td></tr>';

    tbody.innerHTML = data.map(h => `
        <tr>
            <td><strong>${h.date}</strong></td>
            <td>${h.rainfall_mm} mm</td>
            <td>${h.impact_description}</td>
        </tr>
    `).join('');
}

// --- CRUD Operations ---
function initCRUD() {
    // Logout
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    });

    // Modals
    const modalPPS = document.getElementById('modal-pps');
    document.getElementById('btn-add-pps').addEventListener('click', () => {
        modalPPS.style.display = 'flex';
    });

    // Add PPS
    document.getElementById('form-add-pps').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('pps_name').value,
            capacity: parseInt(document.getElementById('pps_capacity').value),
            lat: parseFloat(document.getElementById('pps_lat').value),
            lng: parseFloat(document.getElementById('pps_lng').value)
        };

        try {
            const res = await fetch(`${API_BASE}/admin/pps`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            if(res.ok) {
                modalPPS.style.display = 'none';
                e.target.reset();
                loadPPSData();
                loadDashboardData();
            }
        } catch(err) { console.error(err); }
    });
}

// Global delete function called from inline onclick
window.deletePPS = async function(id) {
    if(confirm('Are you sure you want to delete this PPS?')) {
        try {
            await fetch(`${API_BASE}/admin/pps/${id}`, { method: 'DELETE' });
            loadPPSData();
            loadDashboardData();
        } catch(err) { console.error(err); }
    }
}
