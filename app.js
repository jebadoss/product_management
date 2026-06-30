// Override fetch to route API requests to the backend server when frontend is hosted separately
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    const API_BASE = window.location.origin.includes('localhost:3000') || window.location.origin.includes('127.0.0.1:3000')
      ? ''
      : 'http://localhost:3000';
    url = API_BASE + url;
  }
  return originalFetch(url, options);
};

// ===================== DATA STORE =====================
let db = {
  employees: [],
  categories: [],
  products: [],
  assignments: [],
  damages: [],
  repairs: [],
  history: [],
};

function saveDb() {
  // DB saving is now handled on PostgreSQL server
}

let editingId = { emp: null, cat: null, prod: null, assign: null };
let isRenamingCategory = false;
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899', '#14B8A6'];
const PAGE_SIZE = 10;
let tableState = {
  employees: 1,
  employeeQuery: '',
  employeeStatus: '',
  employeeJoinFrom: '',
  employeeJoinTo: '',
  categories: 1,
  categoryQuery: '',
  products: 1,
  productQuery: '',
  productStatus: '',
  productCategory: '',
  assigned: 1,
  assignedQuery: '',
  damaged: 1,
  damagedQuery: '',
  damagedStatus: '',
  repair: 1,
  repairQuery: '',
  history: 1,
  historyQuery: ''
};

function getFilteredEmployees() {
  return db.employees.filter(e => {
    const query = tableState.employeeQuery;
    const matchesQuery = !query || [e.code, e.name, e.dept, e.role, e.email, e.blood]
      .some(value => value && value.toLowerCase().includes(query));
    const matchesStatus = !tableState.employeeStatus || e.status === tableState.employeeStatus;
    return matchesQuery && matchesStatus;
  }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

function getFilteredProducts() {
  return db.products.filter(p => {
    const query = tableState.productQuery;
    const matchesQuery = !query || [p.code, p.name, p.cat, p.brand, p.subCat]
      .some(value => value && value.toLowerCase().includes(query));
    const matchesStatus = !tableState.productStatus || p.status === tableState.productStatus;
    const matchesCategory = !tableState.productCategory || p.cat === tableState.productCategory;
    return matchesQuery && matchesStatus && matchesCategory;
  }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

function searchEmployees(q) {
  tableState.employeeQuery = q.trim().toLowerCase();
  renderEmployees(1);
}

function filterEmployeesStatus(value) {
  tableState.employeeStatus = value;
  renderEmployees(1);
}

function searchProducts(q) {
  tableState.productQuery = q.trim().toLowerCase();
  renderProducts(1);
}

function filterProductsStatus(value) {
  tableState.productStatus = value;
  renderProducts(1);
}

function filterProductsCategory(value) {
  tableState.productCategory = value;
  renderProducts(1);
}

// Category name-only search
function searchCategories(q) {
  tableState.categoryQuery = q.trim().toLowerCase();
  renderCategories(1);
}

function clearCatSearch() {
  const el = document.getElementById('cat-search');
  if (el) el.value = '';
  tableState.categoryQuery = '';
  renderCategories(1);
}

// Employee date filter removed

// Assignment search by product name/code/employee/dept
function searchAssignments(q) {
  tableState.assignedQuery = q.trim().toLowerCase();
  renderAssigned(1);
}

function clearAssignSearch() {
  const el = document.getElementById('assign-search');
  if (el) el.value = '';
  tableState.assignedQuery = '';
  renderAssigned(1);
}

// Damage search & filter
function searchDamaged(q) {
  tableState.damagedQuery = q.trim().toLowerCase();
  renderDamaged(1);
}

function filterDamagedByStatus(value) {
  tableState.damagedStatus = value;
  renderDamaged(1);
}

function clearDmgSearch() {
  const el = document.getElementById('dmg-search');
  if (el) el.value = '';
  tableState.damagedQuery = '';
  renderDamaged(1);
}

// Repair search
function searchRepair(q) {
  tableState.repairQuery = q.trim().toLowerCase();
  renderRepair(1);
}

function clearRepairSearch() {
  const el = document.getElementById('repair-search');
  if (el) el.value = '';
  tableState.repairQuery = '';
  renderRepair(1);
}

function renderPagination(key, totalItems, currentPage) {
  const wrapper = document.getElementById(`${key}-pagination`);
  if (!wrapper) return;
  wrapper.innerHTML = '';

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = 'Prev';
  prev.disabled = currentPage <= 1;
  prev.onclick = () => changePage(key, currentPage - 1);
  wrapper.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => changePage(key, i);
    wrapper.appendChild(btn);
  }

  const next = document.createElement('button');
  next.textContent = 'Next';
  next.disabled = currentPage >= totalPages;
  next.onclick = () => changePage(key, currentPage + 1);
  wrapper.appendChild(next);
}

function changePage(key, page) {
  if (page < 1) page = 1;
  if (key === 'employees' || key === 'emp') renderEmployees(page);
  else if (key === 'categories' || key === 'cat') renderCategories(page);
  else if (key === 'products' || key === 'prod') renderProducts(page);
  else if (key === 'assign') renderAssigned(page);
  else if (key === 'damaged') renderDamaged(page);
  else if (key === 'repair') renderRepair(page);
  else if (key === 'hist') renderHistory(tableState.historyQuery, page);
}

function updateTableInfo(infoId, startIndex, endIndex, total) {
  const infoEl = document.getElementById(infoId);
  if (!infoEl) return;
  if (total === 0) {
    infoEl.textContent = 'Showing 0 to 0 of 0 entries';
  } else {
    infoEl.textContent = `Showing ${startIndex} to ${endIndex} of ${total} entries`;
  }
}

// ===================== NAVIGATION =====================
function navigate(page) {
  const submenu = document.getElementById('items-submenu');
  if (page === 'items') {
    if (submenu) {
      submenu.classList.toggle('open');
    }
    return;
  }

  if (submenu) {
    if (page === 'products') {
      submenu.classList.add('open');
    } else {
      submenu.classList.remove('open');
    }
  }

  sessionStorage.setItem('pms_active_page', page);
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  const titles = { 
    dashboard: 'Dashboard', 
    employees: 'Employees', 
    'emp-detail': 'Employee Details',
    'prod-detail': 'Product Details',
    categories: 'Categories', 
    products: 'Products', 
    items: 'Items', 
    assigned: 'Assigned Products', 
    damaged: 'Damage Reports', 
    repair: 'Repair Tracking', 
    history: 'Product History' 
  };
  document.getElementById('page-title').textContent = titles[page] || page;

  // Toggle Categories search box in topbar
  const topbarCatSearch = document.getElementById('topbar-cat-search-wrapper');
  if (topbarCatSearch) {
    if (page === 'categories') {
      topbarCatSearch.style.display = 'block';
    } else {
      topbarCatSearch.style.display = 'none';
    }
  }

  // Clear global search input value and tableState queries when navigating
  tableState.employeeQuery = '';
  tableState.productQuery = '';
  tableState.categoryQuery = '';
  tableState.assignedQuery = '';
  tableState.damagedQuery = '';
  tableState.damagedStatus = '';
  tableState.repairQuery = '';
  tableState.historyQuery = '';

  // Clear local search inputs
  const localInputs = ['emp-search', 'prod-search', 'assign-search', 'dmg-search', 'repair-search', 'hist-search', 'cat-search'];
  localInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Reset damage status filter
  const dmgFilter = document.getElementById('dmg-status-filter');
  if (dmgFilter) dmgFilter.value = '';

  renderPage(page);
}

function viewProductsAll() {
  tableState.productStatus = '';
  const statusFilter = document.querySelector('.filter-select[onchange="filterProductsStatus(this.value)"]');
  if (statusFilter) statusFilter.value = '';
  navigate('products');
}

function viewProductsReplaced() {
  tableState.productStatus = 'Replaced';
  const statusFilter = document.querySelector('.filter-select[onchange="filterProductsStatus(this.value)"]');
  if (statusFilter) statusFilter.value = 'Replaced';
  navigate('products');
}

function viewEmployeesAll() {
  tableState.employeeStatus = '';
  const empFilter = document.querySelector('.filter-select[onchange="filterEmployeesStatus(this.value)"]');
  if (empFilter) empFilter.value = '';
  navigate('employees');
}

document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', () => navigate(el.dataset.page));
});

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  if (page === 'employees') renderEmployees();
  if (page === 'categories') { renderCategories(); }
  if (page === 'products') renderProducts();
  if (page === 'items') renderItems();
  if (page === 'assigned') renderAssigned();
  if (page === 'damaged') renderDamaged();
  if (page === 'repair') renderRepair();
  if (page === 'history') renderHistory();
  updateBadges();
}

// ===================== DASHBOARD =====================
function renderDashboard() {
  const total = db.products.length;
  const assigned = db.products.filter(p => p.status === 'Assigned').length;
  const available = db.products.filter(p => p.status === 'Available').length;
  const damaged = db.products.filter(p => p.status === 'Damaged').length;
  const repair = db.products.filter(p => p.status === 'Repair').length;
  const replaced = db.products.filter(p => p.status === 'Replaced').length;
  const emps = db.employees.length;

  animateCount('stat-total', total);
  animateCount('stat-assigned', assigned);
  animateCount('stat-available', available);
  animateCount('stat-damaged', damaged);
  animateCount('stat-repair', repair);
  animateCount('stat-replaced', replaced);
  animateCount('stat-employees', emps);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  let start = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const interval = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(interval);
  }, 30);
}

