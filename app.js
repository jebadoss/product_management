// ===================== DATA STORE =====================
let db = {
  employees: [
    { id: 1, code: 'EMP001', name: 'Ramesh Kumar', dept: 'IT', role: 'Engineer', email: 'ramesh@company.com', phone: '9876543210', blood: 'O+', status: 'Active', joinDate: '2022-03-15', resignDate: '', address: '12 Gandhi Nagar, Chennai' },
    { id: 2, code: 'EMP002', name: 'Priya Sharma', dept: 'Admin', role: 'Manager', email: 'priya@company.com', phone: '9876500001', blood: 'A+', status: 'Active', joinDate: '2021-07-01', resignDate: '', address: '45 Anna Nagar, Chennai' },
    { id: 3, code: 'EMP003', name: 'Arun Selvam', dept: 'Finance', role: 'Accountant', email: 'arun@company.com', phone: '9876522222', blood: 'B+', status: 'Inactive', joinDate: '2020-01-10', resignDate: '2024-06-30', address: '78 T.Nagar, Chennai' },
    { id: 4, code: 'EMP004', name: 'Shweta Nair', dept: 'HR', role: 'HR Specialist', email: 'shweta@company.com', phone: '9876533333', blood: 'A-', status: 'Active', joinDate: '2022-11-20', resignDate: '', address: '23 Velachery Main Rd, Chennai' },
    { id: 5, code: 'EMP005', name: 'Karthik Iyer', dept: 'Logistics', role: 'Coordinator', email: 'karthik@company.com', phone: '9876544444', blood: 'B+', status: 'Active', joinDate: '2023-02-28', resignDate: '', address: '11 OMR Road, Chennai' },
    { id: 6, code: 'EMP006', name: 'Anjali Menon', dept: 'Marketing', role: 'Executive', email: 'anjali@company.com', phone: '9876555555', blood: 'O-', status: 'Active', joinDate: '2021-09-12', resignDate: '', address: '67 ECR Road, Chennai' },
    { id: 7, code: 'EMP007', name: 'Vikram Patel', dept: 'Support', role: 'Technician', email: 'vikram@company.com', phone: '9876566666', blood: 'AB+', status: 'Active', joinDate: '2022-05-18', resignDate: '', address: '89 Mount Road, Chennai' },
    { id: 8, code: 'EMP008', name: 'Nidhi Rao', dept: 'Procurement', role: 'Buyer', email: 'nidhi@company.com', phone: '9876577777', blood: 'O+', status: 'Active', joinDate: '2023-10-05', resignDate: '', address: '12 Porur Main Rd, Chennai' },
    { id: 9, code: 'EMP009', name: 'Arjun Das', dept: 'IT', role: 'Developer', email: 'arjun@company.com', phone: '9876588888', blood: 'A+', status: 'Active', joinDate: '2022-02-11', resignDate: '', address: '55 Velachery Rd, Chennai' },
    { id: 10, code: 'EMP010', name: 'Meera Joshi', dept: 'Finance', role: 'Analyst', email: 'meera@company.com', phone: '9876599999', blood: 'B-', status: 'Active', joinDate: '2021-12-01', resignDate: '', address: '18 Nungambakkam, Chennai' },
    { id: 11, code: 'EMP011', name: 'Sanjay Rao', dept: 'Admin', role: 'Office Assistant', email: 'sanjay@company.com', phone: '9876511111', blood: 'AB-', status: 'Active', joinDate: '2023-03-22', resignDate: '', address: '34 Coimbatore Rd, Chennai' },
    { id: 12, code: 'EMP012', name: 'Ritu Sharma', dept: 'Marketing', role: 'Content Writer', email: 'ritu@company.com', phone: '9876523333', blood: 'O+', status: 'Active', joinDate: '2024-01-08', resignDate: '', address: '77 Guindy, Chennai' },
    { id: 13, code: 'EMP013', name: 'Devika Menon', dept: 'HR', role: 'Recruiter', email: 'devika@company.com', phone: '9876534444', blood: 'A-', status: 'Active', joinDate: '2022-06-25', resignDate: '', address: '99 Saidapet, Chennai' },
    { id: 14, code: 'EMP014', name: 'Rahul Singh', dept: 'IT', role: 'SysAdmin', email: 'rahul@company.com', phone: '9876545555', blood: 'B+', status: 'Active', joinDate: '2020-10-14', resignDate: '', address: '6 Teynampet, Chennai' },
    { id: 15, code: 'EMP015', name: 'Sneha Iyer', dept: 'Sales', role: 'Executive', email: 'sneha@company.com', phone: '9876556666', blood: 'A+', status: 'Active', joinDate: '2023-08-30', resignDate: '', address: '41 Ambattur, Chennai' },
    { id: 16, code: 'EMP016', name: 'Vijay Kumar', dept: 'Logistics', role: 'Store Keeper', email: 'vijay@company.com', phone: '9876567777', blood: 'O-', status: 'Active', joinDate: '2021-05-14', resignDate: '', address: '23 Perambur, Chennai' },
  ],
  categories: [
    { name: 'PC', items: ['CPU', 'Mouse', 'Monitor', 'Keyboard'] },
    { name: 'Laptop', items: ['Mouse', 'Mic'] },
    { name: 'Chair', items: ['Roll Chair', 'Normal Chair'] },
    { name: 'AC', items: [] },
    { name: 'Printer', items: [] },
    { name: 'Tablet', items: [] },
    { name: 'Projector', items: [] },
    { name: 'Scanner', items: [] },
    { name: 'Speakers', items: [] },
    { name: 'Camera', items: [] }
  ],
  products: [
    { id: 1, code: 'PRD001', name: 'Dell Latitude 5420', cat: 'Laptop', subCat: '', brand: 'Dell', serial: 'DL54201', purchaseDate: '2023-01-15', qty: 5, status: 'Assigned' },
    { id: 2, code: 'PRD002', name: 'HP LaserJet Pro', cat: 'Printer', subCat: '', brand: 'HP', serial: 'HLP2301', purchaseDate: '2022-08-20', qty: 2, status: 'Assigned' },
    { id: 3, code: 'PRD003', name: 'Logitech MK270', cat: 'PC', subCat: 'Mouse', brand: 'Logitech', serial: 'LM27003', purchaseDate: '2023-05-10', qty: 10, status: 'Assigned' },
    { id: 4, code: 'PRD004', name: 'Blue Star 1.5T AC', cat: 'AC', subCat: '', brand: 'Blue Star', serial: 'BS150AC1', purchaseDate: '2022-12-01', qty: 3, status: 'Assigned' },
    { id: 5, code: 'PRD005', name: 'Lenovo ThinkPad', cat: 'Laptop', subCat: '', brand: 'Lenovo', serial: 'LT20231', purchaseDate: '2023-03-20', qty: 2, status: 'Damaged' },
    { id: 6, code: 'PRD006', name: 'Ergonomic Chair', cat: 'Chair', subCat: 'Roll Chair', brand: 'Green Soul', serial: 'GS4001', purchaseDate: '2021-06-15', qty: 8, status: 'Assigned' },
    { id: 7, code: 'PRD007', name: 'Mechanical Keyboard', cat: 'PC', subCat: 'Keyboard', brand: 'Keychron', serial: 'KC751', purchaseDate: '2023-07-01', qty: 4, status: 'Repair' },
    { id: 8, code: 'PRD008', name: 'Samsung Galaxy Tab S7', cat: 'Tablet', subCat: '', brand: 'Samsung', serial: 'SGT1234', purchaseDate: '2023-04-18', qty: 6, status: 'Assigned' },
    { id: 9, code: 'PRD009', name: 'Sony WH-1000XM4', cat: 'Speakers', subCat: '', brand: 'Sony', serial: 'SWH1000', purchaseDate: '2022-11-02', qty: 7, status: 'Assigned' },
    { id: 10, code: 'PRD010', name: 'Canon imageCLASS MF3010', cat: 'Printer', subCat: '', brand: 'Canon', serial: 'CIM3010', purchaseDate: '2023-08-10', qty: 3, status: 'Assigned' },
    { id: 11, code: 'PRD011', name: 'Logitech C920 Webcam', cat: 'Camera', subCat: '', brand: 'Logitech', serial: 'LC920', purchaseDate: '2023-02-14', qty: 5, status: 'Assigned' },
    { id: 12, code: 'PRD012', name: 'BenQ MX535 Projector', cat: 'Projector', subCat: '', brand: 'BenQ', serial: 'BMX535', purchaseDate: '2022-06-18', qty: 2, status: 'Available' },
    { id: 13, code: 'PRD013', name: 'HP EliteBook 840', cat: 'Laptop', subCat: '', brand: 'HP', serial: 'HEB840', purchaseDate: '2022-10-05', qty: 3, status: 'Assigned' },
    { id: 14, code: 'PRD014', name: 'Apple iPad Air', cat: 'Tablet', subCat: '', brand: 'Apple', serial: 'AIA2023', purchaseDate: '2023-09-14', qty: 4, status: 'Available' },
    { id: 15, code: 'PRD015', name: 'Bose SoundLink Revolve', cat: 'Speakers', subCat: '', brand: 'Bose', serial: 'BSR100', purchaseDate: '2023-03-28', qty: 2, status: 'Available' },
    { id: 16, code: 'PRD016', name: 'Brother DCP-T820W', cat: 'Printer', subCat: '', brand: 'Brother', serial: 'BD820W', purchaseDate: '2023-01-07', qty: 1, status: 'Repair' },
    { id: 17, code: 'PRD017', name: 'Acer Veriton M6670', cat: 'Laptop', subCat: '', brand: 'Acer', serial: 'AVM6670', purchaseDate: '2022-05-05', qty: 3, status: 'Available' },
    { id: 18, code: 'PRD018', name: 'Logitech MX Master 3', cat: 'PC', subCat: 'Mouse', brand: 'Logitech', serial: 'LMM300', purchaseDate: '2023-11-03', qty: 8, status: 'Available' },
    { id: 19, code: 'PRD019', name: 'Philips 24-inch Monitor', cat: 'PC', subCat: 'Monitor', brand: 'Philips', serial: 'P2401', purchaseDate: '2022-07-20', qty: 4, status: 'Assigned' },
    { id: 20, code: 'PRD020', name: 'Panasonic Document Scanner', cat: 'Scanner', subCat: '', brand: 'Panasonic', serial: 'PDS980', purchaseDate: '2022-09-12', qty: 2, status: 'Available' },
    { id: 21, code: 'PRD021', name: 'Asus VivoBook 15', cat: 'Laptop', subCat: '', brand: 'Asus', serial: 'AVB150', purchaseDate: '2023-02-22', qty: 6, status: 'Available' },
    { id: 22, code: 'PRD022', name: 'Microsoft Sculpt Keyboard', cat: 'PC', subCat: 'Keyboard', brand: 'Microsoft', serial: 'MSK220', purchaseDate: '2023-04-01', qty: 8, status: 'Available' },
    { id: 23, code: 'PRD023', name: 'Logitech MX Anywhere 3', cat: 'PC', subCat: 'Mouse', brand: 'Logitech', serial: 'LMA330', purchaseDate: '2023-06-05', qty: 9, status: 'Available' },
    { id: 24, code: 'PRD024', name: 'Epson EcoTank Printer', cat: 'Printer', subCat: '', brand: 'Epson', serial: 'EEP330', purchaseDate: '2023-09-12', qty: 3, status: 'Available' },
  ],
  assignments: [
    { id: 1, productId: 2, productName: 'HP LaserJet Pro', productCode: 'PRD002', employeeId: 1, employeeName: 'Ramesh Kumar', dept: 'IT', assignedDate: '2024-01-10', returnDate: '' },
    { id: 2, productId: 4, productName: 'Blue Star 1.5T AC', productCode: 'PRD004', employeeId: 2, employeeName: 'Priya Sharma', dept: 'Admin', assignedDate: '2023-12-05', returnDate: '' },
    { id: 3, productId: 8, productName: 'Samsung Galaxy Tab S7', productCode: 'PRD008', employeeId: 7, employeeName: 'Vikram Patel', dept: 'Support', assignedDate: '2024-02-18', returnDate: '' },
    { id: 4, productId: 11, productName: 'Logitech C920 Webcam', productCode: 'PRD011', employeeId: 9, employeeName: 'Arjun Das', dept: 'IT', assignedDate: '2024-04-05', returnDate: '' },
    { id: 5, productId: 13, productName: 'HP EliteBook 840', productCode: 'PRD013', employeeId: 8, employeeName: 'Nidhi Rao', dept: 'Procurement', assignedDate: '2024-05-10', returnDate: '' },
    { id: 6, productId: 19, productName: 'Philips 24-inch Monitor', productCode: 'PRD019', employeeId: 15, employeeName: 'Sneha Iyer', dept: 'Sales', assignedDate: '2024-06-20', returnDate: '' },
    { id: 7, productId: 1, productName: 'Dell Latitude 5420', productCode: 'PRD001', employeeId: 3, employeeName: 'Arun Selvam', dept: 'Finance', assignedDate: '2024-03-01', returnDate: '' },
    { id: 8, productId: 3, productName: 'Logitech MK270', productCode: 'PRD003', employeeId: 4, employeeName: 'Shweta Nair', dept: 'HR', assignedDate: '2024-04-12', returnDate: '' },
    { id: 9, productId: 6, productName: 'Ergonomic Chair', productCode: 'PRD006', employeeId: 5, employeeName: 'Karthik Iyer', dept: 'Logistics', assignedDate: '2024-05-15', returnDate: '' },
    { id: 10, productId: 9, productName: 'Sony WH-1000XM4', productCode: 'PRD009', employeeId: 12, employeeName: 'Ritu Sharma', dept: 'Marketing', assignedDate: '2024-06-10', returnDate: '' },
  ],
  damages: [
    { id: 1, productId: 5, productCode: 'PRD005', productName: 'Lenovo ThinkPad', date: '2024-05-20', by: 'Ramesh Kumar', notes: 'Screen cracked after a fall.' },
    { id: 2, productId: 10, productCode: 'PRD010', productName: 'Canon imageCLASS MF3010', date: '2024-07-02', by: 'Priya Sharma', notes: 'Paper jam caused damage to feeder.' },
    { id: 3, productId: 12, productCode: 'PRD012', productName: 'BenQ MX535 Projector', date: '2024-08-05', by: 'Sanjay Rao', notes: 'Lens cover broken during transport.' },
    { id: 4, productId: 14, productCode: 'PRD014', productName: 'Apple iPad Air', date: '2024-09-12', by: 'Nidhi Rao', notes: 'Screen cracked during transit.' },
    { id: 5, productId: 22, productCode: 'PRD022', productName: 'Microsoft Sculpt Keyboard', date: '2024-09-20', by: 'Anjali Menon', notes: 'Keycaps detached.' },
    { id: 6, productId: 21, productCode: 'PRD021', productName: 'Asus VivoBook 15', date: '2024-10-02', by: 'Vijay Kumar', notes: 'Battery swelling reported.' },
    { id: 7, productId: 23, productCode: 'PRD023', productName: 'Logitech MX Anywhere 3', date: '2024-10-08', by: 'Meera Joshi', notes: 'Left click not responding.' },
    { id: 8, productId: 24, productCode: 'PRD024', productName: 'Epson EcoTank Printer', date: '2024-10-12', by: 'Karthik Iyer', notes: 'Ink tank crack found.' },
    { id: 9, productId: 17, productCode: 'PRD017', productName: 'Acer Veriton M6670', date: '2024-10-18', by: 'Devika Menon', notes: 'Power supply failure.' },
    { id: 10, productId: 20, productCode: 'PRD020', productName: 'Panasonic Document Scanner', date: '2024-10-22', by: 'Sneha Iyer', notes: 'Feeder jam caused scanner damage.' },
  ],
  repairs: [
    { id: 1, productId: 5, productCode: 'PRD005', productName: 'Lenovo ThinkPad', date: '2024-05-20', by: 'Ramesh Kumar', notes: 'Screen cracked after a fall.' },
    { id: 2, productId: 10, productCode: 'PRD010', productName: 'Canon imageCLASS MF3010', date: '2024-07-02', by: 'Priya Sharma', notes: 'Paper jam caused damage to feeder.' },
    { id: 3, productId: 12, productCode: 'PRD012', productName: 'BenQ MX535 Projector', date: '2024-08-05', by: 'Sanjay Rao', notes: 'Lens cover broken during transport.' },
  ],
  repairs: [
    { id: 1, productId: 7, productCode: 'PRD007', productName: 'Mechanical Keyboard', center: 'Tech Fix Chennai', contact: '9944112233', takenBy: 'Vendor Rep', dateSent: '2024-06-01', expectedDate: '2024-06-15', status: 'In Progress', notes: 'Keys not registering.' },
    { id: 2, productId: 16, productCode: 'PRD016', productName: 'Brother DCP-T820W', center: 'Printer Care Chennai', contact: '9445223344', takenBy: 'Delivery Staff', dateSent: '2024-08-01', expectedDate: '2024-08-20', status: 'In Progress', notes: 'Ink system cleaning and head check.' },
    { id: 3, productId: 11, productCode: 'PRD011', productName: 'Logitech C920 Webcam', center: 'Camera Repair Hub', contact: '9881122334', takenBy: 'Office Admin', dateSent: '2024-09-12', expectedDate: '2024-09-22', status: 'Pending', notes: 'Auto-focus issue.' },
    { id: 4, productId: 5, productCode: 'PRD005', productName: 'Lenovo ThinkPad', center: 'Laptop Repair Center', contact: '9444001122', takenBy: 'Support Staff', dateSent: '2024-09-15', expectedDate: '2024-09-30', status: 'In Progress', notes: 'Screen replacement pending.' },
    { id: 5, productId: 14, productCode: 'PRD014', productName: 'Apple iPad Air', center: 'Apple Care', contact: '9444003344', takenBy: 'HR Team', dateSent: '2024-09-28', expectedDate: '2024-10-10', status: 'Pending', notes: 'Touch response issue.' },
    { id: 6, productId: 22, productCode: 'PRD022', productName: 'Microsoft Sculpt Keyboard', center: 'Keyboard Clinic', contact: '9444005566', takenBy: 'Inventory Team', dateSent: '2024-10-03', expectedDate: '2024-10-16', status: 'In Progress', notes: 'Stuck keys repair.' },
    { id: 7, productId: 21, productCode: 'PRD021', productName: 'Asus VivoBook 15', center: 'Asus Service', contact: '9444007788', takenBy: 'Systems Team', dateSent: '2024-10-10', expectedDate: '2024-10-24', status: 'Pending', notes: 'Battery replacement.' },
    { id: 8, productId: 23, productCode: 'PRD023', productName: 'Logitech MX Anywhere 3', center: 'Gadget Repair Hub', contact: '9444009900', takenBy: 'Marketing Team', dateSent: '2024-10-12', expectedDate: '2024-10-18', status: 'In Progress', notes: 'Button response issue.' },
    { id: 9, productId: 24, productCode: 'PRD024', productName: 'Epson EcoTank Printer', center: 'Printer Fixers', contact: '9444011122', takenBy: 'Admin Team', dateSent: '2024-10-15', expectedDate: '2024-10-25', status: 'Pending', notes: 'Ink feed calibration.' },
    { id: 10, productId: 20, productCode: 'PRD020', productName: 'Panasonic Document Scanner', center: 'Scanner Repair Co.', contact: '9444013344', takenBy: 'Sales Team', dateSent: '2024-10-18', expectedDate: '2024-10-28', status: 'In Progress', notes: 'Feeder mechanism check.' },
  ],
  history: [
    { id: 1, productCode: 'PRD002', productName: 'HP LaserJet Pro', action: 'Assigned', employee: 'Ramesh Kumar', date: '2024-01-10', returnDate: '2024-07-10', notes: 'Assigned for office use' },
    { id: 2, productCode: 'PRD004', productName: 'Blue Star 1.5T AC', action: 'Assigned', employee: 'Priya Sharma', date: '2023-12-05', returnDate: '', notes: 'Conference room AC' },
    { id: 3, productCode: 'PRD005', productName: 'Lenovo ThinkPad', action: 'Damaged', employee: '—', date: '2024-05-20', returnDate: '', notes: 'Screen cracked after a fall.' },
    { id: 4, productCode: 'PRD007', productName: 'Mechanical Keyboard', action: 'Repair', employee: '—', date: '2024-06-01', returnDate: '', notes: 'Keys not registering.' },
    { id: 5, productCode: 'PRD008', productName: 'Samsung Galaxy Tab S7', action: 'Assigned', employee: 'Vikram Patel', date: '2024-02-18', returnDate: '2024-10-18', notes: 'Assigned for field support' },
    { id: 6, productCode: 'PRD011', productName: 'Logitech C920 Webcam', action: 'Assigned', employee: 'Arjun Das', date: '2024-04-05', returnDate: '2024-10-05', notes: 'Assigned to developer workstation' },
    { id: 7, productCode: 'PRD013', productName: 'HP EliteBook 840', action: 'Assigned', employee: 'Nidhi Rao', date: '2024-05-10', returnDate: '2025-01-10', notes: 'Procurement review laptop' },
    { id: 8, productCode: 'PRD019', productName: 'Philips 24-inch Monitor', action: 'Assigned', employee: 'Sneha Iyer', date: '2024-06-20', returnDate: '', notes: 'Sales demo display' },
    { id: 9, productCode: 'PRD010', productName: 'Canon imageCLASS MF3010', action: 'Damaged', employee: '—', date: '2024-07-02', returnDate: '', notes: 'Paper jam caused feeder damage' },
    { id: 10, productCode: 'PRD012', productName: 'BenQ MX535 Projector', action: 'Damaged', employee: '—', date: '2024-08-05', returnDate: '', notes: 'Lens cover broken during transport' },
    { id: 11, productCode: 'PRD016', productName: 'Brother DCP-T820W', action: 'Repair', employee: '—', date: '2024-08-01', returnDate: '', notes: 'Sent for ink system cleaning' },
    { id: 12, productCode: 'PRD011', productName: 'Logitech C920 Webcam', action: 'Repair', employee: '—', date: '2024-09-12', returnDate: '', notes: 'Auto-focus issue sent for repair' },
  ],
  nextId: { emp: 17, cat: 12, prod: 25, assign: 11, dmg: 11, repair: 11, history: 13 }
};

