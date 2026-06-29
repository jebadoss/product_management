const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Storage Seeding & Loading Block (Lines 12 to 180 approximately)
const loadTarget = `const savedDb = localStorage.getItem('pms_db');
if (savedDb) {
  try {
    db = JSON.parse(savedDb);
  } catch (e) {
    console.error('Error loading saved database', e);
  }
}

// Force seed dummy data ONCE using a persistent flag in localStorage for testing
if (!localStorage.getItem('pms_data_seeded_v3')) {
  db = {
    categories: [
      { name: "Computer", items: ["Mouse", "CPU", "Keyboard", "Monitor"], updatedAt: Date.now() - 5000 },
      { name: "Accessories", items: ["Webcam", "Headset", "USB Hub", "Speaker"], updatedAt: Date.now() - 4000 },
      { name: "Furniture", items: ["Chair", "Desk"], updatedAt: Date.now() - 3000 }
    ],
    employees: [
      {
        id: 1,
        code: "EMP001",
        name: "Jeba Doss",
        dept: "Engineering",
        role: "Developer",
        email: "jeba.doss@example.com",
        phone: "9876543210",
        blood: "O+",
        status: "Active",
        joinDate: "2025-01-15",
        resignDate: "",
        address: "Chennai, Tamil Nadu",
        updatedAt: Date.now() - 5000
      },
      {
        id: 2,
        code: "EMP002",
        name: "Ravi Kumar",
        dept: "Design",
        role: "UI Designer",
        email: "ravi.kumar@example.com",
        phone: "9876543211",
        blood: "A+",
        status: "Active",
        joinDate: "2025-03-10",
        resignDate: "",
        address: "Coimbatore, Tamil Nadu",
        updatedAt: Date.now() - 4000
      }
    ],
    products: [
      {
        id: 1,
        code: "PRD001",
        name: "Logitech G502 Mouse",
        cat: "Computer",
        subCat: "Mouse",
        brand: "Logitech",
        serial: "S/N 12345",
        purchaseDate: "2025-02-01",
        qty: 1,
        status: "Available",
        updatedAt: Date.now() - 5000
      },
      {
        id: 2,
        code: "PRD002",
        name: "Intel Core i9 CPU Tower",
        cat: "Computer",
        subCat: "CPU",
        brand: "Intel",
        serial: "S/N 54321",
        purchaseDate: "2025-02-01",
        qty: 1,
        status: "Available",
        updatedAt: Date.now() - 4500
      },
      {
        id: 3,
        code: "PRD003",
        name: "Keychron K2 Keyboard",
        cat: "Computer",
        subCat: "Keyboard",
        brand: "Keychron",
        serial: "S/N 98765",
        purchaseDate: "2025-02-01",
        qty: 1,
        status: "Available",
        updatedAt: Date.now() - 4000
      },
      {
        id: 4,
        code: "PRD004",
        name: "Dell UltraSharp 27 Monitor",
        cat: "Computer",
        subCat: "Monitor",
        brand: "Dell",
        serial: "S/N 56789",
        purchaseDate: "2025-02-01",
        qty: 1,
        status: "Available",
        updatedAt: Date.now() - 3500
      },
      {
        id: 5,
        code: "PRD005",
        name: "Logitech C922 Webcam",
        cat: "Accessories",
        subCat: "Webcam",
        brand: "Logitech",
        serial: "S/N 87654",
        purchaseDate: "2025-03-01",
        qty: 1,
        status: "Available",
        updatedAt: Date.now() - 3000
      }
    ],
    assignments: [],
    damages: [],
    repairs: [],
    history: [
      { id: 1, productCode: "PRD001", productName: "Logitech G502 Mouse", action: "Added", employee: "—", date: "2025-02-01", notes: "Product added to inventory", updatedAt: Date.now() - 5000 },
      { id: 2, productCode: "PRD002", productName: "Intel Core i9 CPU Tower", action: "Added", employee: "—", date: "2025-02-01", notes: "Product added to inventory", updatedAt: Date.now() - 4500 },
      { id: 3, productCode: "PRD003", productName: "Keychron K2 Keyboard", action: "Added", employee: "—", date: "2025-02-01", notes: "Product added to inventory", updatedAt: Date.now() - 4000 },
      { id: 4, productCode: "PRD004", productName: "Dell UltraSharp 27 Monitor", action: "Added", employee: "—", date: "2025-02-01", notes: "Product added to inventory", updatedAt: Date.now() - 3500 },
      { id: 5, productCode: "PRD005", productName: "Logitech C922 Webcam", action: "Added", employee: "—", date: "2025-03-01", notes: "Product added to inventory", updatedAt: Date.now() - 3000 }
    ],
    nextId: {
      emp: 3,
      prod: 6,
      assign: 1,
      dmg: 1,
      repair: 1,
      history: 6
    }
  };
  localStorage.setItem('pms_db', JSON.stringify(db));
  localStorage.setItem('pms_data_seeded_v3', 'true');
}

// Sanitize database structure to ensure all arrays are defined
db.employees = db.employees || [];
db.categories = db.categories || [];
db.products = db.products || [];
db.assignments = db.assignments || [];
db.damages = db.damages || [];
db.repairs = db.repairs || [];
db.history = db.history || [];

// Initialize nextId if not present or corrupt (e.g. contains NaN)
if (!db.nextId || 
    isNaN(db.nextId.emp) || 
    isNaN(db.nextId.prod) || 
    isNaN(db.nextId.assign) || 
    isNaN(db.nextId.dmg) || 
    isNaN(db.nextId.repair) || 
    isNaN(db.nextId.history)) {
  db.nextId = {
    emp: db.employees.length ? Math.max(...db.employees.map(e => parseInt(e.id) || 0), 0) + 1 : 1,
    prod: db.products.length ? Math.max(...db.products.map(p => parseInt(p.id) || 0), 0) + 1 : 1,
    assign: db.assignments.length ? Math.max(...db.assignments.map(a => parseInt(a.id) || 0), 0) + 1 : 1,
    dmg: db.damages.length ? Math.max(...db.damages.map(d => parseInt(d.id) || 0), 0) + 1 : 1,
    repair: db.repairs.length ? Math.max(...db.repairs.map(r => parseInt(r.id) || 0), 0) + 1 : 1,
    history: db.history.length ? Math.max(...db.history.map(h => parseInt(h.id) || 0), 0) + 1 : 1
  };
}

function saveDb() {
  localStorage.setItem('pms_db', JSON.stringify(db));
}`;

