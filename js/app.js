/**
 * HorlSM - Main Application Controller
 */

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function showPage(pageId) {
  if (typeof AppController !== 'undefined' && AppController.showPage) {
    AppController.showPage(pageId);
  }
}

function toggleSidebar() {
  if (typeof AppController !== 'undefined' && AppController.toggleSidebar) {
    AppController.toggleSidebar();
  } else {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('-translate-x-full');
    if (overlay) overlay.classList.toggle('hidden');
  }
}

window.showPage = showPage;
window.toggleSidebar = toggleSidebar;
window.openModal = openModal;
window.closeModal = closeModal;

// ===== កាលវិភាគ GLOBAL STATE =====
let schedules = JSON.parse(localStorage.getItem('sms_schedules')) || [
  { id:1, className:'ថ្នាក់ទី១០', day:'monday', period:'07:00-08:00', subject:'គណិតវិទ្យា', teacher:'សុខ វណ្ណា', room:'A1' },
  { id:2, className:'ថ្នាក់ទី១០', day:'monday', period:'08:00-09:00', subject:'ភាសាអង់គ្លេស', teacher:'លី សុភា', room:'A1' },
  { id:3, className:'ថ្នាក់ទី១០', day:'tuesday', period:'07:00-08:00', subject:'រូបវិទ្យា', teacher:'ចាន់ ដារ៉ា', room:'Lab1' },
  { id:4, className:'ថ្នាក់ទី១០', day:'wednesday', period:'09:00-10:00', subject:'ភាសាខ្មែរ', teacher:'ណាត សុខា', room:'A2' },
  { id:5, className:'ថ្នាក់ទី១០', day:'friday', period:'14:00-15:00', subject:'កីឡា', teacher:'ពេជ្រ ម៉ាលី', room:'Field' },
];

const PERIODS = [
  '07:00-08:00','08:00-09:00','09:00-10:00',
  '10:15-11:15','11:15-12:15',
  '14:00-15:00','15:00-16:00','16:00-17:00'
];
const DAYS = ['monday','tuesday','wednesday','thursday','friday'];
const DAY_LABELS = { monday:'ច័ន្ទ', tuesday:'អង្គារ', wednesday:'ពុធ', thursday:'ព្រហស្បតិ៍', friday:'សុក្រ' };

function getSubjectClass(subject) {
  const map = {
    'គណិតវិទ្យា':'sub-math', 'ភាសាខ្មែរ':'sub-khmer', 'ភាសាអង់គ្លេស':'sub-english',
    'រូបវិទ្យា':'sub-physics', 'គីមីវិទ្យា':'sub-chem', 'ជីវវិទ្យា':'sub-bio',
    'ប្រវត្តិវិទ្យា':'sub-history', 'ភូមិវិទ្យា':'sub-geo', 'កីឡា':'sub-sport', 'សិល្បៈ':'sub-art'
  };
  return map[subject] || 'sub-default';
}

function renderSchedule() {
  schedules = JSON.parse(localStorage.getItem('sms_schedules')) || schedules;
  const cls = document.getElementById('scheduleClass')?.value || 'ថ្នាក់ទី១០';
  const labelEl = document.getElementById('scheduleClassLabel');
  if (labelEl) labelEl.textContent = cls;

  const filtered = schedules.filter(s => s.className === cls);
  const tbody = document.getElementById('scheduleBody');
  if (!tbody) return;

  tbody.innerHTML = PERIODS.map(period => {
    const cells = DAYS.map(day => {
      const item = filtered.find(s => s.day === day && s.period === period);
      if (!item) {
        return `<td class="sch-cell text-center text-gray-300 text-xs">—</td>`;
      }
      return `<td class="sch-cell">
        <div class="sch-block ${getSubjectClass(item.subject)}" onclick="editSchedule(${item.id})" title="ចុចដើម្បីកែ">
          <div class="sch-subject">${item.subject}</div>
          <div class="sch-teacher">${item.teacher || ''}</div>
          <div class="sch-room">${item.room || ''}</div>
        </div>
      </td>`;
    }).join('');
    return `<tr>
      <td class="px-3 py-2 font-medium text-gray-600 bg-gray-50 border-b text-xs whitespace-nowrap">${period}</td>
      ${cells}
    </tr>`;
  }).join('');
}

// ហៅពេលបើក Schedule Modal
function fillTeacherDropdown() {
  const sel = document.getElementById('schTeacher');
  if (!sel) return;
  const current = sel.value;
  teachers = JSON.parse(localStorage.getItem('sms_teachers')) || (typeof teachers !== 'undefined' ? teachers : []);
  sel.innerHTML = '<option value="">— ជ្រើសរើសគ្រូ —</option>' +
    teachers
      .filter(t => t.status === 'កំពុងធ្វើការ')
      .map(t => `<option value="${t.name}">${t.name} (${t.subject})</option>`)
      .join('');
  if (current) sel.value = current;
}

function openScheduleModal() {
  document.getElementById('schId').value = '';
  document.getElementById('scheduleModalTitle').textContent = 'បន្ថែមម៉ោងសិក្សា';
  document.getElementById('schClass').value = document.getElementById('scheduleClass')?.value || 'ថ្នាក់ទី១០';
  document.getElementById('schTeacher').value = '';
  fillTeacherDropdown();
  document.getElementById('schRoom').value = '';
  openModal('scheduleModal');
}

function editSchedule(id) {
  schedules = JSON.parse(localStorage.getItem('sms_schedules')) || schedules;
  const s = schedules.find(x => x.id === id);
  if (!s) return;
  document.getElementById('schId').value = s.id;
  document.getElementById('schClass').value = s.className;
  document.getElementById('schDay').value = s.day;
  document.getElementById('schPeriod').value = s.period;
  document.getElementById('schSubject').value = s.subject;
  fillTeacherDropdown();
  document.getElementById('schTeacher').value = s.teacher || '';
  document.getElementById('schRoom').value = s.room || '';
  document.getElementById('scheduleModalTitle').textContent = 'កែម៉ោងសិក្សា';
  openModal('scheduleModal');
}

function saveSchedule(e) {
  e.preventDefault();
  schedules = JSON.parse(localStorage.getItem('sms_schedules')) || schedules;
  const id = document.getElementById('schId').value;
  const data = {
    className: document.getElementById('schClass').value,
    day: document.getElementById('schDay').value,
    period: document.getElementById('schPeriod').value,
    subject: document.getElementById('schSubject').value,
    teacher: document.getElementById('schTeacher').value.trim(),
    room: document.getElementById('schRoom').value.trim()
  };

  // លុបចាស់បើមាន slot តែមួយ (ថ្នាក់+ថ្ងៃ+ម៉ោង)
  schedules = schedules.filter(s =>
    !(s.className === data.className && s.day === data.day && s.period === data.period && s.id != id)
  );

  if (id) {
    const i = schedules.findIndex(x => x.id == id);
    if (i >= 0) schedules[i] = { ...schedules[i], ...data, id: Number(id) };
  } else {
    schedules.push({ id: Date.now(), ...data });
  }

  localStorage.setItem('sms_schedules', JSON.stringify(schedules));
  if (window.store) window.store.data.schedule = schedules;
  closeModal('scheduleModal');
  // ប្តូរទៅថ្នាក់ដែលទើបរក្សា
  document.getElementById('scheduleClass').value = data.className;
  renderSchedule();
}

class AppController {
  static init() {
    this.currentTab = 'dashboard';
    this.setupDateDisplay();
    this.startClock();
    this.updateDashboard();
    
    // Initial tax calculation
    this.calculateTaxLive();

    if (window.appCharts && window.appCharts.initDashboardCharts) {
      window.appCharts.initDashboardCharts(window.store);
    }

    // Auto load from Firebase if window.db is configured
    if (window.db && window.firestoreFns) {
      this.loadStudentsFromFirebase().catch(() => {});
    }
  }