let editingId = { emp: null, cat: null, prod: null };
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
  available: 1,
  availableQuery: '',
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
    let matchesDate = true;
    if (tableState.employeeJoinFrom || tableState.employeeJoinTo) {
      const joinDate = e.joinDate ? new Date(e.joinDate) : null;
      if (joinDate) {
        if (tableState.employeeJoinFrom && joinDate < new Date(tableState.employeeJoinFrom)) matchesDate = false;
        if (tableState.employeeJoinTo && joinDate > new Date(tableState.employeeJoinTo)) matchesDate = false;
      } else {
        matchesDate = false;
      }
    }
    return matchesQuery && matchesStatus && matchesDate;
  }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

function getFilteredProducts() {
  return db.products.filter(p => {
    const query = tableState.productQuery;
    const matchesQuery = !query || [p.code, p.name, p.cat, p.brand]
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

// Employee date filter
function filterEmployeesByDate() {
  tableState.employeeJoinFrom = document.getElementById('emp-join-from').value;
  tableState.employeeJoinTo = document.getElementById('emp-join-to').value;
  renderEmployees(1);
}

function clearEmployeeDateFilter() {
  const fromEl = document.getElementById('emp-join-from');
  const toEl = document.getElementById('emp-join-to');
  if (fromEl) fromEl.value = '';
  if (toEl) toEl.value = '';
  tableState.employeeJoinFrom = '';
  tableState.employeeJoinTo = '';
  renderEmployees(1);
}

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
  else if (key === 'available') renderAvailable(page);
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
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  const titles = { dashboard: 'Dashboard', employees: 'Employees', categories: 'Categories', products: 'Products', items: 'Category Items', assigned: 'Assigned Products', available: 'Available Products', damaged: 'Damage Reports', repair: 'Repair Tracking', history: 'Product History' };
  document.getElementById('page-title').textContent = titles[page] || page;

  // Clear global search input value and tableState queries when navigating
  tableState.employeeQuery = '';
  tableState.productQuery = '';
  tableState.categoryQuery = '';
  tableState.assignedQuery = '';
  tableState.availableQuery = '';
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
  if (page === 'categories') renderCategories();
  if (page === 'products') renderProducts();
  if (page === 'items') renderItemsPage();
  if (page === 'assigned') renderAssigned();
  if (page === 'available') renderAvailable();
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
  const prods = db.assignments.filter(a => a.employeeId === id);
  document.getElementById('emp-detail-body').innerHTML = `
    <div class="detail-section">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        <div class="avatar" style="width:52px;height:52px;font-size:18px;background:${COLORS[e.id % COLORS.length]}">${e.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
        <div><div style="font-size:17px;font-weight:700">${e.name}</div><div style="font-size:12px;color:var(--text-secondary)">${e.role} · ${e.dept}</div></div>
      </div>
      <h4>Basic Information</h4>
      <div class="detail-grid">
        <div class="detail-item"><div class="di-label">Employee Code</div><div class="di-value">${e.code}</div></div>
        <div class="detail-item"><div class="di-label">Status</div><div class="di-value"><span class="badge badge-${e.status.toLowerCase()}">${e.status}</span></div></div>
        <div class="detail-item"><div class="di-label">Email</div><div class="di-value">${e.email}</div></div>
        <div class="detail-item"><div class="di-label">Phone</div><div class="di-value">${e.phone}</div></div>
        <div class="detail-item"><div class="di-label">Blood Group</div><div class="di-value">${e.blood}</div></div>
        <div class="detail-item"><div class="di-label">Joining Date</div><div class="di-value">${formatDate(e.joinDate)}</div></div>
        ${e.resignDate ? `<div class="detail-item"><div class="di-label">Resignation Date</div><div class="di-value">${formatDate(e.resignDate)}</div></div>` : ''}
        <div class="detail-item full" style="grid-column:1/-1"><div class="di-label">Address</div><div class="di-value">${e.address}</div></div>
      </div>
    </div>
    <div class="detail-section">
      <h4>Current Products (${prods.length})</h4>
      ${prods.length ? prods.map(a => `<div style="background:var(--bg);border-radius:7px;padding:10px 12px;margin-bottom:8px;font-size:13px;">
        <strong>${a.productName}</strong> <span style="color:var(--text-secondary);">(${a.productCode})</span> — Since ${formatDate(a.assignedDate)}
      </div>`).join('') : '<p style="font-size:13px;color:var(--text-secondary)">No products assigned.</p>'}
    </div>`;
  openModal('emp-detail-modal');
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
  document.getElementById('ef-resign').value = e.resignDate;
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

  const emp = {
    id: editingId.emp || db.nextId.emp++,
    code, name, dept, role, email,
    phone,
    blood: document.getElementById('ef-blood').value.trim(),
    status,
    joinDate: document.getElementById('ef-join').value,
    resignDate: document.getElementById('ef-resign').value,
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
  closeModal('emp-modal');
  editingId.emp = null;
  document.getElementById('emp-modal-title').textContent = 'Add Employee';
  renderEmployees();
  updateBadges();
}

function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  db.employees = db.employees.filter(x => x.id !== id);
  showToast('Employee deleted.', 'success');
  renderEmployees(); updateBadges();
}

// ===================== CATEGORIES =====================
let selectedCategoryTags = [];

function renderCategoryTags() {
  const list = document.getElementById('cf-tags-list');
  if (!list) return;

  list.innerHTML = selectedCategoryTags.map(tag => `
    <span class="tag-badge">
      ${tag}
      <span class="tag-remove" onclick="removeCategoryTag('${tag.replace(/'/g, "\\'")}')">&times;</span>
    </span>
  `).join('');

  updateCategorySuggestions();
}

function handleCategoryTagKeypress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addCategoryCustomTag();
  }
}