const loadReplacement = `function saveDb() {
  // DB saving is now handled on PostgreSQL server
}`;

// 2. saveEmployee Function
const saveEmployeeTarget = `function saveEmployee() {
  const code = document.getElementById('ef-code').value.trim();
  const name = document.getElementById('ef-name').value.trim();
  const dept = document.getElementById('ef-dept').value.trim();
  const role = document.getElementById('ef-role').value.trim();
  const email = document.getElementById('ef-email').value.trim();
  const status = document.getElementById('ef-status').value;

  if (!code || !name) { showToast('Code and Name are required.', 'error'); return; }

  const charRegex = /^[a-zA-Z\\s]+$/;
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
    const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
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
  if (!phone || !/^\\d{10}$/.test(phone)) {
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
    id: editingId.emp || db.nextId.emp++,
    code, name, dept, role, email,
    phone,
    blood: document.getElementById('ef-blood').value.trim(),
    status,
    joinDate: document.getElementById('ef-join').value,
    resignDate,
    address: document.getElementById('ef-addr').value.trim(),
    updatedAt: Date.now()
  };
  if (editingId.emp) {
    const i = db.employees.findIndex(x => x.id === editingId.emp);
    db.employees[i] = emp;
    showToast('Employee updated.', 'success');
  } else {
    db.employees.push(emp);
    showToast('Employee added.', 'success');
  }
  
  saveDb();
  window.location.reload();
}`;