  static startClock() {
    const updateClock = () => {
      const clockEl = document.getElementById('clock') || document.getElementById('currentTime');
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString('km-KH', { hour12: false });
      }
    };
    setInterval(updateClock, 1000);
    updateClock();
  }

  static setupDateDisplay() {
    const dateEls = document.querySelectorAll('#currentDate, #current-date, #todayDate');
    const formatted = new Date().toLocaleDateString('km-KH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateEls.forEach(el => { if (el) el.textContent = formatted; });

    const dashDateEl = document.getElementById('dashDate');
    if (dashDateEl) {
      dashDateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  // --- Mobile Sidebar Helper ---
  static closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  }

  static toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  }

  // --- Firebase Auth Helpers ---
  static async login(email, password) {
    if (!window.auth) throw new Error('Firebase Auth unavailable');
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    await signInWithEmailAndPassword(window.auth, email, password);
  }

  static logout() {
    if (window.auth) {
      window.auth.signOut();
    }
  }

  // --- Router / Tab Navigation ---
  static showPage(pageId) {
    this.currentTab = pageId;

    // Auto-close mobile sidebar when navigating
    if (window.innerWidth < 768) {
      this.closeMobileSidebar();
    }

    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.classList.add('hidden');
    });

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      targetPage.classList.add('active');
    }

    document.querySelectorAll('.sidebar-link').forEach(link => {
      const onclickAttr = link.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'${pageId}'`) || onclickAttr.includes(`"${pageId}"`)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const titles = {
      dashboard: 'ផ្ទាំងគ្រប់គ្រង',
      students: 'គ្រប់គ្រងសិស្ស',
      teachers: 'គ្រប់គ្រងគ្រូបង្រៀន',
      staff: 'គ្រប់គ្រងមន្ត្រី',
      attendance: 'Check-in / Check-out',
      attReport: 'របាយការណ៍វត្តមានប្រចាំខែ',
      fees: 'ថ្លៃសិក្សា',
      scores: 'ពិន្ទុសិស្ស',
      reports: '📈 របាយការណ៍ពិន្ទុ',
      honor: '🏆 តារាងកិត្តិយស',
      salary: 'ប្រាក់ខែ & ពន្ធ (GDT)',
      payroll: 'របាយការណ៍ប្រាក់ខែ',
      schedule: 'កាលវិភាគសិក្សា'
    };

    const titleEl = document.getElementById('pageTitle') || document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titles[pageId] || '';

    try {
      if (pageId === 'dashboard') this.updateDashboard();
      if (pageId === 'students') this.renderStudents();
      if (pageId === 'teachers') renderTeachers();
      if (pageId === 'staff') this.renderStaff();
      if (pageId === 'attendance') this.renderAttendance();
      if (pageId === 'attReport') {
        initAttReportFilters();
        renderAttReportSafe();
      }
      if (pageId === 'fees') this.renderFees();
      if (pageId === 'scores') this.renderScores();
      if (pageId === 'reports') this.renderReport();
      if (pageId === 'honor') this.renderHonor();
      if (pageId === 'salary') this.calculateTaxLive();
      if (pageId === 'payroll') {
        initPayrollFilters();
        renderPayroll();
      }
      if (pageId === 'schedule') renderSchedule();
    } catch (err) {
      console.warn(`Error rendering page ${pageId}:`, err);
    }
  }

  // --- Modal Helpers ---
  static openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  static closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  // --- Toast System ---
  static showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="text-lg">${icon}</span>
      <span class="flex-1 font-medium">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Dashboard Renderer ---
  static updateDashboard() {
    const students = window.store.getStudents();
    const teachers = window.store.getTeachers();
    const staff = window.store.getStaff();
    const invoices = window.store.getInvoices();
    const scores = window.store.getScores();

    const pendingInvoices = invoices.filter(i => (i.paid || 0) < (i.total || 0)).length;

    const elStu = document.getElementById('dashStudents') || document.getElementById('stat-total-students');
    if (elStu) elStu.textContent = students.length;
    const elTch = document.getElementById('dashTeachers') || document.getElementById('stat-total-teachers');
    if (elTch) elTch.textContent = teachers.length;
    const elStf = document.getElementById('dashStaff') || document.getElementById('stat-total-staff');
    if (elStf) elStf.textContent = staff.length;
    const elFee = document.getElementById('dashPendingFees') || document.getElementById('stat-unpaid-students');
    if (elFee) elFee.textContent = pendingInvoices;
    const elSco = document.getElementById('dashScores');
    if (elSco) elSco.textContent = scores.length;

    const dashDateEl = document.getElementById('dashDate');
    if (dashDateEl) {
      dashDateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  // --- Firebase Integration Helpers ---
  static async loadStudentsFromFirebase() {
    if (!window.firestoreFns || !window.db) return;
    const { collection, getDocs } = window.firestoreFns;
    const snap = await getDocs(collection(window.db, 'students'));
    const fbStudents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (fbStudents.length > 0) {
      window.store.data.students = fbStudents;
      window.store.save();
    }
    this.renderStudents();
    this.updateDashboard();
  }

  static async addStudentToFirebase(data) {
    if (!window.firestoreFns || !window.db) return;
    const { collection, addDoc } = window.firestoreFns;
    await addDoc(collection(window.db, 'students'), data);
    await this.loadStudentsFromFirebase();
  }

  static async deleteStudentFromFirebase(id) {
    if (!window.firestoreFns || !window.db) return;
    const { doc, deleteDoc } = window.firestoreFns;
    await deleteDoc(doc(window.db, 'students', String(id)));
    await this.loadStudentsFromFirebase();
  }

  // --- Students Module ---
  static renderStudents() {
    const q = (document.getElementById('stuSearch')?.value || document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const students = window.store.getStudents();

    const list = students.filter(s => 
      (s.name || s.khmerName || '').toLowerCase().includes(q) || 
      (s.code || s.studentCode || '').toLowerCase().includes(q)
    );

    const body = document.getElementById('studentBody') || document.getElementById('studentTableBody');
    if (!body) return;

    if (list.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-400">មិនមានទិន្នន័យ</td></tr>`;
    } else {
      body.innerHTML = list.map((s, i) => `
        <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
          <td class="px-4 py-2.5 text-gray-500">${i + 1}</td>
          <td class="px-4 py-2.5 font-semibold text-blue-600">${s.code || s.studentCode}</td>
          <td class="px-4 py-2.5 font-medium text-gray-900">${s.name || s.khmerName}</td>
          <td class="px-4 py-2.5">${s.gender || 'ប្រុស'}</td>
          <td class="px-4 py-2.5 font-medium text-slate-700">${s.className || 'ថ្នាក់ទី១០'}</td>
          <td class="px-4 py-2.5">
            <span class="text-xs px-2.5 py-1 rounded-full font-semibold ${s.status === 'កំពុងរៀន' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">${s.status || 'កំពុងរៀន'}</span>
          </td>
          <td class="px-4 py-2.5 text-center space-x-2 no-print">
            <button onclick="AppController.editStudent('${s.id}')" class="text-blue-600 font-semibold text-xs hover:underline">កែ</button>
            <button onclick="AppController.delStudent('${s.id}')" class="text-red-600 font-semibold text-xs hover:underline">លុប</button>
          </td>
        </tr>
      `).join('');
    }
  }

  static openStudentModal() {
    const idEl = document.getElementById('stuId');
    if (idEl) idEl.value = '';
    const titleEl = document.getElementById('stuModalTitle');
    if (titleEl) titleEl.textContent = 'បន្ថែមសិស្ស';
    const form = document.querySelector('#studentModal form');
    if (form) form.reset();
    const codeEl = document.getElementById('stuCode');
    if (codeEl) codeEl.value = `STU-00${window.store.getStudents().length + 1}`;
    this.openModal('studentModal');
  }

  static editStudent(id) {
    const s = window.store.getStudents().find(x => x.id == id);
    if (!s) return;

    document.getElementById('stuId').value = s.id;
    document.getElementById('stuCode').value = s.code || s.studentCode;
    document.getElementById('stuName').value = s.name || s.khmerName;
    document.getElementById('stuGender').value = s.gender || 'ប្រុស';
    document.getElementById('stuClass').value = s.className || 'ថ្នាក់ទី១០';
    document.getElementById('stuStatus').value = s.status || 'កំពុងរៀន';

    const titleEl = document.getElementById('stuModalTitle');
    if (titleEl) titleEl.textContent = 'កែសិស្ស';
    this.openModal('studentModal');
  }

  static async saveStudent(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('stuId').value;
    const code = document.getElementById('stuCode').value.trim();
    const name = document.getElementById('stuName').value.trim();
    const gender = document.getElementById('stuGender').value;
    const className = document.getElementById('stuClass').value;
    const status = document.getElementById('stuStatus').value;

    if (!name) return;

    const data = { code, name, gender, className, status, khmerName: name, studentCode: code };

    if (id) {
      window.store.updateStudent(id, data);
    } else {
      window.store.addStudent(data);
      if (window.db && window.firestoreFns) {
        this.addStudentToFirebase(data).catch(() => {});
      }
    }

    this.closeModal('studentModal');
    this.renderStudents();
    this.updateDashboard();
  }

  static async delStudent(id) {
    if (confirm('លុបសិស្សនេះ?')) {
      window.store.deleteStudent(id);
      if (window.db && window.firestoreFns) {
        this.deleteStudentFromFirebase(id).catch(() => {});
      }
      this.renderStudents();
      this.updateDashboard();
    }
  }

// ===== ទិន្នន័យគ្រូ GLOBAL STATE =====
let teachers = JSON.parse(localStorage.getItem('sms_teachers')) || [
  { id: 1, code: 'TCH-001', name: 'សុខ វណ្ណា', latin: 'Sok Vanna', gender: 'ប្រុស', subject: 'គណិតវិទ្យា', role: 'គ្រូបន្ទុកថ្នាក់', phone: '012 111 222', email: 'vanna@school.com', status: 'កំពុងធ្វើការ' },
  { id: 2, code: 'TCH-002', name: 'លី សុភា', latin: 'Ly Sophea', gender: 'ស្រី', subject: 'ភាសាអង់គ្លេស', role: 'គ្រូបង្រៀន', phone: '098 333 444', email: 'sophea@school.com', status: 'កំពុងធ្វើការ' },
  { id: 3, code: 'TCH-003', name: 'ចាន់ ដារ៉ា', latin: 'Chan Dara', gender: 'ប្រុស', subject: 'រូបវិទ្យា', role: 'គ្រូបង្រៀន', phone: '077 555 666', email: '', status: 'កំពុងធ្វើការ' },
];