function addCategoryCustomTag() {
  const input = document.getElementById('cf-tag-input');
  if (!input) return;
  const value = input.value.trim();
  if (value) {
    if (!selectedCategoryTags.includes(value)) {
      selectedCategoryTags.push(value);
      input.value = '';
      renderCategoryTags();
    } else {
      showToast('Item already added.', 'error');
    }
  }
}

function removeCategoryTag(tag) {
  selectedCategoryTags = selectedCategoryTags.filter(t => t !== tag);
  renderCategoryTags();
}

function updateCategorySuggestions() {
  const nameInput = document.getElementById('cf-name');
  const wrapper = document.getElementById('cf-suggestions-wrapper');
  const list = document.getElementById('cf-suggestions-list');
  if (!nameInput || !wrapper || !list) return;

  const typedName = nameInput.value.trim().toLowerCase();
  let suggestions = [];

  if (typedName.includes('computer') || typedName.includes('pc')) {
    suggestions = ['CPU', 'Mouse', 'Monitor', 'Keyboard', 'Mic'];
  } else if (typedName.includes('laptop')) {
    suggestions = ['Mouse', 'Mic', 'Charger', 'Bag'];
  } else if (typedName.includes('chair')) {
    suggestions = ['Normal Chair', 'Roll Chair', 'Executive Chair'];
  }

  // Filter out suggestions that are already selected
  const availableSuggestions = suggestions.filter(item => !selectedCategoryTags.includes(item));

  if (availableSuggestions.length > 0) {
    wrapper.style.display = 'block';
    list.innerHTML = availableSuggestions.map(item => `
      <span class="suggestion-tag" style="background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:4px 10px; font-size:11px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; color:var(--text-primary); font-weight:500; transition:all .15s;" onclick="addCategorySuggestion('${item.replace(/'/g, "\\'")}')" onmouseover="this.style.borderColor='var(--accent)'; this.style.color='var(--accent)';" onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--text-primary)';">
        + ${item}
      </span>
    `).join('');
  } else {
    wrapper.style.display = 'none';
    list.innerHTML = '';
  }
}

