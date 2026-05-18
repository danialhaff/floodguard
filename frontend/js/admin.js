const API_BASE = "http://localhost:8000";

// --- Authentication Check ---
if (!sessionStorage.getItem('admin_token')) {
    window.location.href = 'login.html';
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileSidebar();
    initNavigation();
    loadDashboardData();
    initCRUD();
});

// --- Mobile Sidebar Toggle ---
function initMobileSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-btn');

    if (!hamburger || !sidebar || !overlay) return;

    function openSidebar() {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('is-open');
        isOpen ? closeSidebar() : openSidebar();
    });

    // Close sidebar when tapping overlay
    overlay.addEventListener('click', closeSidebar);

    // Expose for use in nav clicks
    window._closeMobileSidebar = closeSidebar;
}

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

            // Close mobile sidebar after navigation
            if (window._closeMobileSidebar) window._closeMobileSidebar();
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
        console.warn(`Backend offline for ${endpoint}, using Mock Data for GitHub Pages...`);
        
        // MOCK DATA FALLBACK
        if (endpoint === '/admin/stats') return { zones: 5, pps: 4, history: 5, system_status: "Operational (Mock Mode)" };
        if (endpoint === '/admin/zones') return [
            { id: 1, zone_name: "North Zone", elevation_m: 12.5 },
            { id: 2, zone_name: "East Zone", elevation_m: 10.2 },
            { id: 3, zone_name: "Central Zone", elevation_m: 8.7 },
            { id: 4, zone_name: "South Zone", elevation_m: 9.1 },
            { id: 5, zone_name: "West Zone", elevation_m: 11.3 }
        ];
        if (endpoint === '/admin/pps') return [
            { id: 1, name: "Dewan Azalea Seksyen 25", capacity: 500 },
            { id: 2, name: "SK Taman Sri Muda", capacity: 800 },
            { id: 3, name: "Dewan MBSA Seksyen 28", capacity: 1200 },
            { id: 4, name: "SK Seksyen 16", capacity: 1000 }
        ];
        if (endpoint === '/historical-data') return [
            { date: "2021-12-17", rainfall_mm: 198.5, impact_description: "Major flood — entire TSM inundated" },
            { date: "2021-12-18", rainfall_mm: 145.2, impact_description: "Continued flooding" },
            { date: "2022-03-06", rainfall_mm: 92.0, impact_description: "Moderate flood" }
        ];
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

    // Cancel modal button
    const cancelBtn = document.getElementById('btn-cancel-modal');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modalPPS.style.display = 'none';
        });
    }

    // Close modal on overlay click
    modalPPS.addEventListener('click', (e) => {
        if (e.target === modalPPS) modalPPS.style.display = 'none';
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
                showToast('Evacuation center added successfully!', 'success');
            } else {
                showToast('Failed to add evacuation center.', 'error');
            }
        } catch(err) { 
            console.error(err); 
            showToast('Network error occurred.', 'error');
        }
    });
}

// Global delete function called from inline onclick
window.deletePPS = async function(id) {
    if(confirm('Are you sure you want to delete this PPS?')) {
        try {
            const res = await fetch(`${API_BASE}/admin/pps/${id}`, { method: 'DELETE' });
            if (res.ok) {
                loadPPSData();
                loadDashboardData();
                showToast('Evacuation center removed.', 'success');
            } else {
                showToast('Failed to delete center.', 'error');
            }
        } catch(err) { 
            console.error(err); 
            showToast('Network error occurred.', 'error');
        }
    }
}

// --- Toast Notification System ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const iconSvg = type === 'success' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