function renderTeachers() {
  teachers = JSON.parse(localStorage.getItem('sms_teachers')) || teachers;
  const q = (document.getElementById('tchSearch')?.value || '').toLowerCase();
  const sub = document.getElementById('tchFilterSubject')?.value || '';
  const st = document.getElementById('tchFilterStatus')?.value || '';

  const list = teachers.filter(t => {
    const matchQ = (t.name || '').toLowerCase().includes(q) || ((t.latin || t.latinName || '')).toLowerCase().includes(q) || (t.code || '').toLowerCase().includes(q);
    const matchSub = !sub || t.subject === sub;
    const matchSt = !st || t.status === st;
    return matchQ && matchSub && matchSt;
  });

  let active = 0, leave = 0, quit = 0;
  teachers.forEach(t => {
    if (t.status === 'កំពុងធ្វើការ') active++;
    else if (t.status === 'សម្រាក') leave++;
    else quit++;
  });
  const elTot = document.getElementById('tchTotalCount');
  if (elTot) elTot.textContent = teachers.length;
  const elAct = document.getElementById('tchActiveCount');
  if (elAct) elAct.textContent = active;
  const elLea = document.getElementById('tchLeaveCount');
  if (elLea) elLea.textContent = leave;
  const elQui = document.getElementById('tchQuitCount');
  if (elQui) elQui.textContent = quit;

  const body = document.getElementById('teacherBody') || document.getElementById('teacherTableBody');
  if (!body) return;

  body.innerHTML = list.map((t, i) => {
    const color = t.status === 'កំពុងធ្វើការ' ? 'bg-green-100 text-green-700' :
                  t.status === 'សម្រាក' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
    return `<tr class="hover:bg-blue-50/50 transition border-b border-gray-100 text-sm">
      <td class="px-4 py-2.5">${i + 1}</td>
      <td class="px-4 py-2.5 font-medium text-blue-600">${t.code}</td>
      <td class="px-4 py-2.5">
        <div class="font-medium">${t.name}</div>
        <div class="text-xs text-gray-400">${t.latin || t.latinName || ''}</div>
      </td>
      <td class="px-4 py-2.5">${t.gender}</td>
      <td class="px-4 py-2.5">${t.subject}</td>
      <td class="px-4 py-2.5">${t.role}</td>
      <td class="px-4 py-2.5">${t.phone || '—'}</td>
      <td class="px-4 py-2.5"><span class="text-xs px-2 py-0.5 rounded-full ${color}">${t.status}</span></td>
      <td class="px-4 py-2.5 text-center space-x-1">
        <button onclick="viewTeacherSchedule(${t.id})" class="text-indigo-600 hover:underline text-xs" title="កាលវិភាគ">📅</button>
        <button onclick="viewTeacherAttendance(${t.id})" class="text-emerald-600 hover:underline text-xs" title="វត្តមាន">✅</button>
        <button onclick="editTeacher(${t.id})" class="text-blue-600 hover:underline text-xs">កែ</button>
        <button onclick="delTeacher(${t.id})" class="text-red-600 hover:underline text-xs">លុប</button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" class="text-center py-8 text-gray-400">មិនមានទិន្នន័យគ្រូ</td></tr>';
}

// ===== វត្តមានគ្រូ (ភ្ជាប់ Check-in/out) =====

function getAttendanceForDate(dateKey) {
  return JSON.parse(localStorage.getItem('sms_att_' + dateKey) || '{}');
}

function getLastNDates(n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function calcAttStatus(checkIn, standardTime = '07:00', grace = 10) {
  if (!checkIn) return { text: 'អវត្តមាន', color: 'bg-red-100 text-red-700', type: 'absent' };
  const [sh, sm] = standardTime.split(':').map(Number);
  const [ch, cm] = checkIn.split(':').map(Number);
  const late = (ch * 60 + cm) - (sh * 60 + sm);
  if (late <= grace) return { text: 'មកទាន់', color: 'bg-green-100 text-green-700', type: 'ontime' };
  return { text: `យឺត ${late} នាទី`, color: 'bg-yellow-100 text-yellow-700', type: 'late' };
}

function viewTeacherAttendance(teacherId) {
  teachers = JSON.parse(localStorage.getItem('sms_teachers')) || (typeof teachers !== 'undefined' ? teachers : []);
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  document.getElementById('tchAttName').textContent = `${teacher.name} (${teacher.code}) • ${teacher.subject}`;

  // ===== ថ្ងៃនេះ =====
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayAtt = getAttendanceForDate(todayKey);
  const record = todayAtt[teacherId] || {};

  document.getElementById('tchAttIn').textContent = record.checkIn || '—';
  document.getElementById('tchAttOut').textContent = record.checkOut || '—';

  const status = calcAttStatus(record.checkIn);
  const statusEl = document.getElementById('tchAttStatus');
  statusEl.textContent = status.text;
  statusEl.className = `px-3 py-1 rounded-full text-xs font-medium ${status.color}`;

  // ប៊ូតុង Check-in / out ពី Profile
  const actionsEl = document.getElementById('tchAttActions');
  if (!record.checkIn) {
    actionsEl.innerHTML = `<button onclick="quickCheckIn(${teacherId})" class="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700">Check-in ឥឡូវ</button>`;
  } else if (!record.checkOut) {
    actionsEl.innerHTML = `<button onclick="quickCheckOut(${teacherId})" class="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700">Check-out ឥឡូវ</button>`;
  } else {
    actionsEl.innerHTML = `<span class="text-xs text-gray-400">បាន Check-in & Check-out រួច</span>`;
  }

  // ===== ស្ថិតិ + ប្រវត្តិ ១៤ ថ្ងៃ =====
  const dates = getLastNDates(14);
  let ontime = 0, late = 0, absent = 0;

  const historyHtml = dates.map(dateKey => {
    const att = getAttendanceForDate(dateKey);
    const rec = att[teacherId] || {};
    const st = calcAttStatus(rec.checkIn);

    if (st.type === 'ontime') ontime++;
    else if (st.type === 'late') late++;
    else absent++;

    const d = new Date(dateKey + 'T00:00:00');
    const dayName = d.toLocaleDateString('km-KH', { weekday: 'short' });
    const dateLabel = d.toLocaleDateString('km-KH', { day: 'numeric', month: 'short' });

    return `<div class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm">
      <div class="w-24 text-gray-500 text-xs">
        <div class="font-medium text-gray-700">${dayName}</div>
        <div>${dateLabel}</div>
      </div>
      <div class="flex-1">
        <span class="text-green-600 font-mono text-xs">${rec.checkIn || '—'}</span>
        <span class="text-gray-300 mx-1">→</span>
        <span class="text-blue-600 font-mono text-xs">${rec.checkOut || '—'}</span>
      </div>
      <span class="px-2 py-0.5 rounded-full text-xs ${st.color}">${st.text}</span>
    </div>`;
  }).join('');

  document.getElementById('tchAttOnTime').textContent = ontime;
  document.getElementById('tchAttLate').textContent = late;
  document.getElementById('tchAttAbsent').textContent = absent;
  document.getElementById('tchAttHistory').innerHTML = historyHtml;

  openModal('teacherAttModal');
}

// Check-in / out ពី Profile គ្រូ
function quickCheckIn(teacherId) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const att = getAttendanceForDate(todayKey);
  att[teacherId] = {
    checkIn: new Date().toTimeString().slice(0, 5),
    checkOut: null
  };
  localStorage.setItem('sms_att_' + todayKey, JSON.stringify(att));

  // sync អថេរ attendance បើមាន
  if (typeof attendance !== 'undefined') {
    attendance[teacherId] = att[teacherId];
  }

  viewTeacherAttendance(teacherId);
  if (typeof renderAttendance === 'function') renderAttendance();
}

function quickCheckOut(teacherId) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const att = getAttendanceForDate(todayKey);
  if (!att[teacherId] || !att[teacherId].checkIn) return;

  att[teacherId].checkOut = new Date().toTimeString().slice(0, 5);
  localStorage.setItem('sms_att_' + todayKey, JSON.stringify(att));

  if (typeof attendance !== 'undefined') {
    attendance[teacherId] = att[teacherId];
  }

  viewTeacherAttendance(teacherId);
  if (typeof renderAttendance === 'function') renderAttendance();
}

const TCH_PERIODS = [
  '07:00-08:00','08:00-09:00','09:00-10:00',
  '10:15-11:15','11:15-12:15',
  '14:00-15:00','15:00-16:00','16:00-17:00'
];
const TCH_DAYS = ['monday','tuesday','wednesday','thursday','friday'];

function viewTeacherSchedule(teacherId) {
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  // រកកាលវិភាគដែលគ្រូនេះបង្រៀន (តាមឈ្មោះ)
  const teacherName = teacher.name;
  const mySchedules = (typeof schedules !== 'undefined' ? schedules : (JSON.parse(localStorage.getItem('sms_schedules')) || []))
    .filter(s => s.teacher && s.teacher.trim() === teacherName.trim());

  // Header info
  document.getElementById('tchSchName').textContent = `${teacher.name} (${teacher.code}) • ${teacher.subject}`;
  document.getElementById('tchSchSubject').textContent = teacher.subject;
  document.getElementById('tchSchHours').textContent = mySchedules.length + ' ម៉ោង';

  const classes = [...new Set(mySchedules.map(s => s.className))];
  document.getElementById('tchSchClasses').textContent = classes.length ? classes.join(', ') : '—';

  // Timetable grid
  const tbody = document.getElementById('tchSchBody');
  tbody.innerHTML = TCH_PERIODS.map(period => {
    const cells = TCH_DAYS.map(day => {
      const item = mySchedules.find(s => s.day === day && s.period === period);
      if (!item) {
        return `<td class="px-2 py-1.5 text-center text-gray-300 border border-gray-100">—</td>`;
      }
      return `<td class="px-1.5 py-1 border border-gray-100">
        <div class="tch-sch-block">
          <div class="cls">${item.className}</div>
          <div class="sub">${item.subject}</div>
          <div class="room">${item.room || ''}</div>
        </div>
      </td>`;
    }).join('');
    return `<tr>
      <td class="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 whitespace-nowrap">${period}</td>
      ${cells}
    </tr>`;
  }).join('');

  // បញ្ជីលម្អិត
  const dayLabel = { monday:'ច័ន្ទ', tuesday:'អង្គារ', wednesday:'ពុធ', thursday:'ព្រហស្បតិ៍', friday:'សុក្រ' };
  const listEl = document.getElementById('tchSchList');
  if (mySchedules.length === 0) {
    listEl.innerHTML = `<p class="text-sm text-gray-400 text-center py-4">មិនមានម៉ោងបង្រៀនក្នុងកាលវិភាគទេ</p>
      <p class="text-xs text-gray-400 text-center">សូមបញ្ចូលឈ្មោះគ្រូឱ្យត្រូវគ្នានៅក្នុងកាលវិភាគសិក្សា</p>`;
  } else {
    // តម្រៀបតាមថ្ងៃ + ម៉ោង
    const sorted = [...mySchedules].sort((a, b) => {
      const d = TCH_DAYS.indexOf(a.day) - TCH_DAYS.indexOf(b.day);
      if (d !== 0) return d;
      return TCH_PERIODS.indexOf(a.period) - TCH_PERIODS.indexOf(b.period);
    });
    listEl.innerHTML = sorted.map(s => `
      <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm">
        <span class="w-20 font-medium text-indigo-600">${dayLabel[s.day]}</span>
        <span class="w-28 text-gray-500 text-xs">${s.period}</span>
        <span class="flex-1 font-medium">${s.subject}</span>
        <span class="text-gray-500">${s.className}</span>
        <span class="text-gray-400 text-xs">${s.room || ''}</span>
      </div>
    `).join('');
  }

  openModal('teacherScheduleModal');
}

function openTeacherModal() {
  document.getElementById('tchId').value = '';
  document.getElementById('tchModalTitle').textContent = 'បន្ថែមគ្រូថ្មី';
  document.getElementById('tchCode').value = '';
  document.getElementById('tchName').value = '';
  document.getElementById('tchLatin').value = '';
  document.getElementById('tchPhone').value = '';
  document.getElementById('tchEmail').value = '';
  openModal('teacherModal');
}

function editTeacher(id) {
  teachers = JSON.parse(localStorage.getItem('sms_teachers')) || teachers;
  const t = teachers.find(x => x.id === id);
  if (!t) return;
  document.getElementById('tchId').value = t.id;
  document.getElementById('tchCode').value = t.code;
  document.getElementById('tchName').value = t.name;
  document.getElementById('tchLatin').value = t.latin || t.latinName || '';
  document.getElementById('tchGender').value = t.gender;
  document.getElementById('tchSubject').value = t.subject;
  document.getElementById('tchRole').value = t.role;
  document.getElementById('tchPhone').value = t.phone || '';
  document.getElementById('tchStatus').value = t.status;
  document.getElementById('tchEmail').value = t.email || '';
  document.getElementById('tchModalTitle').textContent = 'កែព័ត៌មានគ្រូ';
  openModal('teacherModal');
}

function saveTeacher(e) {
  e.preventDefault();
  teachers = JSON.parse(localStorage.getItem('sms_teachers')) || teachers;
  const id = document.getElementById('tchId').value;
  const data = {
    code: document.getElementById('tchCode').value.trim(),
    name: document.getElementById('tchName').value.trim(),
    latin: document.getElementById('tchLatin').value.trim(),
    gender: document.getElementById('tchGender').value,
    subject: document.getElementById('tchSubject').value,
    role: document.getElementById('tchRole').value,
    phone: document.getElementById('tchPhone').value.trim(),
    email: document.getElementById('tchEmail').value.trim(),
    status: document.getElementById('tchStatus').value
  };

  if (id) {
    const i = teachers.findIndex(x => x.id == id);
    if (i >= 0) teachers[i] = { ...teachers[i], ...data, id: Number(id) };
  } else {
    teachers.push({ id: Date.now(), ...data });
  }

  localStorage.setItem('sms_teachers', JSON.stringify(teachers));
  if (window.store) window.store.data.teachers = teachers;
  closeModal('teacherModal');
  renderTeachers();
  if (typeof updateDashboard === 'function') updateDashboard();
}

function delTeacher(id) {
  if (confirm('តើអ្នកពិតជាចង់លុបគ្រូនេះមែនទេ?')) {
    teachers = JSON.parse(localStorage.getItem('sms_teachers')) || teachers;
    teachers = teachers.filter(x => x.id !== id);
    localStorage.setItem('sms_teachers', JSON.stringify(teachers));
    if (window.store) window.store.data.teachers = teachers;
    renderTeachers();
    if (typeof updateDashboard === 'function') updateDashboard();
  }
}

  // --- Staff Module ---
  static renderStaff() {
    const q = (document.getElementById('stfSearch')?.value || '').toLowerCase().trim();
    const staffList = window.store.getStaff();

    const list = staffList.filter(s => 
      (s.name || s.khmerName || '').toLowerCase().includes(q) || 
      (s.code || s.staffCode || '').toLowerCase().includes(q)
    );

    const body = document.getElementById('staffBody') || document.getElementById('staffTableBody');
    if (!body) return;

    if (list.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-400">មិនមានទិន្នន័យ</td></tr>`;
    } else {
      body.innerHTML = list.map((s, i) => `
        <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
          <td class="px-4 py-2.5 text-gray-500">${i + 1}</td>
          <td class="px-4 py-2.5 font-semibold text-blue-600">${s.code || s.staffCode}</td>
          <td class="px-4 py-2.5 font-medium text-gray-900">${s.name || s.khmerName}</td>
          <td class="px-4 py-2.5 font-medium text-slate-700">${s.position}</td>
          <td class="px-4 py-2.5 text-gray-600">${s.phone || '-'}</td>
          <td class="px-4 py-2.5">
            <span class="text-xs px-2.5 py-1 rounded-full font-semibold ${s.status === 'កំពុងធ្វើការ' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">${s.status}</span>
          </td>
          <td class="px-4 py-2.5 text-center space-x-2 no-print">
            <button onclick="AppController.editStaff(${s.id})" class="text-blue-600 font-semibold text-xs hover:underline">កែ</button>
            <button onclick="AppController.delStaff(${s.id})" class="text-red-600 font-semibold text-xs hover:underline">លុប</button>
          </td>
        </tr>
      `).join('');
    }
  }

  static openStaffModal() {
    const idEl = document.getElementById('stfId');
    if (idEl) idEl.value = '';
    const titleEl = document.getElementById('stfModalTitle');
    if (titleEl) titleEl.textContent = 'បន្ថែមមន្ត្រី';
    const form = document.querySelector('#staffModal form');
    if (form) form.reset();
    const codeEl = document.getElementById('stfCode');
    if (codeEl) codeEl.value = `STF-00${window.store.getStaff().length + 1}`;
    this.openModal('staffModal');
  }

  static editStaff(id) {
    const s = window.store.getStaff().find(x => x.id == id);
    if (!s) return;

    document.getElementById('stfId').value = s.id;
    document.getElementById('stfCode').value = s.code || s.staffCode;
    document.getElementById('stfName').value = s.name || s.khmerName;
    document.getElementById('stfPosition').value = s.position;
    document.getElementById('stfPhone').value = s.phone || '';
    document.getElementById('stfStatus').value = s.status;

    const titleEl = document.getElementById('stfModalTitle');
    if (titleEl) titleEl.textContent = 'កែមន្ត្រី';
    this.openModal('staffModal');
  }

  static saveStaff(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('stfId').value;
    const code = document.getElementById('stfCode').value.trim();
    const name = document.getElementById('stfName').value.trim();
    const position = document.getElementById('stfPosition').value;
    const phone = document.getElementById('stfPhone').value.trim();
    const status = document.getElementById('stfStatus').value;

    if (!name) return;

    if (id) {
      window.store.updateStaff(id, { code, name, position, phone, status, khmerName: name, staffCode: code });
    } else {
      window.store.addStaff({ code, name, position, phone, status, khmerName: name, staffCode: code });
    }

    this.closeModal('staffModal');
    this.renderStaff();
    this.updateDashboard();
  }

  static delStaff(id) {
    if (confirm('លុបមន្ត្រីនេះ?')) {
      window.store.deleteStaff(id);
      this.renderStaff();
      this.updateDashboard();
    }
  }

// ===== GLOBAL ATTENDANCE STATE & FUNCTIONS =====
const todayKey = new Date().toISOString().slice(0, 10);
let attendance = JSON.parse(localStorage.getItem('sms_att_' + todayKey) || '{}');

function checkIn(id) {
  const time = new Date().toTimeString().slice(0, 5);
  const tKey = new Date().toISOString().slice(0, 10);
  attendance = JSON.parse(localStorage.getItem('sms_att_' + tKey) || '{}');
  attendance[id] = { checkIn: time, checkOut: null };
  localStorage.setItem('sms_att_' + tKey, JSON.stringify(attendance));
  renderAttendance();
}

function checkOut(id) {
  const tKey = new Date().toISOString().slice(0, 10);
  attendance = JSON.parse(localStorage.getItem('sms_att_' + tKey) || '{}');
  if (!attendance[id]) return;
  attendance[id].checkOut = new Date().toTimeString().slice(0, 5);
  localStorage.setItem('sms_att_' + tKey, JSON.stringify(attendance));
  renderAttendance();
}

function renderAttendance() {
  const tKey = new Date().toISOString().slice(0, 10);
  attendance = JSON.parse(localStorage.getItem('sms_att_' + tKey) || '{}');
  const teachersList = (typeof teachers !== 'undefined' ? teachers : JSON.parse(localStorage.getItem('sms_teachers') || '[]'));

  let inC = 0, lateC = 0, absC = 0;
  const body = document.getElementById('attBody') || document.getElementById('teacherAttendanceBody');
  if (!body) return;

  body.innerHTML = teachersList.map(t => {
    const rec = attendance[t.id] || {};
    const st = calcAttStatus(rec.checkIn);

    if (rec.checkIn) {
      inC++;
      if (st.type === 'late') lateC++;
    } else {
      absC++;
    }

    return `
      <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
        <td class="px-4 py-2.5 font-semibold text-gray-900">${t.name || t.khmerName}</td>
        <td class="px-4 py-2.5 font-mono ${rec.checkIn ? 'text-green-600 font-bold' : 'text-gray-400'}">${rec.checkIn || '--:--'}</td>
        <td class="px-4 py-2.5 font-mono ${rec.checkOut ? 'text-blue-600 font-bold' : 'text-gray-400'}">${rec.checkOut || '--:--'}</td>
        <td class="px-4 py-2.5"><span class="text-xs px-2.5 py-1 rounded-full font-semibold ${st.color}">${st.text}</span></td>
        <td class="px-4 py-2.5 text-center no-print">
          ${!rec.checkIn ? `<button onclick="checkIn(${t.id})" class="bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-medium hover:bg-green-700">Check-in</button>` :
            !rec.checkOut ? `<button onclick="checkOut(${t.id})" class="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg font-medium hover:bg-blue-700">Check-out</button>` :
            '<span class="text-gray-400 text-xs font-medium">រួច</span>'}
        </td>
      </tr>
    `;
  }).join('');

  const elTot = document.getElementById('attTotal');
  if (elTot) elTot.textContent = teachersList.length;
  const elIn = document.getElementById('attIn');
  if (elIn) elIn.textContent = inC;
  const elLate = document.getElementById('attLate');
  if (elLate) elLate.textContent = lateC;
  const elAbs = document.getElementById('attAbsent');
  if (elAbs) elAbs.textContent = absC;
}

// ===== របាយការណ៍វត្តមានប្រចាំខែ =====

function initAttReportFilters() {
  const monthSel = document.getElementById('attRepMonth');
  const yearSel = document.getElementById('attRepYear');
  if (!monthSel || !yearSel) return;

  const months = [
    { v: 1, n: 'មករា' }, { v: 2, n: 'កុម្ភៈ' }, { v: 3, n: 'មីនា' },
    { v: 4, n: 'មេសា' }, { v: 5, n: 'ឧសភា' }, { v: 6, n: 'មិថុនា' },
    { v: 7, n: 'កក្កដា' }, { v: 8, n: 'សីហា' }, { v: 9, n: 'កញ្ញា' },
    { v: 10, n: 'តុលា' }, { v: 11, n: 'វិច្ឆិកា' }, { v: 12, n: 'ធ្នូ' }
  ];
  const now = new Date();
  monthSel.innerHTML = months.map(m =>
    `<option value="${m.v}" ${m.v === (now.getMonth() + 1) ? 'selected' : ''}>${m.n}</option>`
  ).join('');

  const year = now.getFullYear();
  yearSel.innerHTML = [year, year - 1].map(y =>
    `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`
  ).join('');
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function isWeekend(year, month, day) {
  const d = new Date(year, month - 1, day).getDay();
  return d === 0 || d === 6; // អាទិត្យ ឬ សៅរ៍
}

function getAttForDate(dateKey) {
  return JSON.parse(localStorage.getItem('sms_att_' + dateKey) || '{}');
}

function statusOf(checkIn, standard = '07:00', grace = 10) {
  if (!checkIn) return 'absent';
  const [sh, sm] = standard.split(':').map(Number);
  const [ch, cm] = checkIn.split(':').map(Number);
  const late = (ch * 60 + cm) - (sh * 60 + sm);
  return late <= grace ? 'ontime' : 'late';
}

function renderAttReport() {
  const mSel = document.getElementById('attRepMonth');
  if (mSel && mSel.options.length === 0) {
    initAttReportFilters();
  }

  const month = Number(document.getElementById('attRepMonth')?.value) || (new Date().getMonth() + 1);
  const year = Number(document.getElementById('attRepYear')?.value) || new Date().getFullYear();
  const daysInMonth = getDaysInMonth(year, month);

  const monthNames = ['', 'មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
  const lbl = document.getElementById('repMonthLabel');
  if (lbl) lbl.textContent = `${monthNames[month]} ${year}`;

  // ថ្ងៃធ្វើការ (ច័ន្ទ–សុក្រ)
  const workDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    if (!isWeekend(year, month, d)) {
      workDays.push(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
    }
  }

  let totalOn = 0, totalLate = 0, totalAbs = 0;

  const currentTeachers = (typeof teachers !== 'undefined' ? teachers : JSON.parse(localStorage.getItem('sms_teachers') || '[]'));

  const rows = currentTeachers.map((t, idx) => {
    let ontime = 0, late = 0, absent = 0;
    const details = [];

    workDays.forEach(dateKey => {
      const att = getAttForDate(dateKey);
      const rec = att[t.id] || {};
      const st = statusOf(rec.checkIn);
      if (st === 'ontime') ontime++;
      else if (st === 'late') late++;
      else absent++;
      details.push({ dateKey, rec, st });
    });

    totalOn += ontime;
    totalLate += late;
    totalAbs += absent;

    const present = ontime + late;
    const rate = workDays.length ? Math.round((present / workDays.length) * 100) : 0;
    const rateColor = rate >= 90 ? 'text-green-600' : rate >= 75 ? 'text-yellow-600' : 'text-red-600';

    return {
      idx: idx + 1,
      teacher: t,
      ontime, late, absent,
      workDays: workDays.length,
      rate, rateColor, details
    };
  });

  // Summary
  const elTot = document.getElementById('repTotalTeachers');
  if (elTot) elTot.textContent = currentTeachers.length;
  const elOn = document.getElementById('repOnTime');
  if (elOn) elOn.textContent = totalOn;
  const elLate = document.getElementById('repLate');
  if (elLate) elLate.textContent = totalLate;
  const elAbs = document.getElementById('repAbsent');
  if (elAbs) elAbs.textContent = totalAbs;
  const totalSlots = currentTeachers.length * workDays.length;
  const totalPresent = totalOn + totalLate;
  const elRate = document.getElementById('repRate');
  if (elRate) elRate.textContent = totalSlots ? Math.round((totalPresent / totalSlots) * 100) + '%' : '0%';

  // Table
  const tbody = document.getElementById('attReportBody');
  if (!tbody) return;

  tbody.innerHTML = rows.map(r => `
    <tr class="hover:bg-gray-50">
      <td class="px-4 py-2.5">${r.idx}</td>
      <td class="px-4 py-2.5 font-medium">${r.teacher.name}</td>
      <td class="px-4 py-2.5">${r.teacher.subject || '—'}</td>
      <td class="px-4 py-2.5 text-center">${r.workDays}</td>
      <td class="px-4 py-2.5 text-center text-green-600 font-semibold">${r.ontime}</td>
      <td class="px-4 py-2.5 text-center text-yellow-600 font-semibold">${r.late}</td>
      <td class="px-4 py-2.5 text-center text-red-600 font-semibold">${r.absent}</td>
      <td class="px-4 py-2.5 text-center font-bold ${r.rateColor}">${r.rate}%</td>
      <td class="px-4 py-2.5 text-center no-print">
        <button onclick="showAttDetailByIndex(${r.idx - 1})"
                class="text-blue-600 hover:underline text-xs">មើល</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="9" class="text-center py-8 text-gray-400">មិនមានទិន្នន័យ</td></tr>';

  // រក្សា details សម្រាប់ modal (ជៀសវាង JSON ក្នុង onclick វែង)
  window._attReportRows = rows;
}

function showAttDetailByIndex(index) {
  const r = window._attReportRows?.[index];
  if (!r) return;

  const lbl = document.getElementById('repMonthLabel');
  document.getElementById('attDetailName').textContent = `${r.teacher.name} • ${lbl ? lbl.textContent : ''}`;

  const label = { ontime: 'មកទាន់', late: 'យឺត', absent: 'អវត្តមាន' };
  const color = {
    ontime: 'bg-green-100 text-green-700',
    late: 'bg-yellow-100 text-yellow-700',
    absent: 'bg-red-100 text-red-700'
  };

  document.getElementById('attDetailList').innerHTML = r.details.map(d => {
    const dt = new Date(d.dateKey + 'T00:00:00');
    const dayName = dt.toLocaleDateString('km-KH', { weekday: 'short' });
    const dateStr = dt.toLocaleDateString('km-KH', { day: 'numeric', month: 'short' });
    return `<div class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm mb-2">
      <div class="w-24 text-xs text-gray-500">
        <div class="font-medium text-gray-700">${dayName}</div>
        <div>${dateStr}</div>
      </div>
      <div class="flex-1 font-mono text-xs">
        <span class="text-green-600">${d.rec.checkIn || '—'}</span>
        <span class="text-gray-300 mx-1">→</span>
        <span class="text-blue-600">${d.rec.checkOut || '—'}</span>
      </div>
      <span class="px-2 py-0.5 rounded-full text-xs ${color[d.st]}">${label[d.st]}</span>
    </div>`;
  }).join('');

  openModal('attDetailModal');
}

// កែ renderAttReport ផ្នែកប៊ូតុងលម្អិត (ងាយជាង)
function renderAttReportSafe() {
  renderAttReport();
  // បន្ទាប់ពី render កែប៊ូតុងឱ្យប្រើ index
  const tbody = document.getElementById('attReportBody');
  if (!tbody || !window._attReportRows) return;
  tbody.querySelectorAll('tr').forEach((tr, i) => {
    const btn = tr.querySelector('button');
    if (btn) {
      btn.onclick = () => showAttDetailByIndex(i);
      btn.removeAttribute('onclick');
    }
  });
}

// ===== ប្រាក់ខែ & របាយការណ៍ =====

// ប្រាក់មូលដ្ឋានតាមគ្រូ (localStorage)
let salaryMap = JSON.parse(localStorage.getItem('sms_salary_map') || '{}');
// ឧទាហរណ៍: { "1": 1500000, "2": 1200000 }

let payrollSettings = JSON.parse(localStorage.getItem('sms_payroll_settings') || '{}');
if (!payrollSettings.latePerMin) payrollSettings.latePerMin = 500;
if (!payrollSettings.absentPerDay) payrollSettings.absentPerDay = 50000;

// ពន្ធលើប្រាក់ខែ (កម្ពុជា - សាមញ្ញ)
function calcTax(gross, spouse = false, children = 0) {
  const deduction = (spouse ? 150000 : 0) + (children * 150000);
  let taxable = Math.max(0, gross - deduction);
  let tax = 0;
  const brackets = [
    { max: 1500000, rate: 0 },
    { max: 2000000, rate: 0.05 },
    { max: 8500000, rate: 0.10 },
    { max: 12500000, rate: 0.15 },
    { max: Infinity, rate: 0.20 }
  ];
  let remaining = taxable;
  let prev = 0;
  for (const b of brackets) {
    const amount = Math.min(remaining, b.max - prev);
    if (amount <= 0) break;
    tax += amount * b.rate;
    remaining -= amount;
    prev = b.max;
  }
  return Math.round(tax);
}

function initPayrollFilters() {
  const monthSel = document.getElementById('payMonth');
  const yearSel = document.getElementById('payYear');
  if (!monthSel) return;

  const months = [
    { v:1, n:'មករា'},{ v:2, n:'កុម្ភៈ'},{ v:3, n:'មីនា'},{ v:4, n:'មេសា'},
    { v:5, n:'ឧសភា'},{ v:6, n:'មិថុនា'},{ v:7, n:'កក្កដា'},{ v:8, n:'សីហា'},
    { v:9, n:'កញ្ញា'},{ v:10, n:'តុលា'},{ v:11, n:'វិច្ឆិកា'},{ v:12, n:'ធ្នូ'}
  ];
  const now = new Date();
  monthSel.innerHTML = months.map(m =>
    `<option value="${m.v}" ${m.v === now.getMonth()+1 ? 'selected':''}>${m.n}</option>`
  ).join('');
  const y = now.getFullYear();
  if (yearSel) {
    yearSel.innerHTML = [y, y-1].map(yy =>
      `<option value="${yy}" ${yy===y?'selected':''}>${yy}</option>`
    ).join('');
  }
}

function getMonthAttendanceStats(teacherId, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let lateMinutes = 0, absentDays = 0, lateDays = 0, ontimeDays = 0, workDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // ច័ន្ទ–សុក្រ
    workDays++;
    const key = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const att = JSON.parse(localStorage.getItem('sms_att_' + key) || '{}');
    const rec = att[teacherId] || {};

    if (!rec.checkIn) {
      absentDays++;
    } else {
      const [sh, sm] = [7, 0]; // 07:00
      const [ch, cm] = rec.checkIn.split(':').map(Number);
      const late = (ch * 60 + cm) - (sh * 60 + sm);
      if (late > 10) {
        lateDays++;
        lateMinutes += late;
      } else {
        ontimeDays++;
      }
    }
  }
  return { workDays, ontimeDays, lateDays, lateMinutes, absentDays };
}

function renderPayroll() {
  const mSel = document.getElementById('payMonth');
  if (mSel && mSel.options.length === 0) {
    initPayrollFilters();
  }

  const month = Number(document.getElementById('payMonth')?.value) || (new Date().getMonth()+1);
  const year = Number(document.getElementById('payYear')?.value) || new Date().getFullYear();
  const monthNames = ['','មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
  const lbl = document.getElementById('payMonthLabel');
  if (lbl) lbl.textContent = `${monthNames[month]} ${year}`;

  const latePerMin = payrollSettings.latePerMin || 500;
  const absentPerDay = payrollSettings.absentPerDay || 50000;

  let sumGross = 0, sumDeduct = 0, sumNet = 0;
  window._payrollRows = [];

  const currentTeachers = (typeof teachers !== 'undefined' ? teachers : JSON.parse(localStorage.getItem('sms_teachers') || '[]'));
  const activeTeachers = currentTeachers.filter(t => t.status === 'កំពុងធ្វើការ' || !t.status);

  const tbody = document.getElementById('payrollBody');
  if (!tbody) return;

  tbody.innerHTML = activeTeachers.map((t, i) => {
    const basic = Number(salaryMap[t.id]) || 1000000; // default 1,000,000៛
    const stats = getMonthAttendanceStats(t.id, year, month);

    const latePenalty = stats.lateMinutes * latePerMin;
    const absentPenalty = stats.absentDays * absentPerDay;
    const gross = basic;
    const tax = calcTax(gross);
    const totalDeduct = latePenalty + absentPenalty + tax;
    const net = Math.max(0, gross - totalDeduct);

    sumGross += gross;
    sumDeduct += totalDeduct;
    sumNet += net;

    window._payrollRows.push({
      teacher: t, basic, stats, latePenalty, absentPenalty, tax, gross, net, totalDeduct
    });

    return `<tr class="hover:bg-gray-50">
      <td class="px-3 py-2.5">${i+1}</td>
      <td class="px-3 py-2.5 font-medium">${t.name}</td>
      <td class="px-3 py-2.5">${t.role || t.subject || '—'}</td>
      <td class="px-3 py-2.5 text-right">${basic.toLocaleString()}</td>
      <td class="px-3 py-2.5 text-right text-yellow-600">${latePenalty.toLocaleString()}</td>
      <td class="px-3 py-2.5 text-right text-red-600">${absentPenalty.toLocaleString()}</td>
      <td class="px-3 py-2.5 text-right">${tax.toLocaleString()}</td>
      <td class="px-3 py-2.5 text-right font-bold text-green-700">${net.toLocaleString()}</td>
      <td class="px-3 py-2.5 text-center no-print">
        <button onclick="showPayDetail(${i})" class="text-blue-600 hover:underline text-xs">មើល</button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" class="text-center py-8 text-gray-400">មិនមានទិន្នន័យ</td></tr>';

  const elCount = document.getElementById('payCount');
  if (elCount) elCount.textContent = activeTeachers.length;
  const elGross = document.getElementById('payGrossTotal');
  if (elGross) elGross.textContent = sumGross.toLocaleString() + ' ៛';
  const elDeduct = document.getElementById('payDeductTotal');
  if (elDeduct) elDeduct.textContent = sumDeduct.toLocaleString() + ' ៛';
  const elNet = document.getElementById('payNetTotal');
  if (elNet) elNet.textContent = sumNet.toLocaleString() + ' ៛';
}

function showPayDetail(index) {
  const r = window._payrollRows?.[index];
  if (!r) return;
  document.getElementById('payDetailName').textContent = `${r.teacher.name} (${r.teacher.code || ''})`;
  document.getElementById('payDetailBody').innerHTML = `
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">ប្រាក់មូលដ្ឋាន</span><span class="font-medium">${r.basic.toLocaleString()} ៛</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">ថ្ងៃធ្វើការ</span><span>${r.stats.workDays} ថ្ងៃ</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">មកទាន់</span><span class="text-green-600">${r.stats.ontimeDays} ថ្ងៃ</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">យឺត</span><span class="text-yellow-600">${r.stats.lateDays} ថ្ងៃ (${r.stats.lateMinutes} នាទី)</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">អវត្តមាន</span><span class="text-red-600">${r.stats.absentDays} ថ្ងៃ</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">កាត់យឺត</span><span class="text-yellow-600">− ${r.latePenalty.toLocaleString()} ៛</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">កាត់អវត្តមាន</span><span class="text-red-600">− ${r.absentPenalty.toLocaleString()} ៛</span></div>
    <div class="flex justify-between py-1.5 border-b"><span class="text-gray-500">ពន្ធលើប្រាក់ខែ</span><span>− ${r.tax.toLocaleString()} ៛</span></div>
    <div class="flex justify-between py-2 mt-1 bg-green-50 rounded-lg px-2">
      <span class="font-semibold">ប្រាក់សុទ្ធ</span>
      <span class="font-bold text-green-700 text-lg">${r.net.toLocaleString()} ៛</span>
    </div>
  `;
  openModal('payDetailModal');
}

function openSalarySetting() {
  const currentTeachers = (typeof teachers !== 'undefined' ? teachers : JSON.parse(localStorage.getItem('sms_teachers') || '[]'));
  const list = document.getElementById('salarySettingList');
  if (list) {
    list.innerHTML = currentTeachers.map(t => {
      const val = salaryMap[t.id] || 1000000;
      return `<div class="flex items-center gap-3">
        <span class="flex-1 text-sm font-medium">${t.name}</span>
        <input type="number" data-id="${t.id}" value="${val}" class="salary-input w-36 border rounded-lg px-3 py-1.5 text-sm text-right">
        <span class="text-xs text-gray-400">៛</span>
      </div>`;
    }).join('');
  }

  const elLate = document.getElementById('latePenaltyPerMin');
  if (elLate) elLate.value = payrollSettings.latePerMin || 500;
  const elAbs = document.getElementById('absentPenaltyPerDay');
  if (elAbs) elAbs.value = payrollSettings.absentPerDay || 50000;
  openModal('salarySettingModal');
}

function saveSalarySettings() {
  document.querySelectorAll('.salary-input').forEach(inp => {
    salaryMap[inp.dataset.id] = Number(inp.value) || 0;
  });
  payrollSettings.latePerMin = Number(document.getElementById('latePenaltyPerMin')?.value) || 500;
  payrollSettings.absentPerDay = Number(document.getElementById('absentPenaltyPerDay')?.value) || 50000;

  localStorage.setItem('sms_salary_map', JSON.stringify(salaryMap));
  localStorage.setItem('sms_payroll_settings', JSON.stringify(payrollSettings));
  closeModal('salarySettingModal');
  renderPayroll();
}

  // --- Fees / Invoices Module ---
  static getFeeStatus(inv) {
    const total = Number(inv.total || inv.totalAmount) || 0;
    const paid = Number(inv.paid || inv.paidAmount) || 0;
    if (paid >= total && total > 0) return { key: 'paid', text: 'បានបង់គ្រប់', color: 'bg-green-100 text-green-700' };
    if (paid > 0) return { key: 'partial', text: 'បង់ខ្លះ', color: 'bg-yellow-100 text-yellow-700' };
    return { key: 'pending', text: 'នៅជំពាក់', color: 'bg-red-100 text-red-700' };
  }

  static renderFees() {
    const q = (document.getElementById('feeSearch')?.value || '').toLowerCase().trim();
    const invoices = window.store.getInvoices();

    const list = invoices.filter(i => 
      (i.student || i.studentName || '').toLowerCase().includes(q) || 
      (i.no || i.invoiceNo || '').toLowerCase().includes(q)
    );

    let paid = 0, partial = 0, pending = 0;

    const body = document.getElementById('feeBody') || document.getElementById('invoiceTableBody');
    if (!body) return;

    if (list.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-400">មិនមានទិន្នន័យ</td></tr>`;
    } else {
      body.innerHTML = list.map(inv => {
        const st = this.getFeeStatus(inv);
        const total = inv.total || inv.totalAmount;
        const paidAmt = inv.paid || inv.paidAmount;
        const remain = total - paidAmt;

        if (st.key === 'paid') paid++;
        else if (st.key === 'partial') partial++;
        else pending++;

        return `
          <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
            <td class="px-4 py-2.5 font-semibold text-blue-600">${inv.no || inv.invoiceNo}</td>
            <td class="px-4 py-2.5 font-medium text-gray-900">${inv.student || inv.studentName}</td>
            <td class="px-4 py-2.5 text-right font-semibold text-gray-900">${total.toLocaleString()}</td>
            <td class="px-4 py-2.5 text-right font-semibold text-green-600">${paidAmt.toLocaleString()}</td>
            <td class="px-4 py-2.5 text-right font-semibold text-red-600">${remain.toLocaleString()}</td>
            <td class="px-4 py-2.5"><span class="text-xs px-2.5 py-1 rounded-full font-semibold ${st.color}">${st.text}</span></td>
            <td class="px-4 py-2.5 text-center space-x-2 no-print">
              ${remain > 0 ? `<button onclick="AppController.openPay(${inv.id})" class="text-green-600 font-semibold text-xs hover:underline">បង់</button>` : ''}
              <button onclick="AppController.delFee(${inv.id})" class="text-red-600 font-semibold text-xs hover:underline">លុប</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    const elTot = document.getElementById('feeTotal');
    if (elTot) elTot.textContent = list.length;
    const elPaid = document.getElementById('feePaid');
    if (elPaid) elPaid.textContent = paid;
    const elPar = document.getElementById('feePartial');
    if (elPar) elPar.textContent = partial;
    const elPen = document.getElementById('feePending');
    if (elPen) elPen.textContent = pending;
  }

  static openFeeModal() {
    this.openModal('feeModal');
  }

  static saveFee(e) {
    if (e) e.preventDefault();
    const student = document.getElementById('feeStudent').value.trim();
    const total = Number(document.getElementById('feeAmount').value) || 0;
    const note = document.getElementById('feeNote')?.value || '';

    if (!student || total <= 0) return;

    window.store.addInvoice({ student, total, paid: 0, note });

    this.closeModal('feeModal');
    if (e.target) e.target.reset();
    this.renderFees();
    this.updateDashboard();
  }

  static openPay(id) {
    const inv = window.store.getInvoices().find(i => i.id == id);
    if (!inv) return;

    document.getElementById('payId').value = id;
    document.getElementById('payName').textContent = inv.student || inv.studentName;
    const remain = (inv.total || inv.totalAmount) - (inv.paid || inv.paidAmount);
    document.getElementById('payRemain').textContent = remain.toLocaleString();

    this.openModal('payModal');
  }

  static savePayment(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('payId').value;
    const amount = Number(document.getElementById('payAmount').value) || 0;

    if (!id || amount <= 0) return;

    window.store.recordPayment(id, amount);
    this.closeModal('payModal');
    this.renderFees();
    this.updateDashboard();
  }

  static delFee(id) {
    if (confirm('លុបវិក្កយបត្រ?')) {
      window.store.deleteInvoice(id);
      this.renderFees();
      this.updateDashboard();
    }
  }

  // --- Student Scores / Grades Module ---
  static getGrade(score) {
    if (score >= 90) return { text: 'A', color: 'text-green-600 font-bold' };
    if (score >= 80) return { text: 'B', color: 'text-blue-600 font-bold' };
    if (score >= 70) return { text: 'C', color: 'text-yellow-600 font-bold' };
    if (score >= 60) return { text: 'D', color: 'text-orange-600 font-bold' };
    return { text: 'E', color: 'text-red-600 font-bold' };
  }

  static renderScores() {
    const q = (document.getElementById('scoreSearch')?.value || '').toLowerCase().trim();
    const sem = document.getElementById('scoreFilterSemester')?.value || '';
    const sub = document.getElementById('scoreFilterSubject')?.value || '';

    const scores = window.store.getScores();

    const list = scores.filter(s => {
      const matchQ = (s.studentName || '').toLowerCase().includes(q);
      const matchSem = !sem || s.semester === sem;
      const matchSub = !sub || s.subject === sub;
      return matchQ && matchSem && matchSub;
    });

    const body = document.getElementById('scoreBody');
    if (!body) return;

    if (list.length === 0) {
      body.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-400">មិនមានទិន្នន័យពិន្ទុ</td></tr>`;
    } else {
      body.innerHTML = list.map((s, i) => {
        const g = this.getGrade(s.score);
        return `
          <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
            <td class="px-4 py-2.5 text-gray-500">${i + 1}</td>
            <td class="px-4 py-2.5 font-medium text-gray-900">${s.studentName}</td>
            <td class="px-4 py-2.5 text-slate-700">${s.className}</td>
            <td class="px-4 py-2.5 font-medium text-blue-700">${s.subject}</td>
            <td class="px-4 py-2.5 text-gray-600">${s.semester}</td>
            <td class="px-4 py-2.5 text-center font-semibold text-slate-800">${s.score}</td>
            <td class="px-4 py-2.5 text-center ${g.color}">${g.text}</td>
            <td class="px-4 py-2.5 text-center space-x-2 no-print">
              <button onclick="AppController.editScore(${s.id})" class="text-blue-600 font-semibold text-xs hover:underline">កែ</button>
              <button onclick="AppController.delScore(${s.id})" class="text-red-600 font-semibold text-xs hover:underline">លុប</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  static openScoreModal() {
    const students = window.store.getStudents();
    const select = document.getElementById('scoreStudent');
    if (select) {
      select.innerHTML = students.map(s => `<option value="${s.id}">${s.name || s.khmerName} (${s.className})</option>`).join('');
    }

    const idEl = document.getElementById('scoreId');
    if (idEl) idEl.value = '';
    const titleEl = document.getElementById('scoreModalTitle');
    if (titleEl) titleEl.textContent = 'បញ្ចូលពិន្ទុ';
    const valEl = document.getElementById('scoreValue');
    if (valEl) valEl.value = '';

    this.openModal('scoreModal');
  }

  static editScore(id) {
    const s = window.store.getScores().find(x => x.id == id);
    if (!s) return;

    const students = window.store.getStudents();
    const select = document.getElementById('scoreStudent');
    if (select) {
      select.innerHTML = students.map(st => `<option value="${st.id}" ${st.id == s.studentId ? 'selected' : ''}>${st.name || st.khmerName} (${st.className})</option>`).join('');
    }

    document.getElementById('scoreId').value = s.id;
    document.getElementById('scoreSubject').value = s.subject;
    document.getElementById('scoreSemester').value = s.semester;
    document.getElementById('scoreValue').value = s.score;

    const titleEl = document.getElementById('scoreModalTitle');
    if (titleEl) titleEl.textContent = 'កែពិន្ទុ';
    this.openModal('scoreModal');
  }

  static saveScore(e) {
    if (e) e.preventDefault();
    const studentId = Number(document.getElementById('scoreStudent').value);
    const students = window.store.getStudents();
    const student = students.find(s => s.id == studentId);

    if (!student) {
      alert('រកសិស្សមិនឃើញ');
      return;
    }

    const data = {
      studentId,
      studentName: student.name || student.khmerName,
      className: student.className,
      subject: document.getElementById('scoreSubject').value,
      semester: document.getElementById('scoreSemester').value,
      score: Number(document.getElementById('scoreValue').value)
    };

    const id = document.getElementById('scoreId').value;
    if (id) {
      window.store.updateScore(id, data);
    } else {
      window.store.addScore(data);
    }

    this.closeModal('scoreModal');
    this.renderScores();
    this.updateDashboard();
  }

  static delScore(id) {
    if (confirm('លុបកំណត់ត្រាពិន្ទុនេះ?')) {
      window.store.deleteScore(id);
      this.renderScores();
      this.updateDashboard();
    }
  }

  // ===== របាយការណ៍ពិន្ទុ =====
  static renderReport() {
    const sem = document.getElementById('reportSemester')?.value || '';
    const cls = document.getElementById('reportClass')?.value || '';
    const scores = window.store.getScores();

    // ក្រុមពិន្ទុតាមសិស្ស
    const map = {};
    scores.forEach(s => {
      if (sem && s.semester !== sem) return;
      if (cls && s.className !== cls) return;
      if (!map[s.studentId]) {
        map[s.studentId] = { name: s.studentName, className: s.className, scores: [] };
      }
      map[s.studentId].scores.push(s.score);
    });

    const rows = Object.values(map).map(s => {
      const avg = s.scores.reduce((a, b) => a + b, 0) / s.scores.length;
      return { ...s, avg: Math.round(avg * 10) / 10, count: s.scores.length };
    }).sort((a, b) => b.avg - a.avg);

    const body = document.getElementById('reportBody') || document.getElementById('reportTableBody');
    if (!body) return;

    body.innerHTML = rows.map((r, i) => {
      const g = this.getGrade(r.avg);
      return `<tr class="hover:bg-gray-50 border-b border-gray-100 text-sm">
        <td class="px-4 py-2.5 text-gray-500">${i + 1}</td>
        <td class="px-4 py-2.5 font-medium text-gray-900">${r.name}</td>
        <td class="px-4 py-2.5 text-slate-700">${r.className}</td>
        <td class="px-4 py-2.5 text-center font-mono">${r.count}</td>
        <td class="px-4 py-2.5 text-center font-semibold text-slate-800 font-mono">${r.avg}</td>
        <td class="px-4 py-2.5 text-center font-bold ${g.color}">${g.text}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="6" class="text-center py-6 text-gray-400">មិនមានទិន្នន័យ</td></tr>';
  }

  // ===== តារាងកិត្តិយស =====
  static renderHonor() {
    const sem = document.getElementById('honorSemester')?.value || 'ឆមាសទី១';
    const cls = document.getElementById('honorClass')?.value || '';
    const scores = window.store.getScores();

    const map = {};
    scores.forEach(s => {
      if (s.semester !== sem) return;
      if (cls && s.className !== cls) return;
      if (!map[s.studentId]) {
        map[s.studentId] = { name: s.studentName, className: s.className, scores: [] };
      }
      map[s.studentId].scores.push(s.score);
    });

    const rows = Object.values(map).map(s => {
      const avg = s.scores.reduce((a, b) => a + b, 0) / s.scores.length;
      return { ...s, avg: Math.round(avg * 10) / 10 };
    }).sort((a, b) => b.avg - a.avg);

    const body = document.getElementById('honorBody') || document.getElementById('honorTableBody');
    if (!body) return;

    body.innerHTML = rows.map((r, i) => {
      const g = this.getGrade(r.avg);
      let badge = '';
      if (i === 0) badge = '🥇 ទី១';
      else if (i === 1) badge = '🥈 ទី២';
      else if (i === 2) badge = '🥉 ទី៣';
      else if (r.avg >= 90) badge = '⭐ កិត្តិយស';
      else if (r.avg >= 80) badge = '✨ ល្អ';

      return `<tr class="hover:bg-gray-50 border-b border-gray-100 text-sm ${i < 3 ? 'bg-yellow-50/60' : ''}">
        <td class="px-4 py-2.5 text-center font-bold text-slate-800">${i + 1}</td>
        <td class="px-4 py-2.5 font-medium text-gray-900">${r.name}</td>
        <td class="px-4 py-2.5 text-slate-700">${r.className}</td>
        <td class="px-4 py-2.5 text-center font-semibold text-slate-800 font-mono">${r.avg}</td>
        <td class="px-4 py-2.5 text-center font-bold ${g.color}">${g.text}</td>
        <td class="px-4 py-2.5 text-center font-semibold">${badge}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="6" class="text-center py-6 text-gray-400">មិនមានទិន្នន័យ</td></tr>';
  }

  // --- Cambodian Tax Calculator Live ---
  static calculateTaxLive() {
    const gross = Number(document.getElementById('grossSalary')?.value) || 0;
    const hasSpouse = document.getElementById('hasSpouse')?.checked || false;
    const children = Number(document.getElementById('children')?.value) || 0;

    if (!window.TaxCalculator) return;
    const res = window.TaxCalculator.calculate(gross, hasSpouse, children);

    const elGross = document.getElementById('res-gross');
    if (elGross) elGross.textContent = window.TaxCalculator.formatKhr(res.grossSalary);
    const elDeduct = document.getElementById('res-deduction');
    if (elDeduct) elDeduct.textContent = window.TaxCalculator.formatKhr(res.totalDeduction);
    const elTaxable = document.getElementById('res-taxable');
    if (elTaxable) elTaxable.textContent = window.TaxCalculator.formatKhr(res.taxableSalary);
    const elTax = document.getElementById('res-tax');
    if (elTax) elTax.textContent = window.TaxCalculator.formatKhr(res.taxAmount);
    const elNet = document.getElementById('res-net');
    if (elNet) elNet.textContent = window.TaxCalculator.formatKhr(res.netSalary);
  }

  static renderBatchPayroll() {}
  static setupEventListeners() {}
}

// Global window functions matching prompt signatures
window.toggleSidebar = () => AppController.toggleSidebar();
window.closeMobileSidebar = () => AppController.closeMobileSidebar();

window.login = (email, password) => AppController.login(email, password);
window.logout = () => AppController.logout();

window.loadStudentsFromFirebase = () => AppController.loadStudentsFromFirebase();
window.addStudentToFirebase = (data) => AppController.addStudentToFirebase(data);
window.deleteStudentFromFirebase = (id) => AppController.deleteStudentFromFirebase(id);

window.showPage = (page) => AppController.showPage(page);
window.updateDashboard = () => AppController.updateDashboard();

window.renderStudents = () => AppController.renderStudents();
window.openStudentModal = () => AppController.openStudentModal();
window.editStudent = (id) => AppController.editStudent(id);
window.saveStudent = (e) => AppController.saveStudent(e);
window.delStudent = (id) => AppController.delStudent(id);

window.renderTeachers = renderTeachers;
window.openTeacherModal = openTeacherModal;
window.editTeacher = editTeacher;
window.saveTeacher = saveTeacher;
window.delTeacher = delTeacher;
window.viewTeacherSchedule = viewTeacherSchedule;
window.viewTeacherAttendance = viewTeacherAttendance;
window.quickCheckIn = quickCheckIn;
window.quickCheckOut = quickCheckOut;
window.teachers = teachers;

window.renderStaff = () => AppController.renderStaff();
window.openStaffModal = () => AppController.openStaffModal();
window.editStaff = (id) => AppController.editStaff(id);
window.saveStaff = (e) => AppController.saveStaff(e);
window.delStaff = (id) => AppController.delStaff(id);

window.renderAttendance = renderAttendance;
window.renderAttReport = renderAttReport;
window.renderAttReportSafe = renderAttReportSafe;
window.showAttDetailByIndex = showAttDetailByIndex;
window.checkIn = checkIn;
window.checkOut = checkOut;

window.renderPayroll = renderPayroll;
window.showPayDetail = showPayDetail;
window.openSalarySetting = openSalarySetting;
window.saveSalarySettings = saveSalarySettings;

window.renderFees = () => AppController.renderFees();
window.openFeeModal = () => AppController.openFeeModal();
window.saveFee = (e) => AppController.saveFee(e);
window.openPay = (id) => AppController.openPay(id);
window.savePayment = (e) => AppController.savePayment(e);
window.delFee = (id) => AppController.delFee(id);

window.renderScores = () => AppController.renderScores();
window.openScoreModal = () => AppController.openScoreModal();
window.editScore = (id) => AppController.editScore(id);
window.saveScore = (e) => AppController.saveScore(e);
window.delScore = (id) => AppController.delScore(id);
window.getGrade = (score) => AppController.getGrade(score);

window.renderReports = () => AppController.renderReport();
window.renderReport = () => AppController.renderReport();

window.renderHonorRoll = () => AppController.renderHonor();
window.renderHonor = () => AppController.renderHonor();

// Schedule global window bindings
window.renderSchedule = renderSchedule;
window.openScheduleModal = openScheduleModal;
window.editSchedule = editSchedule;
window.saveSchedule = saveSchedule;
window.fillTeacherDropdown = fillTeacherDropdown;
window.getSubjectClass = getSubjectClass;
window.schedules = schedules;
window.PERIODS = PERIODS;
window.DAYS = DAYS;
window.DAY_LABELS = DAY_LABELS;

window.closeModal = (id) => AppController.closeModal(id);
window.openModal = (id) => AppController.openModal(id);

window.AppController = AppController;

// Auto-initialize HorlSM Application Controller
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
  });
} else {
  AppController.init();
}