function addCategorySuggestion(item) {
  if (!selectedCategoryTags.includes(item)) {
    selectedCategoryTags.push(item);
    renderCategoryTags();
  }
}

let openedCatFromProduct = false;
function openCategoryModalFromProduct() {
  openedCatFromProduct = true;
  openCategoryModal();
}

function openCategoryModal() {
  if (!openedCatFromProduct) {
    openedCatFromProduct = false;
  }
  editingId.cat = null;
  document.getElementById('cat-modal-title').textContent = 'Add Category';
  document.getElementById('cf-name').value = '';
  const tagInput = document.getElementById('cf-tag-input');
  if (tagInput) tagInput.value = '';
  selectedCategoryTags = [];
  renderCategoryTags();
  openModal('cat-modal');
}

// Bind Category Add button
const catOpenBtn = document.querySelector('[onclick="openModal(\'cat-modal\')"]');
if (catOpenBtn) {
  catOpenBtn.onclick = openCategoryModal;
}

// Inline Category Form Functions
let selectedInlineCategoryTags = [];

function toggleInlineCategory(show) {
  const container = document.getElementById('inline-cat-container');
  if (!container) return;
  if (show) {
    container.style.display = 'block';
    document.getElementById('inline-cf-name').value = '';
    const tagInput = document.getElementById('inline-cf-tag-input');
    if (tagInput) tagInput.value = '';
    selectedInlineCategoryTags = [];
    renderInlineCategoryTags();
    document.getElementById('inline-cf-name').focus();
  } else {
    container.style.display = 'none';
  }
}

function renderInlineCategoryTags() {
  const list = document.getElementById('inline-cf-tags-list');
  if (!list) return;

  list.innerHTML = selectedInlineCategoryTags.map(tag => `
    <span class="tag-badge">
      ${tag}
      <span class="tag-remove" onclick="removeInlineCategoryTag('${tag.replace(/'/g, "\\'")}')">&times;</span>
    </span>
  `).join('');

  updateInlineCategorySuggestions();
}

function handleInlineCategoryTagKeypress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addInlineCategoryCustomTag();
  }
}

function addInlineCategoryCustomTag() {
  const input = document.getElementById('inline-cf-tag-input');
  if (!input) return;
  const value = input.value.trim();
  if (value) {
    if (!selectedInlineCategoryTags.includes(value)) {
      selectedInlineCategoryTags.push(value);
      input.value = '';
      renderInlineCategoryTags();
    } else {
      showToast('Item already added.', 'error');
    }
  }
}

function removeInlineCategoryTag(tag) {
  selectedInlineCategoryTags = selectedInlineCategoryTags.filter(t => t !== tag);
  renderInlineCategoryTags();
}

function updateInlineCategorySuggestions() {
  const nameInput = document.getElementById('inline-cf-name');
  const wrapper = document.getElementById('inline-cf-suggestions-wrapper');
  const list = document.getElementById('inline-cf-suggestions-list');
  if (!nameInput || !wrapper || !list) return;

  const typedName = nameInput.value.trim().toLowerCase();
  let suggestions = [];

  if (typedName.includes('computer') || typedName.includes('pc')) {
    suggestions = ['CPU', 'Mouse', 'Monitor', 'Keyboard', 'Mic'];
  } else if (typedName.includes('laptop')) {
    suggestions = ['Mouse', 'Mic', 'Charger', 'Bag'];
  } else if (typedName.includes('chair')) {
    suggestions = ['Normal Chair', 'Roll Chair', 'Executive Chair'];
  }

  // Filter out suggestions that are already selected
  const availableSuggestions = suggestions.filter(item => !selectedInlineCategoryTags.includes(item));

  if (availableSuggestions.length > 0) {
    wrapper.style.display = 'block';
    list.innerHTML = availableSuggestions.map(item => `
      <span class="suggestion-tag" style="background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:4px 10px; font-size:11px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; color:var(--text-primary); font-weight:500; transition:all .15s;" onclick="addInlineCategorySuggestion('${item.replace(/'/g, "\\'")}')" onmouseover="this.style.borderColor='var(--accent)'; this.style.color='var(--accent)';" onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--text-primary)';">
        + ${item}
      </span>
    `).join('');
  } else {
    wrapper.style.display = 'none';
    list.innerHTML = '';
  }
}

function addInlineCategorySuggestion(item) {
  if (!selectedInlineCategoryTags.includes(item)) {
    selectedInlineCategoryTags.push(item);
    renderInlineCategoryTags();
  }
}

function saveInlineCategory() {
  const name = document.getElementById('inline-cf-name').value.trim();
  if (!name) { showToast('Category name required.', 'error'); return; }

  const exists = db.categories.some(c => (typeof c === 'string' ? c : c.name).toLowerCase() === name.toLowerCase());
  if (exists) { showToast('Category already exists.', 'error'); return; }

  const catObj = {
    name: name,
    items: [...selectedInlineCategoryTags]
  };

  db.categories.push(catObj);
  showToast('Category added.', 'success');

  toggleInlineCategory(false);
  selectedInlineCategoryTags = [];
  
  populateCategorySelects();
  
  // Auto-select the newly added category in the product select dropdown
  const pfCat = document.getElementById('pf-cat');
  if (pfCat) {
    pfCat.value = name;
  }

  // Refresh categories view if open
  renderCategories();
}

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
    tbody.innerHTML = '<tr><td colspan="3"><div class="empty-state"><p>No categories found.</p></div></td></tr>';
    updateTableInfo('cat-table-info', 0, 0, 0);
    renderPagination('cat', total, page);
    return;
  }

  tbody.innerHTML = pageItems.map((cat, i) => {
    const index = start + i;
    const catName = typeof cat === 'string' ? cat : cat.name;
    const catItems = (cat && cat.items) ? cat.items : [];
    const count = db.products.filter(p => p.cat === catName).length;
    return `<tr>
      <td>${index + 1}</td>
      <td><span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${COLORS[index % COLORS.length]};display:inline-block"></span>${catName}</span></td>
      <td>
        <div><strong>${count}</strong> products</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">
          ${catItems.length ? `Related: ${catItems.join(', ')}` : 'No related items'}
        </div>
      </td>
    </tr>`;
  }).join('');

  updateTableInfo('cat-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('cat', total, page);
}