// ===================== EMPLOYEES =====================
function renderEmployees(page = tableState.employees) {
  tableState.employees = page;
  const tbody = document.getElementById('emp-table');
  const filtered = getFilteredEmployees();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (!total) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><p>No employees added yet.</p></div></td></tr>';
    updateTableInfo('emp-table-info', 0, 0, 0);
    renderPagination('emp', total, page);
    return;
  }

  tbody.innerHTML = pageItems.map(e =>
    `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="avatar" style="background:${COLORS[e.id % COLORS.length]}">${e.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
          ${e.name}
        </div>
      </td>
      <td>${e.dept}</td>
      <td>${e.role}</td>
      <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${e.code}</code></td>
      <td>${e.email}</td>
      <td><span class="badge badge-${e.status.toLowerCase()}">${e.status}</span></td>
      <td>${e.blood}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn-icon view" title="View" onclick="viewEmployee(${e.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn-icon edit" title="Edit" onclick="editEmployee(${e.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon del" title="Delete" onclick="deleteEmployee(${e.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`
  ).join('');

  updateTableInfo('emp-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('emp', total, page);
}

function viewEmployee(id) {
  const e = db.employees.find(x => x.id === id);
  if (!e) return;
  
  // Filter active assignments (current products)
  const currentProds = db.assignments.filter(a => a.employeeId === id && !a.returnDate);
  
  // Filter all history events associated with this employee's name
  const empHistory = db.history
    .filter(h => h.employee === e.name)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  
  document.getElementById('emp-detail-page-content').innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: start;">
      
      <!-- Left side: Employee details -->
      <div class="card" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
        <div style="display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--border);padding-bottom:16px;">
          <div class="avatar" style="width:64px;height:64px;font-size:22px;font-weight:600;background:${COLORS[e.id % COLORS.length]};display:flex;align-items:center;justify-content:center;color:#fff;border-radius:50%;">${e.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text);">${e.name}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:2px;">${e.role || '—'} · ${e.dept || '—'}</div>
          </div>
        </div>
        
        <div>
          <h4 style="margin-bottom:12px; font-size:15px; color:var(--text); font-weight:600;">Basic Information</h4>
          <div class="detail-grid" style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            <div class="detail-item"><div class="di-label">Employee Code</div><div class="di-value">${e.code}</div></div>
            <div class="detail-item"><div class="di-label">Status</div><div class="di-value"><span class="badge badge-${e.status.toLowerCase()}">${e.status}</span></div></div>
            <div class="detail-item"><div class="di-label">Email</div><div class="di-value">${e.email || '—'}</div></div>
            <div class="detail-item"><div class="di-label">Phone</div><div class="di-value">${e.phone || '—'}</div></div>
            <div class="detail-item"><div class="di-label">Blood Group</div><div class="di-value">${e.blood || '—'}</div></div>
            <div class="detail-item"><div class="di-label">Joining Date</div><div class="di-value">${formatDate(e.joinDate)}</div></div>
            ${e.resignDate ? `<div class="detail-item"><div class="di-label">Resignation Date</div><div class="di-value">${formatDate(e.resignDate)}</div></div>` : ''}
            <div class="detail-item full" style="grid-column:1/-1"><div class="di-label">Address</div><div class="di-value">${e.address || '—'}</div></div>
          </div>
        </div>
      </div>

      <!-- Right side: Current Products and Product History -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Current Products -->
        <div class="card" style="padding: 24px;">
          <h4 style="margin-bottom:16px; font-size:15px; color:var(--text); font-weight:600; border-bottom:1px solid var(--border); padding-bottom:12px;">Current Products (${currentProds.length})</h4>
          ${currentProds.length ? currentProds.map(a => `
            <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:14px; margin-bottom:12px; font-size:13px; display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:var(--text); font-size:14px;">${a.productName}</span>
                <code style="background:var(--border); padding:2px 6px; border-radius:4px; font-size:11px;">${a.productCode}</code>
              </div>
              <div style="color:var(--text-secondary); font-size:12px; margin-top:2px;">
                Assigned since: <strong>${formatDate(a.assignedDate)}</strong>
              </div>
            </div>
          `).join('') : '<p style="font-size:13px;color:var(--text-secondary);text-align:center;padding:20px 0;">No products currently assigned.</p>'}
        </div>

        <!-- Product History -->
        <div class="card" style="padding: 24px;">
          <h4 style="margin-bottom:16px; font-size:15px; color:var(--text); font-weight:600; border-bottom:1px solid var(--border); padding-bottom:12px;">Product History / Usage Log (${empHistory.length})</h4>
          ${empHistory.length ? `
            <div class="table-wrap">
              <table style="width:100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border); text-align:left;">Product</th>
                    <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border); text-align:left;">Action</th>
                    <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border); text-align:left;">Date</th>
                    <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border); text-align:left;">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${empHistory.map(h => {
                    const actColor = { Assigned: 'var(--accent)', Returned: 'var(--success)', Damaged: 'var(--danger)', Repair: 'var(--warning)', Added: 'var(--purple)', Repaired: 'var(--success)', Removed: 'var(--danger)' };
                    return `
                      <tr>
                        <td style="padding:10px 12px; font-size:13px; border-bottom: 1px solid var(--border);">
                          <div style="font-weight:600; color:var(--text);">${h.productName}</div>
                          <code style="font-size:11px; color:var(--text-secondary);">${h.productCode}</code>
                        </td>
                        <td style="padding:10px 12px; font-size:13px; font-weight:600; color:${actColor[h.action] || 'var(--text-secondary)'}; border-bottom: 1px solid var(--border);">${h.action}</td>
                        <td style="padding:10px 12px; font-size:13px; color:var(--text-secondary); border-bottom: 1px solid var(--border);">${formatDate(h.date)}</td>
                        <td style="padding:10px 12px; font-size:13px; color:var(--text-secondary); border-bottom: 1px solid var(--border); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${h.notes || ''}">${h.notes || '—'}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : '<p style="font-size:13px;color:var(--text-secondary);text-align:center;padding:20px 0;">No history records found.</p>'}
        </div>
      </div>

    </div>
  `;
  
  navigate('emp-detail');
}

function openEmployeeModal() {
  editingId.emp = null;
  document.getElementById('emp-modal-title').textContent = 'Add Employee';
  document.getElementById('ef-code').value = '';
  document.getElementById('ef-name').value = '';
  document.getElementById('ef-dept').value = '';
  document.getElementById('ef-role').value = '';
  document.getElementById('ef-email').value = '';
  document.getElementById('ef-phone').value = '';
  document.getElementById('ef-blood').value = '';
  document.getElementById('ef-status').value = 'Active';
  document.getElementById('ef-join').value = '';
  document.getElementById('ef-addr').value = '';
  openModal('emp-modal');
}

function editEmployee(id) {
  const e = db.employees.find(x => x.id === id);
  if (!e) return;
  editingId.emp = id;
  document.getElementById('emp-modal-title').textContent = 'Edit Employee';
  document.getElementById('ef-code').value = e.code;
  document.getElementById('ef-name').value = e.name;
  document.getElementById('ef-dept').value = e.dept;
  document.getElementById('ef-role').value = e.role;
  document.getElementById('ef-email').value = e.email;
  document.getElementById('ef-phone').value = e.phone;
  document.getElementById('ef-blood').value = e.blood;
  document.getElementById('ef-status').value = e.status;
  document.getElementById('ef-join').value = e.joinDate;
  const efResign = document.getElementById('ef-resign');
  if (efResign) {
    efResign.value = e.resignDate;
  }
  document.getElementById('ef-addr').value = e.address;
  openModal('emp-modal');
}

function validateNameRoleDeptInput(input, fieldName) {
  const invalid = /[^a-zA-Z\s]/.test(input.value);
  if (invalid) {
    showToast(`${fieldName} can only contain letters and spaces.`, 'error');
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
  }
}

function saveEmployee() {
  const code = document.getElementById('ef-code').value.trim();
  const name = document.getElementById('ef-name').value.trim();
  const dept = document.getElementById('ef-dept').value.trim();
  const role = document.getElementById('ef-role').value.trim();
  const email = document.getElementById('ef-email').value.trim();
  const status = document.getElementById('ef-status').value;

  if (!code || !name) { showToast('Code and Name are required.', 'error'); return; }

  const charRegex = /^[a-zA-Z\s]+$/;
  if (!charRegex.test(name)) {
    showToast('Full Name must contain only characters.', 'error');
    return;
  }
  if (dept && !charRegex.test(dept)) {
    showToast('Department must contain only characters.', 'error');
    return;
  }
  if (role && !charRegex.test(role)) {
    showToast('Role must contain only characters.', 'error');
    return;
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
  }

  if (!status) {
    showToast('Status is required.', 'error');
    return;
  }

  const phone = document.getElementById('ef-phone').value.trim();
  if (!phone || !/^\d{10}$/.test(phone)) {
    showToast('Phone number must be exactly 10 digits.', 'error');
    return;
  }

  // Resignation Date is auto-set to today if status is Inactive and it wasn't set, or cleared if Active
  let resignDate = '';
  if (status === 'Inactive') {
    let existing = null;
    if (editingId.emp) {
      existing = db.employees.find(x => x.id === editingId.emp);
    }
    resignDate = (existing && existing.resignDate) ? existing.resignDate : today();
  }

  const emp = {
    code, name, dept, role, email,
    phone,
    blood: document.getElementById('ef-blood').value.trim(),
    status,
    joinDate: document.getElementById('ef-join').value,
    resignDate,
    address: document.getElementById('ef-addr').value.trim()
  };

  const url = editingId.emp ? `/api/employees/${editingId.emp}` : '/api/employees';
  const method = editingId.emp ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save employee error');
    return res.json();
  })
  .then(data => {
    reloadWithToast(editingId.emp ? 'Employee updated.' : 'Employee added successfully.', 'success');
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save employee.', 'error');
  });
}

function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  fetch(`/api/employees/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete error');
      reloadWithToast('Employee deleted.', 'success');
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete employee.', 'error');
    });
}

// ===================== CATEGORIES =====================
let selectedCategoryTags = [];

