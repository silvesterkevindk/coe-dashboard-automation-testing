// ============================================================================
// SEED DATA backend — dipakai sekali saat database masih kosong (db.js).
// Setelah itu semua perubahan tersimpan permanen di database.
// ============================================================================

// Dikosongkan atas permintaan user — tidak ada project yang di-seed lagi,
// sehingga menu Project tetap kosong walau server API di-restart.
export const seedProjects = []

const blankStandup = { yesterday: '-', today: '-', blocker: 'None' }

// Helper resource B2B Automation (data bio + default kosong yang valid)
const b2b = (id, npp, name, company, birthDate, joinDate) => ({
  id, npp, name, company, birthDate, joinDate, role: '', jabatan: 'B2B Automation',
  projects: [], phase: '-', todayTask: '-', status: 'Working',
  workload: 0, utilization: 0, progress: 0, manualProgress: 0, automationProgress: 0,
  reviewProgress: 0, activities: [], standup: blankStandup,
})

// ---- Anggota B2B Automation (vendor) ----
// Tanggal disimpan ISO (YYYY-MM-DD) agar bisa dipakai date picker & hitung lama bergabung.
export const seedResources = [
  b2b('res-b2b-1', '821905', 'Burhan Aditya', 'Adidata', '1994-05-14', '2022-05-27'),
  b2b('res-b2b-2', '901164', 'Alfiko Utama', 'Indocyber', '1996-06-07', '2025-07-14'),
  b2b('res-b2b-3', '900654', 'Syafiq Ali Zhafran', 'Adidata', '2000-10-07', '2024-07-10'),
  b2b('res-b2b-4', '901232', 'Mikhael Adriel Pratama Gana', 'Adidata', '2000-01-16', '2025-08-29'),
  b2b('res-b2b-5', '901233', 'Izaaz Waskito Widyarto', 'Amartek', '2000-08-10', '2025-09-08'),
  b2b('res-b2b-6', '900674', 'Andinira Rizki Syafitri', 'Adidata', '2000-01-25', '2024-07-22'),
  b2b('res-b2b-7', '821842', 'M. Alvin Fahrian', 'Adidata', '1995-06-29', '2024-08-01'),
  b2b('res-b2b-8', '901914', 'Dicky Ananda', 'Indocyber', '1997-09-25', '2026-05-25'),
  b2b('res-b2b-9', '901780', 'Marcelino Oktaviansyah', 'SDD', '2000-10-23', '2026-04-07'),
  b2b('res-b2b-10', '901779', 'Zakiah Putri Madani', 'Adidata', '2000-10-13', '2026-04-08'),
  b2b('res-b2b-11', '901885', 'Ilham Ramadhan', 'SDD', '2001-01-31', '2026-05-13'),
  b2b('res-b2b-12', '901922', 'Arna Muhammad Risyad', 'Amartek', '2000-04-02', '2026-06-02'),
  b2b('res-b2b-13', '901895', 'Abdul Aziz Permana', 'SDD', '2000-10-16', '2026-05-18'),
  b2b('res-b2b-14', '901916', 'Samuel Hutauruk', 'Indocyber', '1998-04-02', '2026-06-02'),
  b2b('res-b2b-15', '902037', 'Alfiyanto Kondolele', 'Indocyber', '1998-12-18', '2026-07-20'),
  b2b('res-b2b-16', '901915', 'Reza Fauzi Baharsyah', 'Indocyber', '1998-05-05', '2026-05-25'),
  b2b('res-b2b-17', '', 'Dimas Wahyu Ardiyanto', 'Amartek', '', ''),
  b2b('res-b2b-18', '', 'Pahala Fawwaz', 'Amartek', '', ''),
]