function editCategory(catName) {
  openedCatFromProduct = false;
  editingId.cat = catName;
  document.getElementById('cat-modal-title').textContent = 'Edit Category';
  const cat = db.categories.find(c => (typeof c === 'string' ? c : c.name) === catName);
  if (!cat) return;
  const nameVal = typeof cat === 'string' ? cat : cat.name;
  const catItems = typeof cat === 'string' ? [] : (cat.items || []);
  document.getElementById('cf-name').value = nameVal;
  selectedCategoryTags = [...catItems];
  renderCategoryTags();
  openModal('cat-modal');
}

function saveCategory() {
  const name = document.getElementById('cf-name').value.trim();
  if (!name) { showToast('Category name required.', 'error'); return; }

  const catObj = {
    name: name,
    items: [...selectedCategoryTags],
    updatedAt: Date.now()
  };

  if (editingId.cat !== null) {
    const idx = db.categories.findIndex(c => (typeof c === 'string' ? c : c.name) === editingId.cat);
    if (idx !== -1) {
      db.categories[idx] = catObj;
    }
    showToast('Category updated.', 'success');
  } else {
    const exists = db.categories.some(c => (typeof c === 'string' ? c : c.name).toLowerCase() === name.toLowerCase());
    if (exists) { showToast('Category already exists.', 'error'); return; }
    db.categories.push(catObj);
    showToast('Category added.', 'success');
  }
  closeModal('cat-modal');
  editingId.cat = null;
  selectedCategoryTags = [];
  document.getElementById('cat-modal-title').textContent = 'Add Category';
  document.getElementById('cf-name').value = '';
  renderCategories();
  populateCategorySelects();

  if (openedCatFromProduct) {
    const pfCat = document.getElementById('pf-cat');
    if (pfCat) {
      pfCat.value = name;
    }
    openedCatFromProduct = false;
  }
}

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

function deleteCategory(catName) {
  if (!confirm('Delete this category?')) return;
  db.categories = db.categories.filter(c => (typeof c === 'string' ? c : c.name) !== catName);
  showToast('Category deleted.', 'success');
  renderCategories(); populateCategorySelects();
}

// ===================== CATEGORY ITEMS (ITEMS PAGE) =====================
function renderItemsPage() {
  const select = document.getElementById('item-cat-select');
  if (!select) return;

  const currentSelection = select.value;
  
  // Populate categories dropdown
  let html = '<option value="">Select category...</option>';
  db.categories.forEach((cat, index) => {
    const catName = typeof cat === 'string' ? cat : cat.name;
    html += `<option value="${index}">${catName}</option>`;
  });
  select.innerHTML = html;

  // Restore previous selection if valid
  if (currentSelection && select.querySelector(`option[value="${currentSelection}"]`)) {
    select.value = currentSelection;
  } else {
    select.value = '';
  }
  
  onItemCategoryChange();
}

function onItemCategoryChange() {
  const select = document.getElementById('item-cat-select');
  const insertWrapper = document.getElementById('item-insert-wrapper');
  const listContainer = document.getElementById('items-list-container');
  const badgesContainer = document.getElementById('category-items-badges');
  
  if (!select || !insertWrapper || !listContainer || !badgesContainer) return;
  
  const catIndex = select.value;
  if (catIndex === '') {
    insertWrapper.style.display = 'none';
    listContainer.style.display = 'none';
    badgesContainer.innerHTML = '';
    return;
  }
  
  insertWrapper.style.display = 'block';
  listContainer.style.display = 'block';
  
  const cat = db.categories[catIndex];
  const items = cat.items || [];
  
  if (items.length === 0) {
    badgesContainer.innerHTML = '<span style="font-size: 13px; color: var(--text-secondary); font-style: italic; width: 100%; text-align: center;">No related items configured yet.</span>';
  } else {
    badgesContainer.innerHTML = items.map((item, idx) => `
      <span class="tag-badge" style="background: var(--accent-light); color: var(--accent); border: 1px solid rgba(59, 130, 246, 0.2); padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 12px; display: inline-flex; align-items: center; gap: 8px;">
        ${item}
        <span class="tag-remove" style="cursor: pointer; font-weight: bold; font-size: 14px; line-height: 1;" onclick="removeRelatedObject(${idx})">&times;</span>
      </span>
    `).join('');
  }
}

function addRelatedObject() {
  const select = document.getElementById('item-cat-select');
  const input = document.getElementById('new-related-object');
  if (!select || !input) return;
  
  const catIndex = select.value;
  if (catIndex === '') {
    showToast('Please select a category first.', 'error');
    return;
  }
  
  const newItem = input.value.trim();
  if (!newItem) {
    showToast('Please enter an item name.', 'error');
    return;
  }
  
  const cat = db.categories[catIndex];
  if (!cat.items) {
    cat.items = [];
  }
  
  // Case-insensitive check to avoid duplicates
  if (cat.items.some(item => item.toLowerCase() === newItem.toLowerCase())) {
    showToast('Item already exists in this category.', 'error');
    return;
  }
  
  cat.items.push(newItem);
  cat.updatedAt = Date.now();
  input.value = '';
  showToast(`Added "${newItem}" to category "${cat.name}".`, 'success');
  
  onItemCategoryChange();
  populateCategorySelects();
}

