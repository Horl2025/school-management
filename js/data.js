/**
 * HorlSM DataStore Manager
 */
class DataStore {
  constructor() {
    this.STORAGE_KEY = 'HORL_SM_DATA_V1';
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data, reinitializing mock data.');
        this.data = this.getInitialMockData();
      }
    } else {
      this.data = this.getInitialMockData();
      this.save();
    }

    // Sync teachers with sms_teachers key
    let savedTeachers = JSON.parse(localStorage.getItem('sms_teachers'));
    if (!savedTeachers || savedTeachers.length === 0) {
      savedTeachers = [
        { id: 1, code: 'TCH-001', name: 'សុខ វណ្ណា', latin: 'Sok Vanna', gender: 'ប្រុស', subject: 'គណិតវិទ្យា', role: 'គ្រូបន្ទុកថ្នាក់', phone: '012 111 222', email: 'vanna@school.com', status: 'កំពុងធ្វើការ' },
        { id: 2, code: 'TCH-002', name: 'លី សុភា', latin: 'Ly Sophea', gender: 'ស្រី', subject: 'ភាសាអង់គ្លេស', role: 'គ្រូបង្រៀន', phone: '098 333 444', email: 'sophea@school.com', status: 'កំពុងធ្វើការ' },
        { id: 3, code: 'TCH-003', name: 'ចាន់ ដារ៉ា', latin: 'Chan Dara', gender: 'ប្រុស', subject: 'រូបវិទ្យា', role: 'គ្រូបង្រៀន', phone: '077 555 666', email: '', status: 'កំពុងធ្វើការ' },
      ];
      localStorage.setItem('sms_teachers', JSON.stringify(savedTeachers));
    }
    this.data.teachers = savedTeachers;

    // Sync schedules with sms_schedules key
    let savedSchedules = JSON.parse(localStorage.getItem('sms_schedules'));
    if (!savedSchedules || savedSchedules.length === 0) {
      savedSchedules = [
        { id:1, className:'ថ្នាក់ទី១០', day:'monday', period:'07:00-08:00', subject:'គណិតវិទ្យា', teacher:'សុខ វណ្ណា', room:'A1' },
        { id:2, className:'ថ្នាក់ទី១០', day:'monday', period:'08:00-09:00', subject:'ភាសាអង់គ្លេស', teacher:'លី សុភា', room:'A1' },
        { id:3, className:'ថ្នាក់ទី១០', day:'tuesday', period:'07:00-08:00', subject:'រូបវិទ្យា', teacher:'ចាន់ ដារ៉ា', room:'Lab1' },
        { id:4, className:'ថ្នាក់ទី១០', day:'wednesday', period:'09:00-10:00', subject:'ភាសាខ្មែរ', teacher:'ណាត សុខា', room:'A2' },
        { id:5, className:'ថ្នាក់ទី១០', day:'friday', period:'14:00-15:00', subject:'កីឡា', teacher:'ពេជ្រ ម៉ាលី', room:'Field' }
      ];
      localStorage.setItem('sms_schedules', JSON.stringify(savedSchedules));
    }
    this.data.schedule = savedSchedules;
  }

  getInitialMockData() {
    return {
      students: [
        { id: 1, code: 'STU-001', name: 'សុខ វិចិត្រ', gender: 'ប្រុស', className: 'ថ្នាក់ទី១០', status: 'កំពុងរៀន' },
        { id: 2, code: 'STU-002', name: 'មាស សុជាតា', gender: 'ស្រី', className: 'ថ្នាក់ទី១០', status: 'កំពុងរៀន' },
        { id: 3, code: 'STU-003', name: 'គង់ ចាន់ថន', gender: 'ប្រុស', className: 'ថ្នាក់ទី៩', status: 'កំពុងរៀន' },
        { id: 4, code: 'STU-004', name: 'លី សុភា', gender: 'ស្រី', className: 'ថ្នាក់ទី១១', status: 'កំពុងរៀន' }
      ],
      teachers: [
        { id: 1, code: 'TCH-001', name: 'សុខ វណ្ណា', latin: 'Sok Vanna', gender: 'ប្រុស', subject: 'គណិតវិទ្យា', role: 'គ្រូបន្ទុកថ្នាក់', phone: '012 111 222', email: 'vanna@school.com', status: 'កំពុងធ្វើការ' },
        { id: 2, code: 'TCH-002', name: 'លី សុភា', latin: 'Ly Sophea', gender: 'ស្រី', subject: 'ភាសាអង់គ្លេស', role: 'គ្រូបង្រៀន', phone: '098 333 444', email: 'sophea@school.com', status: 'កំពុងធ្វើការ' },
        { id: 3, code: 'TCH-003', name: 'ចាន់ ដារ៉ា', latin: 'Chan Dara', gender: 'ប្រុស', subject: 'រូបវិទ្យា', role: 'គ្រូបង្រៀន', phone: '077 555 666', email: '', status: 'កំពុងធ្វើការ' }
      ],
      staff: [
        { id: 1, code: 'STF-001', name: 'ហ៊ន ពិសិដ្ឋ', position: 'នាយក', phone: '012345678', status: 'កំពុងធ្វើការ' },
        { id: 2, code: 'STF-002', name: 'ចាន់ សុភាព', position: 'លេខាធិការ', phone: '098765432', status: 'កំពុងធ្វើការ' }
      ],
      invoices: [
        { id: 1, no: 'INV-001', student: 'សុខ វិចិត្រ', total: 1200000, paid: 1200000, note: 'ថ្លៃសិក្សា ឆមាសទី១' },
        { id: 2, no: 'INV-002', student: 'មាស សុជាតា', total: 1200000, paid: 600000, note: 'ថ្លៃសិក្សា ឆមាសទី១' }
      ],
      scores: [
        { id: 1, studentId: 1, studentName: 'សុខ វិចិត្រ', className: 'ថ្នាក់ទី១០', subject: 'គណិតវិទ្យា', semester: 'ឆមាសទី១', score: 95 },
        { id: 2, studentId: 1, studentName: 'សុខ វិចិត្រ', className: 'ថ្នាក់ទី១០', subject: 'ភាសាខ្មែរ', semester: 'ឆមាសទី១', score: 88 },
        { id: 3, studentId: 2, studentName: 'មាស សុជាតា', className: 'ថ្នាក់ទី១០', subject: 'គណិតវិទ្យា', semester: 'ឆមាសទី១', score: 92 }
      ],
      schedule: [
        { id:1, className:'ថ្នាក់ទី១០', day:'monday', period:'07:00-08:00', subject:'គណិតវិទ្យា', teacher:'សុខ វណ្ណា', room:'A1' },
        { id:2, className:'ថ្នាក់ទី១០', day:'monday', period:'08:00-09:00', subject:'ភាសាអង់គ្លេស', teacher:'លី សុភា', room:'A1' },
        { id:3, className:'ថ្នាក់ទី១០', day:'tuesday', period:'07:00-08:00', subject:'រូបវិទ្យា', teacher:'ចាន់ ដារ៉ា', room:'Lab1' },
        { id:4, className:'ថ្នាក់ទី១០', day:'wednesday', period:'09:00-10:00', subject:'ភាសាខ្មែរ', teacher:'ណាត សុខា', room:'A2' },
        { id:5, className:'ថ្នាក់ទី១០', day:'friday', period:'14:00-15:00', subject:'កីឡា', teacher:'ពេជ្រ ម៉ាលី', room:'Field' }
      ]
    };
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  // --- Students API ---
  getStudents() { return this.data.students || []; }
  addStudent(student) {
    const id = Date.now();
    const newStudent = { id, ...student };
    this.data.students.push(newStudent);
    this.save();
    return newStudent;
  }
  updateStudent(id, updatedData) {
    const idx = this.data.students.findIndex(s => s.id == id);
    if (idx !== -1) {
      this.data.students[idx] = { ...this.data.students[idx], ...updatedData };
      this.save();
      return this.data.students[idx];
    }
    return null;
  }
  deleteStudent(id) {
    this.data.students = this.data.students.filter(s => s.id != id);
    this.save();
  }

  // --- Teachers API ---
  getTeachers() {
    return JSON.parse(localStorage.getItem('sms_teachers')) || this.data.teachers || [];
  }
  saveTeachersList(list) {
    localStorage.setItem('sms_teachers', JSON.stringify(list));
    this.data.teachers = list;
    this.save();
  }
  addTeacher(teacher) {
    let list = this.getTeachers();
    const id = Date.now();
    const newTeacher = { id, ...teacher };
    list.push(newTeacher);
    this.saveTeachersList(list);
    return newTeacher;
  }
  updateTeacher(id, updatedData) {
    let list = this.getTeachers();
    const idx = list.findIndex(t => t.id == id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      this.saveTeachersList(list);
      return list[idx];
    }
    return null;
  }
  deleteTeacher(id) {
    let list = this.getTeachers();
    list = list.filter(t => t.id != id);
    this.saveTeachersList(list);
  }

  // --- Staff API ---
  getStaff() { return this.data.staff || []; }
  addStaff(staffMember) {
    const id = Date.now();
    const newStaff = { id, ...staffMember };
    this.data.staff.push(newStaff);
    this.save();
    return newStaff;
  }
  updateStaff(id, updatedData) {
    const idx = this.data.staff.findIndex(s => s.id == id);
    if (idx !== -1) {
      this.data.staff[idx] = { ...this.data.staff[idx], ...updatedData };
      this.save();
      return this.data.staff[idx];
    }
    return null;
  }
  deleteStaff(id) {
    this.data.staff = this.data.staff.filter(s => s.id != id);
    this.save();
  }

  // --- Invoices API ---
  getInvoices() { return this.data.invoices || []; }
  addInvoice(invoice) {
    const id = Date.now();
    const no = `INV-00${this.data.invoices.length + 1}`;
    const newInvoice = { id, no, ...invoice };
    this.data.invoices.push(newInvoice);
    this.save();
    return newInvoice;
  }
  recordPayment(id, amount) {
    const inv = this.data.invoices.find(i => i.id == id);
    if (inv) {
      inv.paid = (inv.paid || 0) + Number(amount);
      this.save();
      return inv;
    }
    return null;
  }
  deleteInvoice(id) {
    this.data.invoices = this.data.invoices.filter(i => i.id != id);
    this.save();
  }

  // --- Scores API ---
  getScores() { return this.data.scores || []; }
  addScore(score) {
    const id = Date.now();
    const newScore = { id, ...score };
    this.data.scores.push(newScore);
    this.save();
    return newScore;
  }
  updateScore(id, updatedData) {
    const idx = this.data.scores.findIndex(s => s.id == id);
    if (idx !== -1) {
      this.data.scores[idx] = { ...this.data.scores[idx], ...updatedData };
      this.save();
      return this.data.scores[idx];
    }
    return null;
  }
  deleteScore(id) {
    this.data.scores = this.data.scores.filter(s => s.id != id);
    this.save();
  }

  // --- Schedule API ---
  getSchedule() {
    return JSON.parse(localStorage.getItem('sms_schedules')) || this.data.schedule || [];
  }
  saveScheduleList(list) {
    localStorage.setItem('sms_schedules', JSON.stringify(list));
    this.data.schedule = list;
    this.save();
  }
  addSchedule(sch) {
    let list = this.getSchedule();
    const item = { id: Date.now(), ...sch };
    list.push(item);
    this.saveScheduleList(list);
    return item;
  }
  updateSchedule(id, updatedData) {
    let list = this.getSchedule();
    const idx = list.findIndex(s => s.id == id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      this.saveScheduleList(list);
      return list[idx];
    }
    return null;
  }
  deleteSchedule(id) {
    let list = this.getSchedule();
    list = list.filter(s => s.id != id);
    this.saveScheduleList(list);
  }
}

window.store = new DataStore();