let openedCatFromProduct = false;

function renderCategories(page = tableState.categories) {
  tableState.categories = page;
  const tbody = document.getElementById('cat-table');
  const query = (tableState.categoryQuery || '').trim().toLowerCase();
  let filteredCategories = [...db.categories];
  if (query) {
    filteredCategories = filteredCategories.filter(c => {
      const catName = typeof c === 'string' ? c : c.name;
      return catName.toLowerCase().includes(query);
    });
  }
  const total = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const sortedCategories = filteredCategories.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const pageItems = sortedCategories.slice(start, start + PAGE_SIZE);

  if (!total) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="empty-state"><p>No categories found.</p></div></td></tr>';
    updateTableInfo('cat-table-info', 0, 0, 0);
    renderPagination('cat', total, page);
    return;
  }

  tbody.innerHTML = pageItems.map((cat, i) => {
    const index = start + i;
    const catName = typeof cat === 'string' ? cat : cat.name;
    const catItems = (cat && cat.items) ? cat.items : [];
    const catProducts = db.products.filter(p => p.cat === catName);
    const count = catProducts.length;
    const productNames = catProducts.map(p => p.name).join(', ');

    return `<tr>
      <td>${index + 1}</td>
      <td><span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${COLORS[index % COLORS.length]};display:inline-block"></span>${catName}</span></td>
      <td><strong>${count}</strong> products</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn-icon edit" title="Edit" onclick="editCategory('${catName.replace(/'/g, "\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon del" title="Delete" onclick="deleteCategory('${catName.replace(/'/g, "\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  updateTableInfo('cat-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('cat', total, page);
}

function openCategoryModal() {
  openedCatFromProduct = false;
  editingId.cat = null;
  document.getElementById('cat-modal-title').textContent = 'Add Category';
  document.getElementById('cf-name').value = '';
  openModal('cat-modal');
}

function editCategory(catName) {
  openedCatFromProduct = false;
  editingId.cat = catName;
  document.getElementById('cat-modal-title').textContent = 'Edit Category';
  document.getElementById('cf-name').value = catName;
  openModal('cat-modal');
}

function saveCategory() {
  const name = document.getElementById('cf-name').value.trim();
  if (!name) { showToast('Category name required.', 'error'); return; }

  const existingCat = editingId.cat !== null ? db.categories.find(c => (typeof c === 'string' ? c : c.name) === editingId.cat) : null;
  const items = existingCat ? (existingCat.items || []) : [];
  
  const url = editingId.cat !== null ? `/api/categories/${encodeURIComponent(editingId.cat)}` : '/api/categories';
  const method = editingId.cat !== null ? 'PUT' : 'POST';
  const body = { name, items };

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save category error');
    showToast(editingId.cat !== null ? 'Category updated.' : 'Category added.', 'success');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save category.', 'error');
  });
}

function deleteCategory(catName) {
  if (!confirm('Delete this category?')) return;
  fetch(`/api/categories/${encodeURIComponent(catName)}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete category error');
      showToast('Category deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete category.', 'error');
    });
}

// Stub functions kept to avoid any lingering references from old code
function renderCategoryTags() {}
function handleCategoryTagKeypress() {}
function addCategoryCustomTag() {}
function removeCategoryTag() {}
function updateCategorySuggestions() {}
function addCategorySuggestion() {}
function onCategoryNameInput() {}
function updateCategorySuggestionsList() {}
function selectCategoryNameSuggestion() {}
function setCategoryModalMode() {}
function toggleCategoryMode() {}
function toggleCategorySuggestions() {}

// Ensure populateCategorySelects maps correct category names
function populateCategorySelects() {
  const selectedCat = tableState.productCategory;
  const pfCatEl = document.getElementById('pf-cat');
  if (pfCatEl) {
    const mainCategories = db.categories.map(c => typeof c === 'string' ? c : c.name);
    let html = '<option value="">Select category</option>';
    html += mainCategories.map(c => `<option value="${c}">${c}</option>`).join('');
    pfCatEl.innerHTML = html;
  }

  const catFilterEl = document.getElementById('cat-filter');
  if (catFilterEl) {
    const mainCategories = db.categories.map(c => typeof c === 'string' ? c : c.name);
    let html = '<option value="">All Categories</option>';
    html += mainCategories.map(c => `<option value="${c}">${c}</option>`).join('');
    catFilterEl.innerHTML = html;
    if (selectedCat) {
      catFilterEl.value = selectedCat;
    }
  }
}

// ===================== ITEMS PAGE =====================
let itemsCategoryFilter = '';