function removeRelatedObject(itemIdx) {
  const select = document.getElementById('item-cat-select');
  if (!select) return;
  
  const catIndex = select.value;
  if (catIndex === '') return;
  
  const cat = db.categories[catIndex];
  const items = cat.items || [];
  const removedItem = items[itemIdx];
  
  if (confirm(`Remove "${removedItem}" from category "${cat.name}"?`)) {
    items.splice(itemIdx, 1);
    cat.updatedAt = Date.now();
    showToast(`Removed "${removedItem}" from category "${cat.name}".`, 'success');
    onItemCategoryChange();
    populateCategorySelects();
  }
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
      <td>${p.cat}${p.subCat ? ` (${p.subCat})` : ''}</td>
      <td><strong>${p.name}</strong></td>
      <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${p.code}</code></td>
      <td>${p.brand}</td>
      <td><span style="font-size:11px;color:var(--text-secondary)">${p.serial}</span></td>
      <td>${statusBadge(p.status)}</td>
      <td>${p.qty}</td>
      <td>${formatDate(p.purchaseDate)}</td>
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
  const history = db.history.filter(h => h.productCode === p.code);
  document.getElementById('prod-detail-body').innerHTML = `
    <div class="detail-section">
      <h4>Product Information</h4>
      <div class="detail-grid">
        <div class="detail-item"><div class="di-label">Product Code</div><div class="di-value">${p.code}</div></div>
        <div class="detail-item"><div class="di-label">Name</div><div class="di-value">${p.name}</div></div>
        <div class="detail-item"><div class="di-label">Category</div><div class="di-value">${p.cat}${p.subCat ? ` (${p.subCat})` : ''}</div></div>
        <div class="detail-item"><div class="di-label">Brand</div><div class="di-value">${p.brand}</div></div>
        <div class="detail-item"><div class="di-label">Serial No.</div><div class="di-value">${p.serial}</div></div>
        <div class="detail-item"><div class="di-label">Status</div><div class="di-value">${statusBadge(p.status)}</div></div>
        <div class="detail-item"><div class="di-label">Quantity</div><div class="di-value">${p.qty}</div></div>
        <div class="detail-item"><div class="di-label">Purchase Date</div><div class="di-value">${formatDate(p.purchaseDate)}</div></div>
      </div>
    </div>
    <div class="detail-section">
      <h4>Assignment History (${history.length})</h4>
      ${history.length ? `<table style="width:100%;font-size:12px;">
        <thead><tr><th style="text-align:left;padding:6px 8px;background:var(--bg);font-weight:600;color:var(--text-secondary)">Action</th><th style="text-align:left;padding:6px 8px;background:var(--bg);font-weight:600;color:var(--text-secondary)">Employee</th><th style="text-align:left;padding:6px 8px;background:var(--bg);font-weight:600;color:var(--text-secondary)">Date</th><th style="text-align:left;padding:6px 8px;background:var(--bg);font-weight:600;color:var(--text-secondary)">Notes</th></tr></thead>
        <tbody>${history.map(h => `<tr><td style="padding:7px 8px">${h.action}</td><td style="padding:7px 8px">${h.employee}</td><td style="padding:7px 8px">${formatDate(h.date)}</td><td style="padding:7px 8px;color:var(--text-secondary)">${h.notes}</td></tr>`).join('')}</tbody>
      </table>` : '<p style="font-size:13px;color:var(--text-secondary)">No history records.</p>'}
    </div>`;
  openModal('prod-detail-modal');
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

function addCustomProductTag() {
  const input = document.getElementById('pf-custom-item');
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    showToast('Please enter an item name.', 'error');
    return;
  }
  if (!selectedProductTags.includes(value)) {
    selectedProductTags.push(value);
    input.value = '';
    renderProductTags();
    populateProductTagsSelect();
  } else {
    showToast('Item already added.', 'error');
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
  const container = document.getElementById('product-dynamic-fields-container');
  const pfQty = document.getElementById('pf-qty');
  const pfCode = document.getElementById('pf-code');
  if (!container) return;

  selectedProductTags = [];

  container.innerHTML = '';
  container.style.display = 'none';

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
    container.innerHTML = `
      <div class="form-group" style="margin-bottom:0; display:flex; flex-direction:column; gap:10px;">
        <label style="font-weight: 600; color: var(--text-primary);">Related Items / Accessories *</label>
        <div id="pf-tags-list" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
        
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <!-- Pre-configured Items Select Dropdown -->
          <select id="pf-select-item" onchange="addProductTag(this.value)" style="flex:1; min-width:180px; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--text-primary); font-size:13px;">
          </select>
          
          <span style="font-size:12px; color:var(--text-secondary); font-weight:600;">or</span>
          
          <!-- Custom item manual text input -->
          <div style="display:flex; flex:1.2; min-width:200px; gap:6px;">
            <input type="text" id="pf-custom-item" placeholder="Type custom accessory..." style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--white); color:var(--text-primary); font-size:13px;" onkeypress="if(event.key==='Enter'){ event.preventDefault(); addCustomProductTag(); }">
            <button type="button" class="btn btn-secondary" onclick="addCustomProductTag()" style="padding:0 12px; height:38px; border-radius:8px; font-size:13px; font-weight:600;">Add</button>
          </div>
        </div>
      </div>
    `;
    container.style.display = 'block';
    populateProductTagsSelect();
    renderProductTags();

    // Auto-fill quantity = count of related items in category (Chair is manual)
    if (cat !== 'Chair' && editingId.prod === null) {
      const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name) === cat);
      const itemCount = (catObj && catObj.items) ? catObj.items.length : 0;
      if (pfQty) {
        pfQty.value = itemCount > 0 ? itemCount : '';
      }
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
  
  // Reset PC parts
  selectedPCParts = [];

  // Render and populate subcategory
  onProductCategoryChange();
  if (p.cat === 'PC') {
    if (p.subCat) {
      selectedPCParts = p.subCat.split(',').map(s => s.trim()).filter(Boolean);
    }
    renderPCPartTags();
  } else if (p.cat === 'Laptop') {
    const subcatEl = document.getElementById('pf-subcat-custom');
    if (subcatEl) subcatEl.value = p.subCat || '';
  } else if (p.cat === 'Chair') {
    const subcatEl = document.getElementById('pf-subcat-chair');
    if (subcatEl) subcatEl.value = p.subCat || '';
  }

  document.getElementById('pf-brand').value = p.brand || '';
  document.getElementById('pf-date').value = p.purchaseDate || '';
  document.getElementById('pf-qty').value = p.qty || '';
  document.getElementById('pf-status').value = p.status || '';
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
  document.getElementById('pf-brand').value = '';
  document.getElementById('pf-date').value = '';
  document.getElementById('pf-qty').value = '';
  document.getElementById('pf-status').value = '';

  // Clear and hide dynamic fields wrapper container
  const container = document.getElementById('product-dynamic-fields-container');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }

  // Reset selected product tags
  selectedProductTags = [];

  openModal('prod-modal');
}

function saveProduct() {
  const code = document.getElementById('pf-code').value.trim();
  const name = document.getElementById('pf-name').value.trim();
  const status = document.getElementById('pf-status').value;
  if (!code || !name) { showToast('Code and Name are required.', 'error'); return; }
  if (!status) { showToast('Please choose a status.', 'error'); return; }
  
  const cat = document.getElementById('pf-cat').value;
  let subCat = '';

  if (cat === 'PC') {
    if (selectedPCParts.length === 0) {
      showToast('Please select at least one related item for PC.', 'error');
      return;
    }
    subCat = selectedPCParts.join(', ');
  } else if (cat === 'Laptop') {
    const el = document.getElementById('pf-subcat-custom');
    if (el) {
      subCat = el.value.trim();
      if (!subCat) {
        showToast('Please enter a related item name.', 'error');
        return;
      }
      
      // Auto-add Laptop items to db.categories so it's assignable
      const laptopCat = db.categories.find(c => c.name === 'Laptop');
      if (laptopCat) {
        if (!laptopCat.items) laptopCat.items = [];
        // Add if not already present (case-insensitive check)
        const exists = laptopCat.items.some(item => item.toLowerCase() === subCat.toLowerCase());
        if (!exists) {
          laptopCat.items.push(subCat);
          laptopCat.updatedAt = Date.now();
        }
      }
    }
  } else if (cat === 'Chair') {
    const el = document.getElementById('pf-subcat-chair');
    if (el) {
      subCat = el.value;
      if (!subCat) {
        showToast('Please select a chair type.', 'error');
        return;
      }
    }
  }

  const prod = {
    id: editingId.prod || db.nextId.prod++,
    code, name,
    cat,
    subCat,
    brand: document.getElementById('pf-brand').value.trim(),
    serial: '',
    purchaseDate: document.getElementById('pf-date').value,
    qty: parseInt(document.getElementById('pf-qty').value) || 1,
    status,
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
  closeModal('prod-modal');
  editingId.prod = null;
  document.getElementById('prod-modal-title').textContent = 'Add Product';
  renderProducts(); updateBadges();
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  db.products = db.products.filter(x => x.id !== id);
  showToast('Product deleted.', 'success');
  renderProducts(); updateBadges();
}

// ===================== ASSIGNMENTS =====================
let selectedAssignItems = [];
let activeAssignItem = '';
let assignedProductsMap = {};

function suggestEmployees(query) {
  const container = document.getElementById('af-emp-suggestions');
  const hiddenInput = document.getElementById('af-emp');
  if (!container) return;

  if (!query.trim()) {
    container.innerHTML = '';
    container.style.display = 'none';
    hiddenInput.value = '';
    return;
  }

  const filtered = db.employees.filter(e =>
    e.status === 'Active' &&
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="autocomplete-suggestion" style="color:var(--text-secondary);cursor:default;">No active employees found</div>';
    container.style.display = 'block';
    hiddenInput.value = '';
    return;
  }

  container.innerHTML = filtered.map(e => `
    <div class="autocomplete-suggestion" onclick="selectEmployeeSuggestion(${e.id}, '${e.name.replace(/'/g, "\\'")}', '${e.code}')">
      <strong>${e.name}</strong> (${e.code}) - <span style="font-size:11px;color:var(--text-secondary);">${e.dept}</span>
    </div>
  `).join('');
  container.style.display = 'block';
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

function addAssignItemTag(value) {
  if (!value) return;
  if (!selectedAssignItems.includes(value)) {
    selectedAssignItems.push(value);
    activeAssignItem = value;
    document.getElementById('af-item-select').value = '';
    renderAssignItemTags();
    // Trigger suggestions dropdown for available products of this accessory automatically
    setTimeout(() => {
      suggestAssignProducts('', 'name');
    }, 100);
  }
}

function removeAssignItemTag(item) {
  const category = document.getElementById('af-cat').value;
  if (item === category) {
    showToast('Cannot remove the main category item.', 'error');
    return;
  }
  selectedAssignItems = selectedAssignItems.filter(i => i !== item);
  delete assignedProductsMap[item];
  if (activeAssignItem === item) {
    activeAssignItem = selectedAssignItems[selectedAssignItems.length - 1] || '';
  }
  renderAssignItemTags();
}

function setActiveAssignItem(item) {
  activeAssignItem = item;
  renderAssignItemTags();
  // Trigger suggestions dropdown for available products of this item automatically
  setTimeout(() => {
    suggestAssignProducts('', 'name');
  }, 100);
}

function suggestAssignProducts(query, source) {
  const nameSuggestions = document.getElementById('af-prod-name-suggestions');
  const codeSuggestions = document.getElementById('af-prod-code-suggestions');
  if (!nameSuggestions || !codeSuggestions) return;

  // Close the other suggestion box
  if (source === 'name') {
    codeSuggestions.innerHTML = '';
    codeSuggestions.style.display = 'none';
  } else {
    nameSuggestions.innerHTML = '';
    nameSuggestions.style.display = 'none';
  }

  const activeContainer = source === 'name' ? nameSuggestions : codeSuggestions;

  const category = document.getElementById('af-cat').value;
  if (!category) {
    activeContainer.innerHTML = '<div class="autocomplete-suggestion" style="color:var(--text-secondary);cursor:default;">Select Category first</div>';
    activeContainer.style.display = 'block';
    return;
  }

  // Resolve allowed categories/items
  const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name).toLowerCase() === category.toLowerCase());
  const items = [category];
  if (catObj && catObj.items && Array.isArray(catObj.items)) {
    catObj.items.forEach(item => {
      if (!items.includes(item)) {
        items.push(item);
      }
    });
  }

  // Filter available products
  const products = db.products.filter(p => {
    // Matches typed query (empty query matches all)
    const matchesQuery = !query.trim() || (
      source === 'name' ?
        p.name.toLowerCase().includes(query.toLowerCase()) :
        p.code.toLowerCase().includes(query.toLowerCase())
    );

    // Category check
    let matchesCategory = false;
    if (activeAssignItem) {
      matchesCategory = p.cat.toLowerCase() === activeAssignItem.toLowerCase() || 
        (p.subCat && p.subCat.toLowerCase().split(',').map(s => s.trim()).includes(activeAssignItem.toLowerCase()));
    } else {
      matchesCategory = items.map(itm => itm.toLowerCase()).includes(p.cat.toLowerCase()) || 
        (p.subCat && p.subCat.toLowerCase().split(',').map(s => s.trim()).some(sub => items.map(itm => itm.toLowerCase()).includes(sub)));
    }

    // Status check
    const isAvailable = p.status === 'Available';

    // Not selected in other items
    const activeProductId = activeAssignItem ? assignedProductsMap[activeAssignItem] : null;
    const selectedProductIds = Object.entries(assignedProductsMap)
      .filter(([itm, id]) => itm !== activeAssignItem)
      .map(([itm, id]) => id);
    const isNotSelectedElsewhere = !selectedProductIds.includes(p.id);

    return matchesQuery && matchesCategory && (isAvailable || p.id === activeProductId) && isNotSelectedElsewhere;
  });

  if (products.length === 0) {
    activeContainer.innerHTML = '<div class="autocomplete-suggestion" style="color:var(--text-secondary);cursor:default;">No matching products found</div>';
    activeContainer.style.display = 'block';
    return;
  }

  activeContainer.innerHTML = products.map(p => `
    <div class="autocomplete-suggestion" onclick="selectAssignProductSuggestion(${p.id})">
      <strong>${source === 'name' ? p.name : p.code}</strong> (${source === 'name' ? p.code : p.name}) - <span style="font-size:11px;color:var(--text-secondary);">${p.cat}</span>
    </div>
  `).join('');
  activeContainer.style.display = 'block';
}