export const seedAssignments = [
  { id: 'asg-1', resourceName: 'Burhan Aditya', project: 'BNI Direct Revamp', task: 'Automation Login', target: 100, done: 78, dueDate: '2026-06-30', status: 'On Track' },
  { id: 'asg-2', resourceName: 'Alfiko Utama', project: 'Open API', task: 'Regression', target: 250, done: 170, dueDate: '2026-07-02', status: 'On Track' },
  { id: 'asg-3', resourceName: 'Syafiq Ali Zhafran', project: 'Open API', task: 'Review Script', target: 120, done: 100, dueDate: '2026-06-29', status: 'At Risk' },
  { id: 'asg-4', resourceName: 'Andinira Rizki Syafitri', project: 'BNI Mobile', task: 'Automation Payment', target: 150, done: 105, dueDate: '2026-07-01', status: 'On Track' },
  { id: 'asg-5', resourceName: 'Izaaz Waskito Widyarto', project: 'BNI Sekuritas', task: 'UAT Execution', target: 200, done: 95, dueDate: '2026-06-28', status: 'Delayed' },
  { id: 'asg-6', resourceName: 'M. Alvin Fahrian', project: 'BNI Life Portal', task: 'Regression', target: 180, done: 120, dueDate: '2026-07-03', status: 'On Track' },
]

// Execution harian (5 hari kerja terakhir) — untuk grafik trend pass rate
export const seedExecution = {
  today: { executed: 420, passed: 389, failed: 21, blocked: 4, notComplete: 6 },
  passRateTrend: [
    { day: 'Mon', rate: 95 }, { day: 'Tue', rate: 94 }, { day: 'Wed', rate: 93 },
    { day: 'Thu', rate: 91 }, { day: 'Fri', rate: 96 },
  ],
}

// Heatmap status mingguan per resource (Mon-Fri)
export const seedHeatmap = [
  { name: 'Burhan Aditya', days: ['ok', 'ok', 'ok', 'ok', 'ok'] },
  { name: 'Alfiko Utama', days: ['ok', 'ok', 'bad', 'ok', 'warn'] },
  { name: 'Syafiq Ali Zhafran', days: ['ok', 'ok', 'ok', 'ok', 'ok'] },
  { name: 'Mikhael Adriel Pratama Gana', days: ['off', 'off', 'ok', 'ok', 'ok'] },
  { name: 'Andinira Rizki Syafitri', days: ['ok', 'warn', 'bad', 'bad', 'ok'] },
  { name: 'Izaaz Waskito Widyarto', days: ['ok', 'ok', 'ok', 'bad', 'bad'] },
]

// Akun awal (password akan di-hash saat seeding)
export const seedUsers = [
  { username: 'silvester', password: 'P@ssw0rd91', name: 'Silvester Kevin', role: 'QA Automation Lead' },
  { username: 'bachrul', password: 'P@ssw0rd', name: 'Bachrul A.N.', role: 'Team Leader COE' },
  { username: 'marinda', password: 'P@ssw0rd', name: 'Marinda Ika Dewi Sakariana', role: 'Test Automation Lead' },
  { username: 'thomas', password: 'P@ssw0rd', name: 'Thomas Gunawan Sardjono', role: 'Test Automation Lead' },
]

// Nilai jabatan (struktur organisasi COE Automation Testing)
export const JABATAN = ['Team Leader COE', 'Test Automation Manager', 'Test Automation Lead', 'B2B Automation']

// Anggota struktur organisasi di atas B2B Automation (di-ensure ada di tiap start)
const orgMember = (id, npp, name, jabatan, company = 'BNI', birthDate = '', joinDate = '') => ({
  id, npp, name, role: jabatan, jabatan, company, birthDate, joinDate,
  projects: [], phase: '-', todayTask: '-', status: 'Working',
  workload: 100, utilization: 90, progress: 0, manualProgress: 0, automationProgress: 0,
  reviewProgress: 0, activities: [], standup: blankStandup,
})

export const seedOrgMembers = [
  orgMember('res-tl-1', '', 'Bachrul A.N.', 'Team Leader COE', 'BNI'),
  orgMember('res-mgr-1', 'P057874', 'Silvester Kevin Dewangga Kurniawan', 'Test Automation Manager', 'BNI', '', ''),
  orgMember('res-lead-1', 'P062928', 'Mbincar Rukun Sembiring', 'Test Automation Lead', 'BNI', '1997-11-24', '2022-05-24'),
  orgMember('res-lead-2', 'P063945', 'Thomas Gunawan Sardjono', 'Test Automation Lead', 'BNI', '1997-07-01', '2023-03-01'),
  orgMember('res-lead-3', 'P062927', 'Marinda Ika Dewi Sakariana', 'Test Automation Lead', 'BNI', '1998-04-23', '2022-05-24'),
]