function renderItems() {
  const grid = document.getElementById('items-grid');
  if (!grid) return;

  // Populate category filter
  const catFilter = document.getElementById('items-cat-filter');
  if (catFilter) {
    const existingVal = catFilter.value;
    catFilter.innerHTML = '<option value="">All Categories</option>' +
      db.categories.map(c => {
        const name = typeof c === 'string' ? c : c.name;
        return `<option value="${name}">${name}</option>`;
      }).join('');
    catFilter.value = existingVal;
    itemsCategoryFilter = catFilter.value;
  }

  const filterCat = itemsCategoryFilter;
  const categoriesToShow = filterCat
    ? db.categories.filter(c => (typeof c === 'string' ? c : c.name) === filterCat)
    : db.categories;

  if (!categoriesToShow.length) {
    grid.innerHTML = '<div class="empty-state"><p>No categories found.</p></div>';
    return;
  }

  grid.innerHTML = categoriesToShow.map((cat, idx) => {
    const catName = typeof cat === 'string' ? cat : cat.name;
    const catItems = (cat && cat.items && Array.isArray(cat.items)) ? cat.items : [];
    const catColor = COLORS[idx % COLORS.length];
    const isComputer = catName.toLowerCase() === 'computer';
    const isAccessories = catName.toLowerCase() === 'accessories';
    const subCategories = (cat && cat.subCategories) ? cat.subCategories : [];

    // Get products in this category
    const catProducts = db.products.filter(p => p.cat === catName);

    // For Computer category, group by item type (subCat)
    let itemsHtml = '';
    if (isComputer && catItems.length > 0) {
      itemsHtml = catItems.map(item => {
        const itemProducts = db.products.filter(p => p.cat === catName && p.subCat && p.subCat.toLowerCase() === item.toLowerCase());
        const available = itemProducts.filter(p => p.status === 'Available').length;
        const total = itemProducts.reduce((s, p) => s + (p.qty || 0), 0);
        return `
          <div class="item-card" onclick="viewItemProducts('${catName}', '${item}')">
            <div class="item-icon" style="background:${catColor}20; color:${catColor};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div class="item-info">
              <div class="item-name">${item}</div>
              <div class="item-meta">${total} units · ${available} available</div>
            </div>
            <div class="item-count" style="background:${catColor}20; color:${catColor};">${itemProducts.length}</div>
          </div>`;
      }).join('');
    } else if (isAccessories) {
      // Show accessory sub-items and also sub-categories (Laptop, AC, Printer, Chair)
      const accessoryItemsList = catItems.map(item => {
        const itemProducts = db.products.filter(p =>
          (p.cat === 'Accessories' && p.subCat && p.subCat.toLowerCase() === item.toLowerCase()) ||
          (p.cat === item)
        );
        const available = itemProducts.filter(p => p.status === 'Available').length;
        const total = itemProducts.reduce((s, p) => s + (p.qty || 0), 0);
        return `
          <div class="item-card" onclick="viewItemProducts('Accessories', '${item}')">
            <div class="item-icon" style="background:${catColor}20; color:${catColor};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </div>
            <div class="item-info">
              <div class="item-name">${item}</div>
              <div class="item-meta">${total} units · ${available} available</div>
            </div>
            <div class="item-count" style="background:${catColor}20; color:${catColor};">${itemProducts.length}</div>
          </div>`;
      });

      // Show sub-categories (Laptop, AC, Printer, Chair)
      const subCatCards = subCategories.map(sc => {
        const scProducts = db.products.filter(p => p.cat === sc);
        const available = scProducts.filter(p => p.status === 'Available').length;
        const total = scProducts.reduce((s, p) => s + (p.qty || 0), 0);
        return `
          <div class="item-card" onclick="navigate('products'); filterProductsCategory('${sc}'); document.getElementById('cat-filter').value='${sc}';">
            <div class="item-icon" style="background:#8B5CF620; color:#8B5CF6;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div class="item-info">
              <div class="item-name">${sc}</div>
              <div class="item-meta" style="color:#8B5CF6; font-weight:600; font-size:10px;">DEVICE CATEGORY</div>
              <div class="item-meta">${total} units · ${available} available</div>
            </div>
            <div class="item-count" style="background:#8B5CF620; color:#8B5CF6;">${scProducts.length}</div>
          </div>`;
      });

      itemsHtml = [...accessoryItemsList, ...subCatCards].join('');
    } else if (catItems.length > 0) {
      itemsHtml = catItems.map(item => {
        const itemProducts = db.products.filter(p => p.cat === catName && p.subCat && p.subCat.toLowerCase() === item.toLowerCase());
        const available = itemProducts.filter(p => p.status === 'Available').length;
        const total = itemProducts.reduce((s, p) => s + (p.qty || 0), 0);
        return `
          <div class="item-card" onclick="viewItemProducts('${catName}', '${item}')">
            <div class="item-icon" style="background:${catColor}20; color:${catColor};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <div class="item-info">
              <div class="item-name">${item}</div>
              <div class="item-meta">${total} units · ${available} available</div>
            </div>
            <div class="item-count" style="background:${catColor}20; color:${catColor};">${itemProducts.length}</div>
          </div>`;
      }).join('');
    } else {
      // No sub-items, just show the category products count
      const available = catProducts.filter(p => p.status === 'Available').length;
      itemsHtml = `<div style="color:var(--text-secondary); font-size:13px; padding:8px;">No sub-items configured. <strong>${catProducts.length}</strong> product(s) in this category. ${available} available.</div>`;
    }

    const bundleBadge = isComputer ? `<span style="background:var(--accent); color:white; font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; margin-left:8px;">BUNDLE</span>` : '';
    const accBadge = isAccessories ? `<span style="background:#8B5CF6; color:white; font-size:10px; font-weight:700; padding:2px 8px; border-radius:100px; margin-left:8px;">ACCESSORIES</span>` : '';

    return `
      <div class="items-category-card">
        <div class="items-cat-header" style="border-left:4px solid ${catColor};">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="width:10px; height:10px; border-radius:50%; background:${catColor}; display:inline-block;"></span>
            <span style="font-size:15px; font-weight:700; color:var(--text-primary);">${catName}</span>
            ${bundleBadge}${accBadge}
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; color:var(--text-secondary);">${catProducts.length} products</span>
            ${isAccessories ? `<button class="btn btn-primary" style="font-size:11px; padding:4px 10px;" onclick="openAddAccessoryModal()">+ Add Item</button>` : ''}
            ${isComputer ? `<button class="btn btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="navigate('products'); filterProductsCategory('Computer'); document.getElementById('cat-filter').value='Computer';">View All</button>` : ''}
          </div>
        </div>
        <div class="items-list">
          ${itemsHtml || '<div style="color:var(--text-secondary); font-size:13px; padding:8px 0;">No items configured.</div>'}
        </div>
      </div>`;
  }).join('');
}

function filterItemsByCategory(val) {
  itemsCategoryFilter = val;
  renderItems();
}

function viewItemProducts(catName, itemName) {
  navigate('products');
  // Set filters after navigate() (which clears them)
  tableState.productCategory = catName;
  tableState.productQuery = itemName.toLowerCase();
  const catFilter = document.getElementById('cat-filter');
  if (catFilter) catFilter.value = catName;
  const prodSearch = document.getElementById('prod-search');
  if (prodSearch) prodSearch.value = itemName;
  renderProducts();
}

// ===================== ACCESSORIES =====================
function openAddAccessoryModal() {
  document.getElementById('acc-cat').value = 'Accessories';
  document.getElementById('acc-item-type').value = '';
  document.getElementById('acc-name').value = '';
  document.getElementById('acc-brand').value = '';
  document.getElementById('acc-qty').value = '1';
  document.getElementById('acc-date').value = today();
  document.getElementById('acc-status').value = 'Available';
  openModal('accessory-modal');
}

function onAccessoryCategoryChange() {
  // Future use for dynamic item type based on category
}

function saveAccessoryItem() {
  const cat = document.getElementById('acc-cat').value;
  const itemType = document.getElementById('acc-item-type').value;
  const name = document.getElementById('acc-name').value.trim();
  const brand = document.getElementById('acc-brand').value.trim();
  const qty = parseInt(document.getElementById('acc-qty').value) || 1;
  const purchaseDate = document.getElementById('acc-date').value;
  const status = document.getElementById('acc-status').value;

  if (!cat) { showToast('Please select a category.', 'error'); return; }
  if (!itemType) { showToast('Please select an item type.', 'error'); return; }
  if (!name) { showToast('Item name is required.', 'error'); return; }

  const body = { name, cat, itemType, brand, qty, date: purchaseDate || today(), status };

  fetch('/api/accessories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save accessory error');
    closeModal('accessory-modal');
    showToast(`${itemType} "${name}" added successfully!`, 'success');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to add accessory.', 'error');
  });
}

// ===================== PRODUCTS =====================
function renderProducts(page = tableState.products) {
  const tbody = document.getElementById('prod-table');
  const filtered = getFilteredProducts();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  tableState.products = page;
  populateCategorySelects();
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (!total) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><p>No products added yet.</p></div></td></tr>';
    updateTableInfo('prod-table-info', 0, 0, 0);
    renderPagination('prod', total, page);
    return;
  }

  tbody.innerHTML = pageItems.map(p =>
    `<tr>
      <td>${p.cat}</td>
      <td><strong>${p.name}</strong></td>
      <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${p.code}</code></td>
      <td>${formatDate(p.purchaseDate)}</td>
      <td>${statusBadge(p.status)}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn-icon view" onclick="viewProduct(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn-icon edit" onclick="editProduct(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon del" onclick="deleteProduct(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`
  ).join('');

  updateTableInfo('prod-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('prod', total, page);
}

function viewProduct(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  const history = db.history.filter(h => h.productCode === p.code);
  const actionColor = { Assigned: 'var(--accent)', Returned: 'var(--success)', Damaged: 'var(--danger)', Repair: 'var(--warning)', Added: 'var(--purple)', Repaired: 'var(--success)', Removed: 'var(--danger)' };
  
  document.getElementById('prod-detail-page-content').innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: start;">
      
      <!-- Left side: Product details -->
      <div class="card" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
        <div style="display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--border);padding-bottom:16px;">
          <div class="avatar" style="width:64px;height:64px;font-size:22px;font-weight:600;background:var(--accent-light);display:flex;align-items:center;justify-content:center;color:var(--accent);border-radius:50%;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </div>
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text);">${p.name}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:2px;">${p.cat} · ${p.brand || '—'}</div>
          </div>
        </div>
        
        <div>
          <h4 style="margin-bottom:12px; font-size:15px; color:var(--text); font-weight:600;">Product Information</h4>
          <div class="detail-grid" style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            <div class="detail-item"><div class="di-label">Product Code</div><div class="di-value">${p.code}</div></div>
            <div class="detail-item"><div class="di-label">Category</div><div class="di-value">${p.cat}</div></div>
            <div class="detail-item"><div class="di-label">Sub-Category</div><div class="di-value">${p.subCat || '—'}</div></div>
            <div class="detail-item"><div class="di-label">Brand</div><div class="di-value">${p.brand || '—'}</div></div>
            <div class="detail-item"><div class="di-label">Serial Number</div><div class="di-value"><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:12px;">${p.serial || '—'}</code></div></div>
            <div class="detail-item"><div class="di-label">Purchase Date</div><div class="di-value">${formatDate(p.purchaseDate)}</div></div>
            <div class="detail-item"><div class="di-label">Quantity</div><div class="di-value">${p.qty}</div></div>
            <div class="detail-item"><div class="di-label">Status</div><div class="di-value">${statusBadge(p.status)}</div></div>
          </div>
        </div>
      </div>

      <!-- Right side: Assignment History -->
      <div class="card" style="padding: 24px;">
        <h4 style="margin-bottom:16px; font-size:15px; color:var(--text); font-weight:600; border-bottom:1px solid var(--border); padding-bottom:12px;">Assignment History (${history.length})</h4>
        ${history.length ? `
          <div class="table-wrap">
            <table style="width:100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border);">Action</th>
                  <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border);">Employee</th>
                  <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border);">Date</th>
                  <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border);">Return Date</th>
                  <th style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary); background:var(--bg); padding:10px 12px; font-weight:700; border-bottom: 2px solid var(--border);">Notes</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(h => `
                  <tr>
                    <td style="padding:10px 12px; font-size:13px; font-weight:600; color:${actionColor[h.action] || 'var(--text-secondary)'}; border-bottom: 1px solid var(--border);">${h.action}</td>
                    <td style="padding:10px 12px; font-size:13px; border-bottom: 1px solid var(--border);">${h.employee}</td>
                    <td style="padding:10px 12px; font-size:13px; color:var(--text-secondary); border-bottom: 1px solid var(--border);">${formatDate(h.date)}</td>
                    <td style="padding:10px 12px; font-size:13px; color:var(--text-secondary); border-bottom: 1px solid var(--border);">${(h.action === 'Repaired' || h.action === 'Returned') && h.returnDate ? formatDateTime(h.returnDate) : (h.returnDate ? formatDate(h.returnDate) : '<span style="color:var(--text-secondary);font-size:11px">—</span>')}</td>
                    <td style="padding:10px 12px; font-size:13px; color:var(--text-secondary); border-bottom: 1px solid var(--border); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${h.notes || ''}">${h.notes || '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p style="font-size:13px;color:var(--text-secondary);text-align:center;padding:20px 0;">No history records found.</p>'}
      </div>

    </div>
  `;
  
  navigate('prod-detail');
}

let selectedProductTags = [];

function addProductTag(value) {
  if (!value) return;
  if (!selectedProductTags.includes(value)) {
    selectedProductTags.push(value);
    const select = document.getElementById('pf-select-item');
    if (select) select.value = '';
    renderProductTags();
    populateProductTagsSelect();
  }
}



function removeProductTag(value) {
  selectedProductTags = selectedProductTags.filter(item => item !== value);
  renderProductTags();
  populateProductTagsSelect();
}

function renderProductTags() {
  const list = document.getElementById('pf-tags-list');
  if (!list) return;

  list.innerHTML = selectedProductTags.map(item => `
    <span class="tag-badge" style="background:var(--accent-light); color:var(--accent); border:1px solid rgba(59, 130, 246, 0.2); padding:4px 10px; border-radius:100px; display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; margin:2px 0;">
      ${item}
      <span class="tag-remove" style="color:var(--text-secondary); font-weight:bold; font-size:12px; cursor:pointer;" onclick="removeProductTag('${item.replace(/'/g, "\\'")}')">&times;</span>
    </span>
  `).join('');
}

function populateProductTagsSelect() {
  const select = document.getElementById('pf-select-item');
  if (!select) return;
  
  const catVal = document.getElementById('pf-cat').value;
  if (!catVal) {
    select.innerHTML = '<option value="">Select pre-configured item...</option>';
    return;
  }

  // Find the category configured items
  const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name).toLowerCase() === catVal.toLowerCase());
  const configuredItems = (catObj && catObj.items) ? catObj.items : [];

  // Filter out already selected items
  const availableItems = configuredItems.filter(item => !selectedProductTags.includes(item));

  let html = '<option value="">Select pre-configured item...</option>';
  html += availableItems.map(item => `<option value="${item}">${item}</option>`).join('');
  select.innerHTML = html;
}

function onProductCategoryChange() {
  const cat = document.getElementById('pf-cat').value;
  const pfQty = document.getElementById('pf-qty');
  const pfCode = document.getElementById('pf-code');

  // Restore defaults
  if (pfCode) {
    pfCode.readOnly = false;
  }

  // Reset qty on every category change
  if (pfQty) {
    pfQty.value = '';
    pfQty.readOnly = false;
  }

  if (cat) {
    // Auto-fill quantity = 1 by default (user can edit it)
    if (pfQty && editingId.prod === null) {
      pfQty.value = 1;
    }

    // Auto-assign code and make readOnly for Chair
    if (cat === 'Chair') {
      if (pfCode && editingId.prod === null) {
        pfCode.value = 'PRD' + String(db.nextId.prod).padStart(3, '0');
        pfCode.readOnly = true;
      }
    } else {
      if (pfCode && editingId.prod === null && pfCode.value.startsWith('PRD') && pfCode.readOnly) {
        pfCode.value = '';
      }
    }
  }
}

function editProduct(id) {
  const p = db.products.find(x => x.id === id);
  editingId.prod = id;
  document.getElementById('prod-modal-title').textContent = 'Edit Product';
  populateCategorySelects();
  const pfCode = document.getElementById('pf-code');
  if (pfCode) {
    pfCode.value = p.code || '';
    pfCode.readOnly = false;
  }
  document.getElementById('pf-name').value = p.name || '';
  document.getElementById('pf-cat').value = p.cat || '';
  
  onProductCategoryChange();

  const pfBrand = document.getElementById('pf-brand');
  if (pfBrand) {
    pfBrand.value = p.brand || '';
  }
  document.getElementById('pf-date').value = p.purchaseDate || '';
  const pfQty = document.getElementById('pf-qty');
  if (pfQty) {
    pfQty.value = p.qty || '';
  }
  
  const statusSel = document.getElementById('pf-status');
  if (statusSel) {
    statusSel.innerHTML = `
      <option value="">Select status</option>
      <option value="Available">Available</option>
      <option value="Assigned">Assigned</option>
      <option value="Damaged">Damaged</option>
      <option value="Repair">Under Repair</option>
      <option value="Replaced">Replaced</option>
    `;
    statusSel.value = p.status || '';
  }
  openModal('prod-modal');
}

function openProductModal() {
  editingId.prod = null;
  document.getElementById('prod-modal-title').textContent = 'Add Product';
  populateCategorySelects();
  const pfCode = document.getElementById('pf-code');
  if (pfCode) {
    pfCode.value = '';
    pfCode.readOnly = false;
  }
  document.getElementById('pf-name').value = '';
  document.getElementById('pf-cat').value = '';
  
  const pfBrand = document.getElementById('pf-brand');
  if (pfBrand) {
    pfBrand.value = '';
  }
  document.getElementById('pf-date').value = '';
  const pfQty = document.getElementById('pf-qty');
  if (pfQty) {
    pfQty.value = '';
  }
  
  const statusSel = document.getElementById('pf-status');
  if (statusSel) {
    statusSel.innerHTML = '<option value="Available">Available</option>';
    statusSel.value = 'Available';
  }

  openModal('prod-modal');
}

function saveProduct() {
  const code = document.getElementById('pf-code').value.trim();
  const name = document.getElementById('pf-name').value.trim();
  if (!code || !name) { showToast('Code and Name are required.', 'error'); return; }
  
  const cat = document.getElementById('pf-cat').value;
  if (!cat) { showToast('Category is required.', 'error'); return; }
  
  let existing = null;
  if (editingId.prod) {
    existing = db.products.find(x => x.id === editingId.prod);
  }

  const pfBrand = document.getElementById('pf-brand');
  const pfQty = document.getElementById('pf-qty');
  const pfStatus = document.getElementById('pf-status');

  const prod = {
    code,
    name,
    cat,
    subCat: existing ? (existing.subCat || '') : '',
    brand: pfBrand ? pfBrand.value.trim() : (existing ? (existing.brand || '') : ''),
    serial: existing ? (existing.serial || '') : '',
    purchaseDate: document.getElementById('pf-date').value,
    qty: pfQty ? (parseInt(pfQty.value) || 1) : (existing ? (existing.qty || 1) : 1),
    status: pfStatus ? (pfStatus.value || 'Available') : (existing ? (existing.status || 'Available') : 'Available')
  };

  const url = editingId.prod ? `/api/products/${editingId.prod}` : '/api/products';
  const method = editingId.prod ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prod)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save product error');
    reloadWithToast(editingId.prod ? 'Product updated.' : 'Product added successfully.', 'success');
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save product.', 'error');
  });
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  fetch(`/api/products/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete product error');
      reloadWithToast('Product deleted.', 'success');
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete product.', 'error');
    });
}