const saveEmployeeReplacement = `function saveEmployee() {
  const code = document.getElementById('ef-code').value.trim();
  const name = document.getElementById('ef-name').value.trim();
  const dept = document.getElementById('ef-dept').value.trim();
  const role = document.getElementById('ef-role').value.trim();
  const email = document.getElementById('ef-email').value.trim();
  const status = document.getElementById('ef-status').value;

  if (!code || !name) { showToast('Code and Name are required.', 'error'); return; }

  const charRegex = /^[a-zA-Z\\s]+$/;
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
    const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/;
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
  if (!phone || !/^\\d{10}$/.test(phone)) {
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

  const url = editingId.emp ? \`/api/employees/\${editingId.emp}\` : '/api/employees';
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
    showToast(editingId.emp ? 'Employee updated.' : 'Employee added.', 'success');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save employee.', 'error');
  });
}`;

// 3. deleteEmployee Function
const deleteEmployeeTarget = `function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  db.employees = db.employees.filter(x => x.id !== id);
  showToast('Employee deleted.', 'success');
  saveDb();
  window.location.reload();
}`;

const deleteEmployeeReplacement = `function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  fetch(\`/api/employees/\${id}\`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete error');
      showToast('Employee deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete employee.', 'error');
    });
}`;

// 4. saveCategory Function
const saveCategoryTarget = `function saveCategory() {
  const name = document.getElementById('cf-name').value.trim();
  if (!name) { showToast('Category name required.', 'error'); return; }

  if (editingId.cat !== null) {
    // Update existing
    const idx = db.categories.findIndex(c => (typeof c === 'string' ? c : c.name) === editingId.cat);
    if (idx !== -1) {
      const existing = db.categories[idx];
      db.categories[idx] = {
        name,
        items: (typeof existing === 'object' && existing.items) ? existing.items : [],
        ...(existing.subCategories ? { subCategories: existing.subCategories } : {}),
        updatedAt: Date.now()
      };
    }
    showToast('Category updated.', 'success');
  } else {
    // Check for duplicate
    const exists = db.categories.some(c => (typeof c === 'string' ? c : c.name).toLowerCase() === name.toLowerCase());
    if (exists) { showToast('Category already exists.', 'error'); return; }
    db.categories.push({ name, items: [], updatedAt: Date.now() });
    showToast('Category added.', 'success');
  }

  saveDb();
  window.location.reload();
}`;

const saveCategoryReplacement = `function saveCategory() {
  const name = document.getElementById('cf-name').value.trim();
  if (!name) { showToast('Category name required.', 'error'); return; }

  const existingCat = editingId.cat !== null ? db.categories.find(c => (typeof c === 'string' ? c : c.name) === editingId.cat) : null;
  const items = existingCat ? (existingCat.items || []) : [];
  
  const url = editingId.cat !== null ? \`/api/categories/\${encodeURIComponent(editingId.cat)}\` : '/api/categories';
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
}`;

// 5. deleteCategory Function
const deleteCategoryTarget = `function deleteCategory(catName) {
  if (!confirm('Delete this category?')) return;
  db.categories = db.categories.filter(c => (typeof c === 'string' ? c : c.name) !== catName);
  showToast('Category deleted.', 'success');
  saveDb();
  window.location.reload();
}`;

const deleteCategoryReplacement = `function deleteCategory(catName) {
  if (!confirm('Delete this category?')) return;
  fetch(\`/api/categories/\${encodeURIComponent(catName)}\`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete category error');
      showToast('Category deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete category.', 'error');
    });
}`;

// 6. saveAccessoryItem Function
const saveAccessoryItemTarget = `function saveAccessoryItem() {
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

  const code = 'ACC' + String(db.nextId.prod).padStart(3, '0');
  const prod = {
    id: db.nextId.prod++,
    code,
    name,
    cat: 'Accessories',
    subCat: itemType,
    brand,
    serial: '',
    purchaseDate: purchaseDate || today(),
    qty,
    status,
    updatedAt: Date.now()
  };

  db.products.push(prod);
  db.history.push({
    id: db.nextId.history++,
    productCode: prod.code,
    productName: prod.name,
    action: 'Added',
    employee: '—',
    date: today(),
    notes: \`Accessory item (\${itemType}) added to inventory\`,
    updatedAt: Date.now()
  });

  closeModal('accessory-modal');
  showToast(\`\${itemType} "\${name}" added successfully!\`, 'success');
  renderItems();
  updateBadges();
  renderDashboard();
}`;