function toggleAssignProductSuggestions(source) {
  const nameInput = document.getElementById('af-prod-name-search');
  const codeInput = document.getElementById('af-prod-code-search');
  const targetInput = source === 'name' ? nameInput : codeInput;
  const targetSuggestions = document.getElementById(source === 'name' ? 'af-prod-name-suggestions' : 'af-prod-code-suggestions');

  if (targetSuggestions.style.display === 'block') {
    targetSuggestions.style.display = 'none';
  } else {
    targetInput.focus();
    suggestAssignProducts(targetInput.value, source);
  }
}

function selectAssignProductSuggestion(pId) {
  const p = db.products.find(x => x.id === parseInt(pId));
  if (!p) return;

  // Hide suggestion boxes
  const nameSuggestions = document.getElementById('af-prod-name-suggestions');
  const codeSuggestions = document.getElementById('af-prod-code-suggestions');
  if (nameSuggestions) {
    nameSuggestions.innerHTML = '';
    nameSuggestions.style.display = 'none';
  }
  if (codeSuggestions) {
    codeSuggestions.innerHTML = '';
    codeSuggestions.style.display = 'none';
  }

  // Determine if activeAssignItem is set, otherwise resolve it from the product's category
  let itemToAssign = activeAssignItem;
  if (!itemToAssign) {
    const category = document.getElementById('af-cat').value;
    const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name).toLowerCase() === category.toLowerCase());
    const items = [category];
    if (catObj && catObj.items && Array.isArray(catObj.items)) {
      catObj.items.forEach(item => {
        if (!items.includes(item)) {
          items.push(item);
        }
      });
    }

    const matchingItem = items.find(itm => itm.toLowerCase() === p.cat.toLowerCase());
    if (matchingItem) {
      itemToAssign = matchingItem;
      if (!selectedAssignItems.includes(itemToAssign)) {
        selectedAssignItems.push(itemToAssign);
      }
      activeAssignItem = itemToAssign;
    } else {
      showToast(`Product category ${p.cat} is not compatible with the selected main category.`, 'error');
      return;
    }
  }

  assignedProductsMap[itemToAssign] = p.id;

  document.getElementById('af-prod-name-search').value = p.name;
  document.getElementById('af-prod-code-search').value = p.code;

  renderAssignItemTags();
}

function renderAssignItemTags() {
  const list = document.getElementById('af-item-tags-list');
  const nameInput = document.getElementById('af-prod-name-search');
  const codeInput = document.getElementById('af-prod-code-search');
  const itemSelect = document.getElementById('af-item-select');
  if (!list || !nameInput || !codeInput) return;

  const category = document.getElementById('af-cat').value;

  // Render Item tags
  list.innerHTML = selectedAssignItems.map(item => {
    const isActive = item === activeAssignItem;
    const pId = assignedProductsMap[item];
    const p = pId ? db.products.find(prod => prod.id === parseInt(pId)) : null;
    const displayName = p ? `${item}: ${p.name} (${p.code})` : item;

    const bg = isActive ? 'var(--accent)' : 'var(--accent-light)';
    const color = isActive ? 'white' : 'var(--accent)';
    const borderColor = isActive ? 'var(--accent)' : 'rgba(59, 130, 246, 0.2)';
    const removeColor = isActive ? 'white' : 'var(--text-secondary)';

    const isMainCategory = item === category;
    const removeButton = isMainCategory ? '' : `<span class="tag-remove" style="color:${removeColor}; font-weight:bold; font-size:12px; cursor:pointer;" onclick="event.stopPropagation(); removeAssignItemTag('${item.replace(/'/g, "\\'")}')">&times;</span>`;

    return `
      <span class="tag-badge" style="background:${bg}; color:${color}; border-color:${borderColor}; cursor:pointer; padding:4px 10px; border-radius:100px; display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600;" onclick="setActiveAssignItem('${item.replace(/'/g, "\\'")}')">
        ${displayName}
        ${removeButton}
      </span>
    `;
  }).join('');

  // Update Item Select Dropdown to exclude already selected items and main category
  if (category && itemSelect) {
    const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name).toLowerCase() === category.toLowerCase());
    const items = (catObj && catObj.items && Array.isArray(catObj.items)) ? catObj.items : [];
    const availableItems = items.filter(item => !selectedAssignItems.includes(item));
    itemSelect.innerHTML = '<option value="">Select Item...</option>' +
      availableItems.map(item => `<option value="${item}">${item}</option>`).join('');
    itemSelect.value = '';
  }

  // Update search input values based on active item's product mapping
  if (activeAssignItem) {
    const activeProductId = assignedProductsMap[activeAssignItem];
    const p = activeProductId ? db.products.find(prod => prod.id === activeProductId) : null;
    if (p) {
      nameInput.value = p.name;
      codeInput.value = p.code;
    } else {
      nameInput.value = '';
      codeInput.value = '';
    }
  } else {
    nameInput.value = '';
    codeInput.value = '';
  }

  updateAssignUnits();
}

function onAssignCategoryChange() {
  selectedAssignItems = [];
  activeAssignItem = '';
  assignedProductsMap = {};

  const category = document.getElementById('af-cat').value;
  const itemSelect = document.getElementById('af-item-select');
  if (!itemSelect) return;

  if (!category) {
    itemSelect.innerHTML = '<option value="">Select Category first</option>';
    itemSelect.value = '';
    renderAssignItemTags();
    return;
  }

  const catObj = db.categories.find(c => (typeof c === 'string' ? c : c.name).toLowerCase() === category.toLowerCase());
  
  // Set category itself as the first selected item and make it active
  selectedAssignItems = [category];
  activeAssignItem = category;

  // Populate Item select with ONLY related items (excluding category itself)
  const relatedItems = (catObj && catObj.items && Array.isArray(catObj.items)) ? catObj.items : [];
  itemSelect.innerHTML = '<option value="">Select Item...</option>' +
    relatedItems.map(item => `<option value="${item}">${item}</option>`).join('');
  itemSelect.value = '';

  renderAssignItemTags();

  // Trigger suggestions dropdown for available products of this category automatically
  setTimeout(() => {
    suggestAssignProducts('', 'name');
  }, 100);
}