let selectedAssignProducts = [];

function suggestEmployees(query) {
  const container = document.getElementById('af-emp-suggestions');
  const hiddenInput = document.getElementById('af-emp');
  if (!container) return;

  const activeEmployeeIdsWithProducts = db.assignments
    .filter(a => !a.returnDate)
    .map(a => a.employeeId);

  let filtered = [];
  if (!query.trim()) {
    filtered = db.employees.filter(e =>
      e.status === 'Active' &&
      !activeEmployeeIdsWithProducts.includes(e.id)
    );
  } else {
    filtered = db.employees.filter(e =>
      e.status === 'Active' &&
      e.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="autocomplete-suggestion" style="color:var(--text-secondary);cursor:default;">No active employees found</div>';
    container.style.display = 'block';
    if (!query.trim()) {
      hiddenInput.value = '';
    }
    return;
  }

  container.innerHTML = filtered.map(e => `
    <div class="autocomplete-suggestion" onclick="selectEmployeeSuggestion(${e.id}, '${e.name.replace(/'/g, "\\'")}', '${e.code}')">
      <strong>${e.name}</strong> (${e.code}) - <span style="font-size:11px;color:var(--text-secondary);">${e.dept}</span>
    </div>
  `).join('');
  container.style.display = 'block';
}

function toggleEmployeeSuggestions() {
  const container = document.getElementById('af-emp-suggestions');
  if (!container) return;
  if (container.style.display === 'block') {
    container.innerHTML = '';
    container.style.display = 'none';
  } else {
    suggestEmployees(document.getElementById('af-emp-search').value);
  }
}

function selectEmployeeSuggestion(id, name, code) {
  const searchInput = document.getElementById('af-emp-search');
  const hiddenInput = document.getElementById('af-emp');
  const container = document.getElementById('af-emp-suggestions');

  if (searchInput && hiddenInput) {
    searchInput.value = `${name} (${code})`;
    hiddenInput.value = id;
  }
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
}

function onAssignCategoryChange() {
  const category = document.getElementById('af-cat').value;
  const typeGroup = document.getElementById('af-prod-type-group');
  const typeSelect = document.getElementById('af-prod-type');
  const selectedProdIdInput = document.getElementById('af-selected-prod-id');
  const prodCodeDisplay = document.getElementById('af-prod-code-display');
  const unitsInput = document.getElementById('af-units');

  // Keep selected products intact when changing categories to allow multi-category assignments

  if (selectedProdIdInput) selectedProdIdInput.value = '';
  if (prodCodeDisplay) prodCodeDisplay.value = '';
  if (unitsInput) unitsInput.value = '0';

  if (!category) {
    if (typeGroup) typeGroup.style.display = 'none';
    if (typeSelect) typeSelect.innerHTML = '<option value="">All Types</option>';
    const prodSelect = document.getElementById('af-prod-select');
    if (prodSelect) prodSelect.innerHTML = '<option value="">Select Product</option>';
    return;
  }

  // Check if category has sub-items/types configured
  const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name) === category);
  const items = (catObj && catObj.items && Array.isArray(catObj.items)) ? catObj.items : [];

  if (items.length > 0) {
    if (typeGroup) typeGroup.style.display = 'block';
    if (typeSelect) {
      let typeHtml = '<option value="">All Types</option>';
      typeHtml += items.map(item => `<option value="${item}">${item}</option>`).join('');
      typeSelect.innerHTML = typeHtml;
      typeSelect.value = '';
    }
  } else {
    if (typeGroup) typeGroup.style.display = 'none';
    if (typeSelect) {
      typeSelect.innerHTML = '<option value="">All Types</option>';
      typeSelect.value = '';
    }
  }

  // Refresh products list for the category (initially with no type filter)
  onAssignTypeChange();
}

function onAssignTypeChange() {
  const category = document.getElementById('af-cat').value;
  const type = document.getElementById('af-prod-type').value;
  const prodSelect = document.getElementById('af-prod-select');

  if (!prodSelect) return;

  if (!category) {
    prodSelect.innerHTML = '<option value="">Select Product</option>';
    return;
  }

  // Get products of this category that are Available OR belong to the current assignment being edited
  const currentAssign = editingId.assign ? db.assignments.find(x => x.id === editingId.assign) : null;
  const currentProdIds = currentAssign ? (currentAssign.productIds || [currentAssign.productId]) : [];

  let products = db.products.filter(p => 
    p.cat.toLowerCase() === category.toLowerCase() && 
    (p.status === 'Available' || currentProdIds.includes(p.id))
  );

  // Filter out products that are already selected in the tags list
  const selectedIds = selectedAssignProducts.map(p => p.id);
  products = products.filter(p => !selectedIds.includes(p.id));

  // Filter by selected Type if provided
  if (type) {
    products = products.filter(p => {
      const matchesSubCat = p.subCat && p.subCat.toLowerCase() === type.toLowerCase();
      const matchesName = p.name && p.name.toLowerCase().includes(type.toLowerCase());
      return matchesSubCat || matchesName;
    });
  }

  if (products.length === 0) {
    prodSelect.innerHTML = `<option value="">No available ${type || 'products'} in this category</option>`;
    return;
  }

  let html = '<option value="">Select Product</option>';
  html += products.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');
  prodSelect.innerHTML = html;
  prodSelect.value = ''; // Always keep placeholder selected
}