const saveAccessoryItemReplacement = `function saveAccessoryItem() {
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
    showToast(\`\${itemType} "\${name}" added successfully!\`, 'success');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to add accessory.', 'error');
  });
}`;

// 7. saveProduct Function
const saveProductTarget = `function saveProduct() {
  const code = document.getElementById('pf-code').value.trim();
  const name = document.getElementById('pf-name').value.trim();
  if (!code || !name) { showToast('Code and Name are required.', 'error'); return; }
  
  const cat = document.getElementById('pf-cat').value;
  if (!cat) { showToast('Category is required.', 'error'); return; }
  
  // Preserve existing properties if we are editing an existing product
  let existing = null;
  if (editingId.prod) {
    existing = db.products.find(x => x.id === editingId.prod);
  }

  const pfBrand = document.getElementById('pf-brand');
  const pfQty = document.getElementById('pf-qty');
  const pfStatus = document.getElementById('pf-status');

  const prod = {
    id: editingId.prod || db.nextId.prod++,
    code,
    name,
    cat,
    subCat: existing ? (existing.subCat || '') : '',
    brand: pfBrand ? pfBrand.value.trim() : (existing ? (existing.brand || '') : ''),
    serial: existing ? (existing.serial || '') : '',
    purchaseDate: document.getElementById('pf-date').value,
    qty: pfQty ? (parseInt(pfQty.value) || 1) : (existing ? (existing.qty || 1) : 1),
    status: pfStatus ? (pfStatus.value || 'Available') : (existing ? (existing.status || 'Available') : 'Available'),
    updatedAt: Date.now()
  };
  if (editingId.prod) {
    const i = db.products.findIndex(x => x.id === editingId.prod);
    db.products[i] = prod;
    showToast('Product updated.', 'success');
  } else {
    db.products.push(prod);
    db.history.push({ id: db.nextId.history++, productCode: prod.code, productName: prod.name, action: 'Added', employee: '—', date: today(), notes: 'Product added to inventory', updatedAt: Date.now() });
    showToast('Product added.', 'success');
  }
  
  saveDb();
  window.location.reload();
}`;

const saveProductReplacement = `function saveProduct() {
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

  const url = editingId.prod ? \`/api/products/\${editingId.prod}\` : '/api/products';
  const method = editingId.prod ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prod)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save product error');
    showToast(editingId.prod ? 'Product updated.' : 'Product added.', 'success');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save product.', 'error');
  });
}`;

// 8. deleteProduct Function
const deleteProductTarget = `function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  db.products = db.products.filter(x => x.id !== id);
  showToast('Product deleted.', 'success');
  saveDb();
  window.location.reload();
}`;

const deleteProductReplacement = `function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  fetch(\`/api/products/\${id}\`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete product error');
      showToast('Product deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete product.', 'error');
    });
}`;