function updateAssignUnits() {
  const unitsInput = document.getElementById('af-units');
  if (unitsInput) {
    unitsInput.value = selectedAssignItems.length;
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

function clearAssignProduct(type) {
  if (activeAssignItem) {
    delete assignedProductsMap[activeAssignItem];
  }
  document.getElementById('af-prod-name-search').value = '';
  document.getElementById('af-prod-code-search').value = '';
  
  const nameSug = document.getElementById('af-prod-name-suggestions');
  const codeSug = document.getElementById('af-prod-code-suggestions');
  if (nameSug) { nameSug.innerHTML = ''; nameSug.style.display = 'none'; }
  if (codeSug) { codeSug.innerHTML = ''; codeSug.style.display = 'none'; }
  
  renderAssignItemTags();
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
  const filtered = [...db.assignments].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
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
        ${isReturned
        ? `<span class="badge badge-available" style="padding:4px 8px; font-size:10px; font-weight:700;">Returned</span>`
        : `<button class="btn btn-secondary" style="font-size:11px;padding:4px 10px;" onclick="returnProduct(${a.id})">Return</button>`
      }
        <button class="btn-icon del" style="margin-left:4px;" onclick="deleteAssignment(${a.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </td>
    </tr>`;
  }).join('');

  updateTableInfo('assign-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('assign', total, page);
}

function openAssignModal() {
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

  selectedAssignItems = [];
  activeAssignItem = '';
  assignedProductsMap = {};
  onAssignCategoryChange();

  document.getElementById('af-date').value = today();
  openModal('assign-modal');
}

function saveAssignment() {
  const empId = parseInt(document.getElementById('af-emp').value);
  if (!empId) { showToast('Please search and select an employee from suggestions.', 'error'); return; }
  const emp = db.employees.find(e => e.id === empId);
  if (!emp) { showToast('Selected employee not found.', 'error'); return; }

  const category = document.getElementById('af-cat').value;
  if (!category) { showToast('Select a category.', 'error'); return; }

  if (selectedAssignItems.length === 0) { showToast('Please select at least one item.', 'error'); return; }

  const unselectedItems = selectedAssignItems.filter(item => !assignedProductsMap[item]);
  if (unselectedItems.length > 0) {
    showToast(`Please select a product for: ${unselectedItems.join(', ')}`, 'error');
    return;
  }

  const selectedProductIds = Object.values(assignedProductsMap);
  const selectedProducts = selectedProductIds.map(pId => db.products.find(p => p.id === pId)).filter(Boolean);
  const prodNames = selectedProducts.map(p => p.name).join(', ');
  const prodCodes = selectedProducts.map(p => p.code).join(', ');
  const units = selectedProductIds.length;
  const assignedDate = document.getElementById('af-date').value || today();
  const returnDate = '';

  const a = {
    id: db.nextId.assign++,
    productIds: [...selectedProductIds],
    productId: selectedProductIds[0] || null,
    productName: prodNames,
    productCode: prodCodes,
    employeeId: empId,
    employeeName: emp.name,
    dept: emp.dept,
    assignedDate: assignedDate,
    returnDate: returnDate,
    units: units,
    updatedAt: Date.now()
  };

  db.assignments.push(a);

  // Set all selected products status to Assigned
  selectedProducts.forEach(prod => {
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
      notes: `Assigned to ${emp.name} (Part of assignment bundle)`,
      updatedAt: Date.now()
    });
  });

  closeModal('assign-modal');
  showToast('Products assigned successfully.', 'success');
  renderAssigned();
  updateBadges();
  renderDashboard();
}

function returnProduct(id) {
  const a = db.assignments.find(x => x.id === id);
  if (!a) return;
  if (!confirm(`Mark "${a.productName}" as returned?`)) return;

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

  showToast('Products returned to inventory.', 'success');
  renderAssigned();
  updateBadges();
  renderDashboard();
}

function deleteAssignment(id) {
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
  renderAssigned();
  updateBadges();
}

// Override the toolbar button
document.querySelector('[onclick="openModal(\'assign-modal\')"]').onclick = openAssignModal;

// ===================== AVAILABLE =====================
function renderAvailable(page = tableState.available) {
  tableState.available = page;
  const query = (tableState.availableQuery || '').trim().toLowerCase();
  let avail = db.products.filter(p => p.status === 'Available');
  if (query) {
    avail = avail.filter(p => [p.name, p.code, p.brand, p.cat, p.serial].some(val => val.toLowerCase().includes(query)));
  }
  avail.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const grid = document.getElementById('available-grid');
  const total = avail.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = avail.slice(start, start + PAGE_SIZE);

  if (!total) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg><p>No available products at this time.</p></div>';
    updateTableInfo('available-table-info', 0, 0, 0);
    renderPagination('available', total, page);
    return;
  }

  grid.innerHTML = pageItems.map((p, i) =>
    `<div class="product-card">
      <div class="pc-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
      </div>
      <h4>${p.name}</h4>
      <div class="pc-code">${p.code}</div>
      <div class="pc-meta">
        <span><strong>Category:</strong> ${p.cat}${p.subCat ? ` (${p.subCat})` : ''}</span>
        <span><strong>Brand:</strong> ${p.brand}</span>
        <span><strong>Qty:</strong> ${p.qty}</span>
        <span><strong>Serial:</strong> ${p.serial}</span>
      </div>
      <div style="margin-top:10px">${statusBadge(p.status)}</div>
    </div>`
  ).join('');

  updateTableInfo('available-table-info', start + 1, Math.min(start + pageItems.length, total), total);
  renderPagination('available', total, page);
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
  closeModal('dmg-modal');
  showToast('Damage reported.', 'success');
  renderDamaged(); updateBadges();
  renderDashboard();
}

function deleteDamage(id) {
  if (!confirm('Delete this damage report?')) return;
  db.damages = db.damages.filter(x => x.id !== id);
  showToast('Report deleted.', 'success');
  renderDamaged(); updateBadges();
  renderDashboard();
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
  
  // Show all products if empty, or filter if not
  const filtered = q
    ? db.products.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    : db.products;

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
        <div class="repair-meta-item"><div class="rm-label">Expected Return</div><div class="rm-value">${formatDate(r.expectedDate)}</div></div>
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
  db.history.push({ id: db.nextId.history++, productCode: prod.code, productName: prod.name, action: 'Repair', employee: '—', date: r.dateSent, notes: `Sent to ${r.center}`, updatedAt: Date.now() });
  closeModal('repair-modal');
  showToast('Repair record added.', 'success');
  renderRepair(); updateBadges();
  renderDashboard();
}

function deleteRepair(id) {
  if (!confirm('Delete this repair record?')) return;
  db.repairs = db.repairs.filter(x => x.id !== id);
  showToast('Record deleted.', 'success');
  renderRepair();
  renderDashboard();
}

function completeRepair(id) {
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
  showToast('Repair completed. Product available.', 'success');
  renderRepair(); updateBadges();
  renderDashboard();
}

function openRepairModal() {
  document.getElementById('rf-prod').value = '';
  document.getElementById('rf-prod-search').value = '';
  document.getElementById('rf-prod-suggestions').style.display = 'none';
  document.getElementById('rf-center').value = '';
  document.getElementById('rf-contact').value = '';
  document.getElementById('rf-taken').value = '';
  document.getElementById('rf-expected').value = '';
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
  
  // Show all products if empty, or filter if not
  const filtered = q
    ? db.products.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    : db.products;

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

  const actionColor = { Assigned: 'var(--accent)', Returned: 'var(--success)', Damaged: 'var(--danger)', Repair: 'var(--warning)', Added: 'var(--purple)', Repaired: 'var(--success)' };
  tbody.innerHTML = pageItems.map(h =>
    `<tr>
      <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:11px;">${h.productCode}</code></td>
      <td>${h.productName}</td>
      <td><span style="color:${actionColor[h.action] || 'var(--text-secondary)'};font-weight:600;font-size:12px;">${h.action}</span></td>
      <td>${h.employee}</td>
      <td>${formatDate(h.date)}</td>
      <td>${h.returnDate ? formatDate(h.returnDate) : '<span style="color:var(--text-secondary);font-size:11px">—</span>'}</td>
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
      filterTable('assign-table', query, [0, 1, 2]);
      break;
    case 'available':
      tableState.availableQuery = query;
      renderAvailable(1);
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
    case 'assign-search': filterTable('assign-table', '', [0, 1, 2]); break;
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
renderDashboard();
updateBadges();

document.addEventListener('click', function (e) {
  const empWrapper = document.getElementById('af-emp-wrapper');
  const suggestions = document.getElementById('af-emp-suggestions');
  if (empWrapper && !empWrapper.contains(e.target) && suggestions) {
    suggestions.style.display = 'none';
  }

  // Product suggestions close on click outside
  const prodNameGroup = document.getElementById('af-prod-name-group');
  const nameSug = document.getElementById('af-prod-name-suggestions');
  if (prodNameGroup && !prodNameGroup.contains(e.target) && nameSug) {
    nameSug.style.display = 'none';
  }

  const prodCodeGroup = document.getElementById('af-prod-code-group');
  const codeSug = document.getElementById('af-prod-code-suggestions');
  if (prodCodeGroup && !prodCodeGroup.contains(e.target) && codeSug) {
    codeSug.style.display = 'none';
  }

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