function onAssignProductSelectChange() {
  const prodSelect = document.getElementById('af-prod-select');
  if (!prodSelect) return;

  const prodId = parseInt(prodSelect.value);
  if (!prodId || isNaN(prodId)) return;

  const prod = db.products.find(p => p.id === prodId);
  if (prod) {
    // Avoid duplicates
    if (!selectedAssignProducts.some(p => p.id === prod.id)) {
      selectedAssignProducts.push(prod);
      renderAssignProductTags();
      updateAssignTotals();
      // Refresh list so this selected product is removed from options
      onAssignTypeChange();
    }
  }
}

function renderAssignProductTags() {
  const list = document.getElementById('af-prod-tags-list');
  if (!list) return;

  list.innerHTML = selectedAssignProducts.map(p => `
    <span class="tag-badge" style="background:var(--accent-light); color:var(--accent); border:1px solid rgba(59, 130, 246, 0.2); padding:4px 10px; border-radius:100px; display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; margin:2px 0;">
      ${p.name}
      <span class="tag-remove" style="color:var(--text-secondary); font-weight:bold; font-size:12px; cursor:pointer;" onclick="removeAssignProductTag(${p.id})">&times;</span>
    </span>
  `).join('');
}

function removeAssignProductTag(prodId) {
  selectedAssignProducts = selectedAssignProducts.filter(p => p.id !== prodId);
  renderAssignProductTags();
  updateAssignTotals();
  // Refresh options to bring back the removed product
  onAssignTypeChange();
}

function updateAssignTotals() {
  const selectedProdIdInput = document.getElementById('af-selected-prod-id');
  const prodCodeDisplay = document.getElementById('af-prod-code-display');
  const unitsInput = document.getElementById('af-units');

  if (selectedProdIdInput) {
    selectedProdIdInput.value = selectedAssignProducts.length > 0 ? selectedAssignProducts[0].id : '';
  }
  if (prodCodeDisplay) {
    const uniqueCodesList = [...new Set(selectedAssignProducts.map(p => p.code))];
    prodCodeDisplay.value = uniqueCodesList.join(', ');
  }
  if (unitsInput) {
    unitsInput.value = selectedAssignProducts.length;
  }
}

function clearAssignEmployee() {
  document.getElementById('af-emp-search').value = '';
  document.getElementById('af-emp').value = '';
  const sug = document.getElementById('af-emp-suggestions');
  if (sug) {
    sug.innerHTML = '';
    sug.style.display = 'none';
  }
}

function clearAssignProduct() {
  selectedAssignProducts = [];
  renderAssignProductTags();
  updateAssignTotals();
  onAssignTypeChange();
}

function currentDateTime() {
  const now = new Date();
  return now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatAssignmentReturnDate(d) {
  if (!d) return '<span style="color:var(--text-secondary);font-size:11px">Active</span>';
  if (d.includes(',') || d.includes('AM') || d.includes('PM')) {
    return d;
  }
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderAssigned(page = tableState.assigned) {
  tableState.assigned = page;
  const tbody = document.getElementById('assign-table');
  const query = (tableState.assignedQuery || '').trim().toLowerCase();
  let filtered = [...db.assignments];
  if (query) {
    filtered = filtered.filter(a => 
      [a.productName, a.productCode, a.employeeName, a.dept].some(val => (val || '').toLowerCase().includes(query))
    );
  }
  filtered.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (!total) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><p>No assignments yet.</p></div></td></tr>';
    updateTableInfo('assign-table-info', 0, 0, 0);
    renderPagination('assign', total, page);
    return;
  }

  tbody.innerHTML = pageItems.map(a => {
    const isReturned = !!a.returnDate;
    return `<tr>
      <td><strong>${a.productName}</strong></td>
      <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${a.productCode}</code></td>
      <td><div style="display:flex;align-items:center;gap:8px;">
        <div class="avatar" style="width:24px;height:24px;font-size:10px;background:${COLORS[a.employeeId % COLORS.length]}">${a.employeeName[0]}</div>${a.employeeName}
      </div></td>
      <td>${a.dept}</td>
      <td>${formatDate(a.assignedDate)}</td>
      <td>${formatAssignmentReturnDate(a.returnDate)}</td>
      <td>
        <div style="display:flex; gap:4px; align-items:center;">
          ${isReturned
          ? `<span class="badge badge-available" style="padding:4px 8px; font-size:10px; font-weight:700;">Returned</span>`
          : `<button class="btn btn-secondary" style="font-size:11px;padding:4px 10px;" onclick="returnProduct(${a.id})">Return</button>
             <button class="btn-icon edit" title="Edit" onclick="editAssignment(${a.id})">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
             </button>`
          }
          <button class="btn-icon del" title="Delete" style="margin-left:4px;" onclick="deleteAssignment(${a.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  updateTableInfo('assign-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('assign', total, page);
}

function openAssignModal() {
  editingId.assign = null;
  document.getElementById('assign-modal-title').textContent = 'Assign Product';
  const footerBtn = document.querySelector('#assign-modal .modal-footer .btn-primary');
  if (footerBtn) footerBtn.textContent = 'Add';

  selectedAssignProducts = []; // Clear selected products state
  // Clear autocomplete fields
  document.getElementById('af-emp-search').value = '';
  document.getElementById('af-emp').value = '';
  const sug = document.getElementById('af-emp-suggestions');
  if (sug) {
    sug.innerHTML = '';
    sug.style.display = 'none';
  }

  // Populate Categories
  const catSel = document.getElementById('af-cat');
  catSel.innerHTML = '<option value="">Select Category</option>' + db.categories.map(c => {
    const name = typeof c === 'string' ? c : c.name;
    return `<option value="${name}">${name}</option>`;
  }).join('');

  onAssignCategoryChange();

  document.getElementById('af-date').value = today();
  openModal('assign-modal');
}

function editAssignment(id) {
  const a = db.assignments.find(x => x.id === id);
  if (!a) return;

  editingId.assign = id;
  document.getElementById('assign-modal-title').textContent = 'Edit Assignment';

  // Populate Employee
  const emp = db.employees.find(e => e.id === a.employeeId);
  if (emp) {
    document.getElementById('af-emp-search').value = `${emp.name} (${emp.code})`;
    document.getElementById('af-emp').value = emp.id;
  }

  // Populate Categories
  const catSel = document.getElementById('af-cat');
  catSel.innerHTML = '<option value="">Select Category</option>' + db.categories.map(c => {
    const name = typeof c === 'string' ? c : c.name;
    return `<option value="${name}">${name}</option>`;
  }).join('');
  
  const firstProdId = a.productIds ? a.productIds[0] : a.productId;
  const firstProd = db.products.find(p => p.id === firstProdId);
  const category = firstProd ? firstProd.cat : '';
  catSel.value = category;

  // Initialize selected products
  selectedAssignProducts = [];
  const productIds = a.productIds || (a.productId ? [a.productId] : []);
  productIds.forEach(pId => {
    const prod = db.products.find(p => p.id === pId);
    if (prod) {
      selectedAssignProducts.push(prod);
    }
  });

  renderAssignProductTags();
  updateAssignTotals();

  // Populate Type selection group
  const typeGroup = document.getElementById('af-prod-type-group');
  const typeSelect = document.getElementById('af-prod-type');
  const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name) === category);
  const items = (catObj && catObj.items && Array.isArray(catObj.items)) ? catObj.items : [];

  if (items.length > 0) {
    if (typeGroup) typeGroup.style.display = 'block';
    if (typeSelect) {
      let typeHtml = '<option value="">All Types</option>';
      typeHtml += items.map(item => `<option value="${item}">${item}</option>`).join('');
      typeSelect.innerHTML = typeHtml;
      typeSelect.value = '';
    }
  } else {
    if (typeGroup) typeGroup.style.display = 'none';
    if (typeSelect) {
      typeSelect.innerHTML = '<option value="">All Types</option>';
      typeSelect.value = '';
    }
  }

  onAssignTypeChange();

  document.getElementById('af-date').value = a.assignedDate;
  
  const footerBtn = document.querySelector('#assign-modal .modal-footer .btn-primary');
  if (footerBtn) footerBtn.textContent = 'Save';

  openModal('assign-modal');
}

function saveAssignment() {
  const empId = parseInt(document.getElementById('af-emp').value);
  if (!empId) { showToast('Please search and select an employee from suggestions.', 'error'); return; }
  const emp = db.employees.find(e => e.id === empId);
  if (!emp) { showToast('Selected employee not found.', 'error'); return; }

  const category = document.getElementById('af-cat').value;
  if (!category) { showToast('Select a category.', 'error'); return; }

  if (selectedAssignProducts.length === 0) { showToast('Please select at least one product.', 'error'); return; }

  const assignedDate = document.getElementById('af-date').value || today();
  
  const prodIds = selectedAssignProducts.map(p => p.id);
  const prodNames = selectedAssignProducts.map(p => p.name).join(', ');
  const uniqueCodesList = [...new Set(selectedAssignProducts.map(p => p.code))];
  const prodCodes = uniqueCodesList.join(', ');

  const body = {
    employeeId: empId,
    employeeName: emp.name,
    dept: emp.dept,
    category,
    productIds: prodIds,
    productNames: prodNames,
    productCodes: prodCodes,
    assignedDate
  };

  const url = editingId.assign ? `/api/assignments/${editingId.assign}` : '/api/assignments';
  const method = editingId.assign ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save assignment error');
    const msg = editingId.assign 
      ? 'Assignment updated successfully!' 
      : `${emp.name} assigned successfully`;
    reloadWithToast(msg, 'success');
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save assignment.', 'error');
  });
}

function returnProduct(id) {
  const a = db.assignments.find(x => x.id === id);
  if (!a) return;
  if (!confirm(`Mark "${a.productName}" as returned?`)) return;

  fetch(`/api/assignments/${id}/return`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ returnDate: currentDateTime() })
  })
  .then(res => {
    if (!res.ok) throw new Error('API return error');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to return products.', 'error');
  });
}

function deleteAssignment(id) {
  if (!confirm('Remove this assignment record?')) return;
  fetch(`/api/assignments/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete assignment error');
      showToast('Assignment removed.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete assignment.', 'error');
    });
}




// ===================== DAMAGE =====================
function renderDamaged(page = tableState.damaged) {
  tableState.damaged = page;
  const el = document.getElementById('damage-list');
  const query = (tableState.damagedQuery || '').trim().toLowerCase();
  let sorted = [...db.damages];
  if (query) {
    sorted = sorted.filter(d => [d.productName, d.productCode, d.by, d.notes].some(val => val.toLowerCase().includes(query)));
  }
  sorted.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  if (!total) {
    el.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No damage reports.</p></div>';
    updateTableInfo('damaged-table-info', 0, 0, 0);
    renderPagination('damaged', total, page);
    return;
  }
  el.innerHTML = pageItems.map(d =>
    `<div class="repair-card">
      <div class="repair-card-header">
        <div>
          <strong>${d.productName}</strong>
          <code style="margin-left:8px;background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${d.productCode}</code>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${statusBadge(d.status || 'Damaged')}
          <button class="btn-icon del" onclick="deleteDamage(${d.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
      <div class="repair-card-meta">
        <div class="repair-meta-item"><div class="rm-label">Reported By</div><div class="rm-value">${d.by}</div></div>
        <div class="repair-meta-item"><div class="rm-label">Date</div><div class="rm-value">${formatDate(d.date)}</div></div>
        <div class="repair-meta-item"><div class="rm-label">Notes</div><div class="rm-value">${d.notes}</div></div>
      </div>
    </div>`
  ).join('');

  updateTableInfo('damaged-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('damaged', total, page);
}

function saveDamage() {
  const prodIdVal = document.getElementById('df-prod').value;
  const prodId = parseInt(prodIdVal);
  if (!prodIdVal || isNaN(prodId)) { showToast('Please select a product.', 'error'); return; }
  
  const status = document.getElementById('df-action').value;
  if (!status) { showToast('Please select an action.', 'error'); return; }

  const by = document.getElementById('df-by').value.trim();
  if (!by) { showToast('Please enter reporter name.', 'error'); return; }

  const body = {
    productId: prodId,
    status,
    date: document.getElementById('df-date').value || today(),
    by,
    notes: document.getElementById('df-notes').value.trim()
  };

  fetch('/api/damages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save damage error');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save damage report.', 'error');
  });
}