// 9. saveAssignment Function
const saveAssignmentTarget = `function saveAssignment() {
  const empId = parseInt(document.getElementById('af-emp').value);
  if (!empId) { showToast('Please search and select an employee from suggestions.', 'error'); return; }
  const emp = db.employees.find(e => e.id === empId);
  if (!emp) { showToast('Selected employee not found.', 'error'); return; }

  const category = document.getElementById('af-cat').value;
  if (!category) { showToast('Select a category.', 'error'); return; }

  if (selectedAssignProducts.length === 0) { showToast('Please select at least one product.', 'error'); return; }

  const assignedDate = document.getElementById('af-date').value || today();
  const returnDate = '';

  const prodIds = selectedAssignProducts.map(p => p.id);
  const prodNames = selectedAssignProducts.map(p => p.name).join(', ');
  
  // UNIQUE product codes display (removes duplicates)
  const uniqueCodesList = [...new Set(selectedAssignProducts.map(p => p.code))];
  const prodCodes = uniqueCodesList.join(', ');

  if (editingId.assign) {
    // EDIT MODE
    const a = db.assignments.find(x => x.id === editingId.assign);
    if (!a) { showToast('Assignment record not found.', 'error'); return; }

    const oldProductIds = a.productIds || [a.productId];

    // 1. Identify removed products
    const removedProductIds = oldProductIds.filter(id => !prodIds.includes(id));
    removedProductIds.forEach(pId => {
      const prod = db.products.find(x => x.id === pId);
      if (prod) {
        prod.status = 'Available';
        prod.updatedAt = Date.now();
        db.history.push({
          id: db.nextId.history++,
          productCode: prod.code,
          productName: prod.name,
          action: 'Returned',
          employee: emp.name,
          date: today(),
          notes: \`Returned/Removed from edited assignment to \${emp.name}\`,
          updatedAt: Date.now()
        });
      }
    });

    // 2. Identify newly added products
    const addedProductIds = prodIds.filter(id => !oldProductIds.includes(id));
    addedProductIds.forEach(pId => {
      const prod = db.products.find(x => x.id === pId);
      if (prod) {
        prod.status = 'Assigned';
        prod.updatedAt = Date.now();
        db.history.push({
          id: db.nextId.history++,
          productCode: prod.code,
          productName: prod.name,
          action: 'Assigned',
          employee: emp.name,
          date: assignedDate,
          returnDate: returnDate,
          notes: \`Assigned in edited assignment to \${emp.name}\`,
          updatedAt: Date.now()
        });
      }
    });

    // 3. Update assignment details
    a.productIds = prodIds;
    a.productId = prodIds[0];
    a.productName = prodNames;
    a.productCode = prodCodes;
    a.employeeId = empId;
    a.employeeName = emp.name;
    a.dept = emp.dept;
    a.assignedDate = assignedDate;
    a.units = prodIds.length;
    a.updatedAt = Date.now();

    showToast('Assignment updated successfully!', 'success');
  } else {
    // ADD MODE
    // Update statuses & logs for all selected products
    selectedAssignProducts.forEach(p => {
      const prod = db.products.find(x => x.id === p.id);
      if (prod) {
        prod.status = 'Assigned';
        prod.updatedAt = Date.now();
        db.history.push({
          id: db.nextId.history++,
          productCode: prod.code,
          productName: prod.name,
          action: 'Assigned',
          employee: emp.name,
          date: assignedDate,
          returnDate: returnDate,
          notes: \`Assigned to \${emp.name}\`,
          updatedAt: Date.now()
        });
      }
    });

    const a = {
      id: db.nextId.assign++,
      productIds: prodIds,
      productId: prodIds[0],
      productName: prodNames,
      productCode: prodCodes,
      employeeId: empId,
      employeeName: emp.name,
      dept: emp.dept,
      assignedDate: assignedDate,
      returnDate: returnDate,
      units: prodIds.length,
      updatedAt: Date.now()
    };

    db.assignments.push(a);
    showToast('Assignment added successfully!', 'success');
  }

  saveDb();
  window.location.reload();
}`;

const saveAssignmentReplacement = `function saveAssignment() {
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

  const url = editingId.assign ? \`/api/assignments/\${editingId.assign}\` : '/api/assignments';
  const method = editingId.assign ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then(res => {
    if (!res.ok) throw new Error('API save assignment error');
    showToast(editingId.assign ? 'Assignment updated successfully!' : 'Assignment added successfully!', 'success');
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
    showToast('Failed to save assignment.', 'error');
  });
}`;

// 10. returnProduct Function
const returnProductTarget = `function returnProduct(id) {
  const a = db.assignments.find(x => x.id === id);
  if (!a) return;
  if (!confirm(\`Mark "\${a.productName}" as returned?\`)) return;

  // Resolve product IDs
  const productIds = a.productIds || (a.productId ? [a.productId] : []);
  productIds.forEach(pId => {
    const prod = db.products.find(p => p.id === pId);
    if (prod) {
      prod.status = 'Available';
      prod.updatedAt = Date.now();
      db.history.push({
        id: db.nextId.history++,
        productCode: prod.code,
        productName: prod.name,
        action: 'Returned',
        employee: a.employeeName,
        date: today(),
        notes: 'Product returned from bundle',
        updatedAt: Date.now()
      });
    }
  });

  // Update assignment returnDate to current date & time
  a.returnDate = currentDateTime();
  a.updatedAt = Date.now();

  saveDb();
  window.location.reload();
}`;

const returnProductReplacement = `function returnProduct(id) {
  const a = db.assignments.find(x => x.id === id);
  if (!a) return;
  if (!confirm(\`Mark "\${a.productName}" as returned?\`)) return;

  fetch(\`/api/assignments/\${id}/return\`, {
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
}`;

// 11. deleteAssignment Function
const deleteAssignmentTarget = `function deleteAssignment(id) {
  if (!confirm('Remove this assignment record?')) return;

  const a = db.assignments.find(x => x.id === id);
  if (a && !a.returnDate) {
    const productIds = a.productIds || (a.productId ? [a.productId] : []);
    productIds.forEach(pId => {
      const prod = db.products.find(p => p.id === pId);
      if (prod) {
        prod.status = 'Available';
      }
    });
  }

  db.assignments = db.assignments.filter(x => x.id !== id);
  showToast('Assignment removed.', 'success');
  saveDb();
  window.location.reload();
}`;

const deleteAssignmentReplacement = `function deleteAssignment(id) {
  if (!confirm('Remove this assignment record?')) return;
  fetch(\`/api/assignments/\${id}\`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete assignment error');
      showToast('Assignment removed.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete assignment.', 'error');
    });
}`;

// 12. saveDamage Function
const saveDamageTarget = `function saveDamage() {
  const prodIdVal = document.getElementById('df-prod').value;
  const prodId = parseInt(prodIdVal);
  if (!prodIdVal || isNaN(prodId)) { showToast('Please select a product.', 'error'); return; }
  
  const status = document.getElementById('df-action').value;
  if (!status) { showToast('Please select an action.', 'error'); return; }

  const by = document.getElementById('df-by').value.trim();
  if (!by) { showToast('Please enter reporter name.', 'error'); return; }

  const prod = db.products.find(p => p.id === prodId);
  if (!prod) { showToast('Selected product not found.', 'error'); return; }

  const d = {
    id: db.nextId.dmg++,
    productId: prodId, productCode: prod.code, productName: prod.name,
    status,
    date: document.getElementById('df-date').value || today(),
    by,
    notes: document.getElementById('df-notes').value.trim(),
    updatedAt: Date.now()
  };
  db.damages.push(d);
  prod.status = status === 'Damaged' ? 'Damaged' : 'Replaced';
  prod.updatedAt = Date.now();
  db.history.push({ id: db.nextId.history++, productCode: prod.code, productName: prod.name, action: status === 'Damaged' ? 'Damaged' : 'Replaced', employee: '—', date: d.date, notes: d.notes, updatedAt: Date.now() });
  saveDb();
  window.location.reload();
}`;

const saveDamageReplacement = `function saveDamage() {
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
}`;

// 13. deleteDamage Function
const deleteDamageTarget = `function deleteDamage(id) {
  if (!confirm('Delete this damage report?')) return;
  db.damages = db.damages.filter(x => x.id !== id);
  showToast('Report deleted.', 'success');
  saveDb();
  window.location.reload();
}`;

const deleteDamageReplacement = `function deleteDamage(id) {
  if (!confirm('Delete this damage report?')) return;
  fetch(\`/api/damages/\${id}\`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete damage error');
      showToast('Report deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete report.', 'error');
    });
}`;