function deleteDamage(id) {
  if (!confirm('Delete this damage report?')) return;
  fetch(`/api/damages/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete damage error');
      showToast('Report deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete report.', 'error');
    });
}

function openDmgModal(defaultAction = '') {
  document.getElementById('df-prod').value = '';
  document.getElementById('df-prod-search').value = '';
  document.getElementById('df-prod-suggestions').style.display = 'none';
  document.getElementById('df-by').value = '';
  document.getElementById('df-notes').value = '';
  document.getElementById('df-date').value = today();
  
  const actionEl = document.getElementById('df-action');
  if (actionEl) {
    actionEl.value = (typeof defaultAction === 'string') ? defaultAction : '';
  }
  openModal('dmg-modal');
}

// Autocomplete suggestions for Damage Products
function suggestDamageProducts(query) {
  const container = document.getElementById('df-prod-suggestions');
  if (!container) return;

  const q = query.trim().toLowerCase();
  
  // Show available products only, and filter by query if provided
  const availableProds = db.products.filter(p => p.status === 'Available');
  const filtered = q
    ? availableProds.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    : availableProds;

  if (filtered.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="autocomplete-suggestion" onclick="selectDamageProduct(${p.id}, '${p.name.replace(/'/g, "\\'")} (${p.code})')">
      ${p.name} <strong>(${p.code})</strong>
    </div>
  `).join('');
  container.style.display = 'flex';
}

function selectDamageProduct(id, label) {
  document.getElementById('df-prod').value = id;
  document.getElementById('df-prod-search').value = label;
  document.getElementById('df-prod-suggestions').style.display = 'none';
}

function clearDamageProduct() {
  document.getElementById('df-prod').value = '';
  document.getElementById('df-prod-search').value = '';
  document.getElementById('df-prod-suggestions').style.display = 'none';
}

function toggleDamageProductSuggestions() {
  const container = document.getElementById('df-prod-suggestions');
  if (!container) return;
  if (container.style.display === 'flex') {
    container.style.display = 'none';
  } else {
    suggestDamageProducts(document.getElementById('df-prod-search').value);
  }
}

function clearDamageReportedBy() {
  document.getElementById('df-by').value = '';
}

// ===================== REPAIR =====================
function renderRepair(page = tableState.repair) {
  tableState.repair = page;
  const el = document.getElementById('repair-list');
  const query = (tableState.repairQuery || '').trim().toLowerCase();
  let sorted = [...db.repairs];
  if (query) {
    sorted = sorted.filter(r => [r.productName, r.productCode, r.center, r.contact, r.takenBy, r.notes].some(val => val.toLowerCase().includes(query)));
  }
  sorted.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  if (!total) {
    el.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg><p>No repair records.</p></div>';
    updateTableInfo('repair-table-info', 0, 0, 0);
    renderPagination('repair', total, page);
    return;
  }
  el.innerHTML = pageItems.map(r =>
    `<div class="repair-card">
      <div class="repair-card-header">
        <div>
          <strong>${r.productName}</strong>
          <code style="margin-left:8px;background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${r.productCode}</code>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge badge-${r.status === 'Completed' ? 'completed' : r.status === 'In Progress' ? 'assigned' : 'pending'}">${r.status}</span>
          ${r.status !== 'Completed' ? `<button class="btn btn-success" style="font-size:11px;padding:4px 10px;" onclick="completeRepair(${r.id})">Mark Done</button>` : ''}
          <button class="btn-icon del" onclick="deleteRepair(${r.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
      <div class="repair-card-meta">
        <div class="repair-meta-item"><div class="rm-label">Repair Center</div><div class="rm-value">${r.center}</div></div>
        <div class="repair-meta-item"><div class="rm-label">Contact</div><div class="rm-value">${r.contact}</div></div>
        <div class="repair-meta-item"><div class="rm-label">Taken By</div><div class="rm-value">${r.takenBy}</div></div>
        <div class="repair-meta-item"><div class="rm-label">Date Sent</div><div class="rm-value">${formatDate(r.dateSent)}</div></div>
        ${r.status === 'Completed' ? `<div class="repair-meta-item"><div class="rm-label">Return Date</div><div class="rm-value">${formatDateTime(r.completedDate)}</div></div>` : ''}
        <div class="repair-meta-item"><div class="rm-label">Notes</div><div class="rm-value">${r.notes}</div></div>
      </div>
    </div>`
  ).join('');

  updateTableInfo('repair-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('repair', total, page);
}

function saveRepair() {
  const prodIdVal = document.getElementById('rf-prod').value;
  const prodId = parseInt(prodIdVal);
  if (!prodIdVal || isNaN(prodId)) { showToast('Please select a product.', 'error'); return; }

  const status = document.getElementById('rf-status').value;
  if (!status) { showToast('Please select a status.', 'error'); return; }

  const center = document.getElementById('rf-center').value.trim();
  const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;
  if (center && !alphanumericRegex.test(center)) {
    showToast('Repair Center can only contain letters, numbers, and spaces.', 'error');
    return;
  }

  const contact = document.getElementById('rf-contact').value.trim();
  if (!contact || !/^\d{10}$/.test(contact)) {
    showToast('Contact number must be exactly 10 digits.', 'error');
    return;
  }

  const takenBy = document.getElementById('rf-taken').value.trim();
  const charRegex = /^[a-zA-Z\s]*$/;
  if (takenBy && !charRegex.test(takenBy)) {
    showToast('Taken By Person can only contain letters and spaces.', 'error');
    return;
  }

  const body = {
    productId: prodId,
    center,
    contact,
    takenBy,
    dateSent: document.getElementById('rf-sent').value || today(),
    status,
    notes: document.getElementById('rf-notes').value.trim()
  };

  fetch('/api/repairs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save repair error');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save repair record.', 'error');
  });
}

function deleteRepair(id) {
  if (!confirm('Delete this repair record?')) return;
  fetch(`/api/repairs/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete repair error');
      showToast('Record deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete record.', 'error');
    });
}

function completeRepair(id) {
  if (!confirm('Mark this repair as completed?')) return;
  fetch(`/api/repairs/${id}/complete`, { method: 'PUT' })
    .then(res => {
      if (!res.ok) throw new Error('API complete repair error');
      showToast('Repair completed, returned to inventory.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to complete repair.', 'error');
    });
}

function openRepairModal() {
  document.getElementById('rf-prod').value = '';
  document.getElementById('rf-prod-search').value = '';
  document.getElementById('rf-prod-suggestions').style.display = 'none';
  document.getElementById('rf-center').value = '';
  document.getElementById('rf-contact').value = '';
  document.getElementById('rf-taken').value = '';
  document.getElementById('rf-status').value = '';
  document.getElementById('rf-notes').value = '';
  document.getElementById('rf-sent').value = today();
  openModal('repair-modal');
}

// Clear Employee modal helper
function clearEmpField(id) {
  const el = document.getElementById(id);
  if (el) el.value = '';
}

// Autocomplete suggestions for Repair Products
function suggestRepairProducts(query) {
  const container = document.getElementById('rf-prod-suggestions');
  if (!container) return;

  const q = query.trim().toLowerCase();
  
  // Show available products only, and filter by query if provided
  const availableProds = db.products.filter(p => p.status === 'Available');
  const filtered = q
    ? availableProds.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    : availableProds;

  if (filtered.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="autocomplete-suggestion" onclick="selectRepairProduct(${p.id}, '${p.name.replace(/'/g, "\\'")} (${p.code})')">
      ${p.name} <strong>(${p.code})</strong>
    </div>
  `).join('');
  container.style.display = 'flex';
}