// 14. saveRepair Function
const saveRepairTarget = `function saveRepair() {
  const prodIdVal = document.getElementById('rf-prod').value;
  const prodId = parseInt(prodIdVal);
  if (!prodIdVal || isNaN(prodId)) { showToast('Please select a product.', 'error'); return; }

  const status = document.getElementById('rf-status').value;
  if (!status) { showToast('Please select a status.', 'error'); return; }

  const center = document.getElementById('rf-center').value.trim();
  const alphanumericRegex = /^[a-zA-Z0-9\\s]*$/;
  if (center && !alphanumericRegex.test(center)) {
    showToast('Repair Center can only contain letters, numbers, and spaces.', 'error');
    return;
  }

  const contact = document.getElementById('rf-contact').value.trim();
  if (!contact || !/^\\d{10}$/.test(contact)) {
    showToast('Contact number must be exactly 10 digits.', 'error');
    return;
  }

  const takenBy = document.getElementById('rf-taken').value.trim();
  const charRegex = /^[a-zA-Z\\s]*$/;
  if (takenBy && !charRegex.test(takenBy)) {
    showToast('Taken By Person can only contain letters and spaces.', 'error');
    return;
  }

  const prod = db.products.find(p => p.id === prodId);
  if (!prod) { showToast('Selected product not found.', 'error'); return; }

  const r = {
    id: db.nextId.repair++,
    productId: prodId, productCode: prod.code, productName: prod.name,
    center,
    contact,
    takenBy,
    dateSent: document.getElementById('rf-sent').value || today(),
    expectedDate: document.getElementById('rf-expected').value,
    status,
    notes: document.getElementById('rf-notes').value.trim(),
    updatedAt: Date.now()
  };
  db.repairs.push(r);
  prod.status = 'Repair';
  prod.updatedAt = Date.now();
  db.history.push({ id: db.nextId.history++, productCode: prod.code, productName: prod.name, action: 'Repair', employee: '—', date: r.dateSent, notes: \`Sent to \${r.center}\`, updatedAt: Date.now() });
  saveDb();
  window.location.reload();
}`;

const saveRepairReplacement = `function saveRepair() {
  const prodIdVal = document.getElementById('rf-prod').value;
  const prodId = parseInt(prodIdVal);
  if (!prodIdVal || isNaN(prodId)) { showToast('Please select a product.', 'error'); return; }

  const status = document.getElementById('rf-status').value;
  if (!status) { showToast('Please select a status.', 'error'); return; }

  const center = document.getElementById('rf-center').value.trim();
  const alphanumericRegex = /^[a-zA-Z0-9\\s]*$/;
  if (center && !alphanumericRegex.test(center)) {
    showToast('Repair Center can only contain letters, numbers, and spaces.', 'error');
    return;
  }

  const contact = document.getElementById('rf-contact').value.trim();
  if (!contact || !/^\\d{10}$/.test(contact)) {
    showToast('Contact number must be exactly 10 digits.', 'error');
    return;
  }

  const takenBy = document.getElementById('rf-taken').value.trim();
  const charRegex = /^[a-zA-Z\\s]*$/;
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
    expectedDate: document.getElementById('rf-expected').value,
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
}`;

// 15. deleteRepair Function
const deleteRepairTarget = `function deleteRepair(id) {
  if (!confirm('Delete this repair record?')) return;
  db.repairs = db.repairs.filter(x => x.id !== id);
  showToast('Record deleted.', 'success');
  saveDb();
  window.location.reload();
}`;

const deleteRepairReplacement = `function deleteRepair(id) {
  if (!confirm('Delete this repair record?')) return;
  fetch(\`/api/repairs/\${id}\`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('API delete repair error');
      showToast('Record deleted.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to delete record.', 'error');
    });
}`;

// 16. completeRepair Function
const completeRepairTarget = `function completeRepair(id) {
  const r = db.repairs.find(x => x.id === id);
  if (!r) return;
  r.status = 'Completed';
  r.updatedAt = Date.now();
  const prod = db.products.find(p => p.id === r.productId);
  if (prod) {
    prod.status = 'Available';
    prod.updatedAt = Date.now();
  }
  db.history.push({ id: db.nextId.history++, productCode: r.productCode, productName: r.productName, action: 'Repaired', employee: '—', date: today(), notes: 'Repair completed, returned to inventory', updatedAt: Date.now() });
  saveDb();
  window.location.reload();
}`;

const completeRepairReplacement = `function completeRepair(id) {
  if (!confirm('Mark this repair as completed?')) return;
  fetch(\`/api/repairs/\${id}/complete\`, { method: 'PUT' })
    .then(res => {
      if (!res.ok) throw new Error('API complete repair error');
      showToast('Repair completed, returned to inventory.', 'success');
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to complete repair.', 'error');
    });
}`;

// 17. Initialization at the end
const initTarget = `// ===================== INIT =====================
function initBaselineTimestamps() {
  const collections = ['employees', 'categories', 'products', 'assignments', 'damages', 'repairs', 'history'];
  collections.forEach(col => {
    if (db[col] && Array.isArray(db[col])) {
      db[col].forEach((item, index) => {
        if (item && typeof item === 'object') {
          item.updatedAt = item.updatedAt || (Date.now() - (db[col].length - index) * 60000);
        }
      });
    }
  });
}
initBaselineTimestamps();
populateCategorySelects();
const savedPage = sessionStorage.getItem('pms_active_page') || 'dashboard';
let startPage = savedPage;
if (savedPage === 'emp-detail') startPage = 'employees';
else if (savedPage === 'prod-detail') startPage = 'products';
navigate(startPage);`;

const initReplacement = `// ===================== INIT =====================
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

  populateCategorySelects();
  const savedPage = sessionStorage.getItem('pms_active_page') || 'dashboard';
  let startPage = savedPage;
  if (savedPage === 'emp-detail') startPage = 'employees';
  else if (savedPage === 'prod-detail') startPage = 'products';
  navigate(startPage);
}
initApp();`;

// Perform replacements
const replacements = [
  { name: 'Storage Load & Seed Block', target: loadTarget, replacement: loadReplacement },
  { name: 'saveEmployee', target: saveEmployeeTarget, replacement: saveEmployeeReplacement },
  { name: 'deleteEmployee', target: deleteEmployeeTarget, replacement: deleteEmployeeReplacement },
  { name: 'saveCategory', target: saveCategoryTarget, replacement: saveCategoryReplacement },
  { name: 'deleteCategory', target: deleteCategoryTarget, replacement: deleteCategoryReplacement },
  { name: 'saveAccessoryItem', target: saveAccessoryItemTarget, replacement: saveAccessoryItemReplacement },
  { name: 'saveProduct', target: saveProductTarget, replacement: saveProductReplacement },
  { name: 'deleteProduct', target: deleteProductTarget, replacement: deleteProductReplacement },
  { name: 'saveAssignment', target: saveAssignmentTarget, replacement: saveAssignmentReplacement },
  { name: 'returnProduct', target: returnProductTarget, replacement: returnProductReplacement },
  { name: 'deleteAssignment', target: deleteAssignmentTarget, replacement: deleteAssignmentReplacement },
  { name: 'saveDamage', target: saveDamageTarget, replacement: saveDamageReplacement },
  { name: 'deleteDamage', target: deleteDamageTarget, replacement: deleteDamageReplacement },
  { name: 'saveRepair', target: saveRepairTarget, replacement: saveRepairReplacement },
  { name: 'deleteRepair', target: deleteRepairTarget, replacement: deleteRepairReplacement },
  { name: 'completeRepair', target: completeRepairTarget, replacement: completeRepairReplacement },
  { name: 'Initialization', target: initTarget, replacement: initReplacement }
];

for (const rep of replacements) {
  if (!content.includes(rep.target)) {
    console.error(`ERROR: Target for "${rep.name}" was not found in app.js! Skipping or check matching.`);
    // Try trim / spacing variations
    const trimmedTarget = rep.target.trim().replace(/\s+/g, ' ');
    let found = false;

    // Fallback: search loosely
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const windowStr = lines.slice(i, i + 10).join(' ');
      if (windowStr.replace(/\s+/g, ' ').includes(rep.target.split('\n')[0].trim())) {
        console.log(`Possible partial match starting around line ${i + 1}`);
      }
    }
    process.exit(1);
  }
  content = content.replace(rep.target, rep.replacement);
  console.log(`Successfully replaced "${rep.name}"`);
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('app.js updated successfully!');