function selectRepairProduct(id, label) {
  document.getElementById('rf-prod').value = id;
  document.getElementById('rf-prod-search').value = label;
  document.getElementById('rf-prod-suggestions').style.display = 'none';
}

function clearRepairProduct() {
  document.getElementById('rf-prod').value = '';
  document.getElementById('rf-prod-search').value = '';
  document.getElementById('rf-prod-suggestions').style.display = 'none';
}

function toggleRepairProductSuggestions() {
  const container = document.getElementById('rf-prod-suggestions');
  if (!container) return;
  if (container.style.display === 'flex') {
    container.style.display = 'none';
  } else {
    suggestRepairProducts(document.getElementById('rf-prod-search').value);
  }
}

function clearRepairField(id) {
  const el = document.getElementById(id);
  if (el) el.value = '';
}

function validateAlphanumericInput(input, fieldName) {
  const invalid = /[^a-zA-Z0-9\s]/.test(input.value);
  if (invalid) {
    showToast(`${fieldName} can only contain letters, numbers, and spaces.`, 'error');
    input.value = input.value.replace(/[^a-zA-Z0-9\s]/g, '');
  }
}

// ===================== HISTORY =====================
function renderHistory(query = tableState.historyQuery, page = tableState.history) {
  tableState.historyQuery = query;
  tableState.history = page;
  const tbody = document.getElementById('history-table');
  const filtered = query 
    ? db.history.filter(h => h.productCode.toLowerCase().includes(query.toLowerCase()) || h.productName.toLowerCase().includes(query.toLowerCase())).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)) 
    : [...db.history].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (!total) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><p>No history records found.</p></div></td></tr>';
    updateTableInfo('hist-table-info', 0, 0, 0);
    renderPagination('hist', total, page);
    return;
  }

  const actionColor = { Assigned: 'var(--accent)', Returned: 'var(--success)', Damaged: 'var(--danger)', Repair: 'var(--warning)', Added: 'var(--purple)', Repaired: 'var(--success)', Removed: 'var(--danger)' };
  tbody.innerHTML = pageItems.map(h =>
    `<tr>
      <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${h.productCode}</code></td>
      <td>${h.productName}</td>
      <td><span style="color:${actionColor[h.action] || 'var(--text-secondary)'};font-weight:600;font-size:12px;">${h.action}</span></td>
      <td>${h.employee}</td>
      <td>${formatDate(h.date)}</td>
      <td>${(h.action === 'Repaired' || h.action === 'Returned') && h.returnDate ? formatDateTime(h.returnDate) : (h.returnDate ? formatDate(h.returnDate) : '<span style="color:var(--text-secondary);font-size:11px">—</span>')}</td>
      <td style="color:var(--text-secondary)">${h.notes}</td>
    </tr>`
  ).join('');

  updateTableInfo('hist-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('hist', total, page);
}

function searchHistory(q) { renderHistory(q, 1); }

// ===================== GLOBAL SEARCH =====================
function handleGlobalSearch(q) {
  const query = q.trim().toLowerCase();
  
  // Find current active page ID
  const activePageEl = document.querySelector('.page.active');
  const activePageId = activePageEl ? activePageEl.id.replace('page-', '') : 'dashboard';

  switch (activePageId) {
    case 'employees':
      const empSearchInput = document.getElementById('emp-search');
      if (empSearchInput) empSearchInput.value = q;
      tableState.employeeQuery = query;
      renderEmployees(1);
      break;
    case 'products':
      const prodSearchInput = document.getElementById('prod-search');
      if (prodSearchInput) prodSearchInput.value = q;
      tableState.productQuery = query;
      renderProducts(1);
      break;
    case 'categories':
      tableState.categoryQuery = query;
      renderCategories(1);
      break;
    case 'assigned':
      const assignSearchInput = document.getElementById('assign-search');
      if (assignSearchInput) assignSearchInput.value = q;
      tableState.assignedQuery = query;
      renderAssigned(1);
      break;
    case 'damaged':
      tableState.damagedQuery = query;
      renderDamaged(1);
      break;
    case 'repair':
      tableState.repairQuery = query;
      renderRepair(1);
      break;
    case 'history':
      const histSearchInput = document.getElementById('hist-search');
      if (histSearchInput) histSearchInput.value = q;
      tableState.historyQuery = query;
      renderHistory(query, 1);
      break;
    default:
      if (query) {
        const results = [
          ...db.products.filter(p => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)),
          ...db.employees.filter(e => e.name.toLowerCase().includes(query) || e.code.toLowerCase().includes(query))
        ];
        if (results.length) {
          showToast(`Found ${results.length} result(s) for "${q}"`, 'success');
        }
      }
      break;
  }
}

function clearSearch(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.value = '';
  switch (id) {
    case 'global-search': handleGlobalSearch(''); break;
    case 'emp-search': searchEmployees(''); break;
    case 'prod-search': searchProducts(''); break;
    case 'assign-search': clearAssignSearch(); break;
    case 'hist-search': searchHistory(''); break;
    default: break;
  }
}

// ===================== HELPERS =====================
function statusBadge(status) {
  const map = { Available: 'available', Assigned: 'assigned', Damaged: 'damaged', Repair: 'repair', Replaced: 'replaced' };
  const cls = map[status] || 'inactive';
  return `<span class="badge badge-${cls}">${status === 'Repair' ? 'Under Repair' : status}</span>`;
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '—';
  return dt.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function filterTable(tableId, query, colIndices) {
  const tbody = document.getElementById(tableId);
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const text = (Array.isArray(colIndices) ? colIndices : [colIndices])
      .map(i => cells[i] ? cells[i].textContent : '').join(' ').toLowerCase();
    row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
  });
}

function filterByStatus(tableId, value, colIndex) {
  const tbody = document.getElementById(tableId);
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const cell = row.querySelectorAll('td')[colIndex];
    const text = cell ? cell.textContent.trim() : '';
    row.style.display = (!value || text.includes(value)) ? '' : 'none';
  });
}

function updateBadges() {
  document.getElementById('nav-emp-count').textContent = db.employees.length;
  document.getElementById('nav-prod-count').textContent = db.products.length;
  document.getElementById('nav-dmg-count').textContent = db.damages.length;
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});

function showToast(msg, type = '') {
  const wrap = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> ${msg}`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function reloadWithToast(msg, type = 'success') {
  sessionStorage.setItem('pending_toast', JSON.stringify({ msg, type }));
  window.location.reload();
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pms-export.json';
  a.click();
  showToast('Data exported as JSON.', 'success');
}

function exportPDF() {
  window.print();
}

// ===================== INIT =====================
async function initApp() {
  try {
    const res = await fetch('/api/db');
    if (!res.ok) throw new Error('API server error');
    db = await res.json();
  } catch (err) {
    console.error('Failed to load database from PostgreSQL API, falling back to local storage', err);
    const savedDb = localStorage.getItem('pms_db');
    if (savedDb) {
      try {
        db = JSON.parse(savedDb);
      } catch (e) {
        console.error('Error loading saved database', e);
      }
    }
  }

  console.log('PMS Database Loaded:', db);

  const pendingToast = sessionStorage.getItem('pending_toast');
  if (pendingToast) {
    try {
      const { msg, type } = JSON.parse(pendingToast);
      showToast(msg, type);
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem('pending_toast');
  }

  populateCategorySelects();
  const savedPage = sessionStorage.getItem('pms_active_page') || 'dashboard';
  let startPage = savedPage;
  if (savedPage === 'emp-detail') startPage = 'employees';
  else if (savedPage === 'prod-detail') startPage = 'products';
  navigate(startPage);
}
initApp();

document.addEventListener('click', function (e) {
  // Category Name suggestions close on click outside
  const catNameWrapper = document.getElementById('cf-name-wrapper');
  const catNameSug = document.getElementById('cf-name-suggestions');
  if (catNameWrapper && !catNameWrapper.contains(e.target) && catNameSug) {
    catNameSug.style.display = 'none';
  }

  const empWrapper = document.getElementById('af-emp-wrapper');
  const suggestions = document.getElementById('af-emp-suggestions');
  if (empWrapper && !empWrapper.contains(e.target) && suggestions) {
    suggestions.style.display = 'none';
  }

  // (Assign product suggestions click-outside checks removed because it uses a standard select dropdown)

  // Damage product suggestions close on click outside
  const dmgProdWrapper = document.getElementById('df-prod-wrapper');
  const dmgProdSug = document.getElementById('df-prod-suggestions');
  if (dmgProdWrapper && !dmgProdWrapper.contains(e.target) && dmgProdSug) {
    dmgProdSug.style.display = 'none';
  }

  // Repair product suggestions close on click outside
  const repairProdWrapper = document.getElementById('rf-prod-wrapper');
  const repairProdSug = document.getElementById('rf-prod-suggestions');
  if (repairProdWrapper && !repairProdWrapper.contains(e.target) && repairProdSug) {
    repairProdSug.style.display = 'none';
  }
});

