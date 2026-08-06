// ============================================================================
// SEED DATA — data dummy awal. Bisa ditambah/dihapus lewat UI (tersimpan di
// localStorage). Nantinya layer ini akan diganti panggilan API TestRail/SquashTM.
// ============================================================================

export const PLATFORMS = ['Web', 'Mobile', 'API', 'Desktop']
export const RESOURCE_STATUS = ['Working', 'Review', 'Blocked', 'Leave', 'Meeting', 'Idle']
export const ASSIGNMENT_STATUS = ['On Track', 'At Risk', 'Delayed', 'Done']
// Jabatan — struktur organisasi COE Automation Testing (urut dari atas ke bawah)
export const JABATAN = ['Team Leader COE', 'Test Automation Manager', 'Test Automation Lead', 'B2B Automation']

export const seedProjects = [
  {
    id: 'prj-1', name: 'BNI Direct Revamp', phase: 'Phase 7', platform: 'Web',
    progress: 82, totalTC: 1250, executed: 1024, passed: 912, failed: 53, blocked: 21,
    notRun: 240, automation: 680, automationCoverage: 54, openDefect: 18, closedDefect: 72,
    critical: 1, dailyProgress: [62, 70, 78, 80, 91],
  },
  {
    id: 'prj-2', name: 'Wondr Enhancement', phase: 'Phase 4', platform: 'Mobile',
    progress: 63, totalTC: 860, executed: 540, passed: 489, failed: 38, blocked: 13,
    notRun: 320, automation: 410, automationCoverage: 64, openDefect: 12, closedDefect: 40,
    critical: 0, dailyProgress: [40, 48, 52, 58, 63],
  },
  {
    id: 'prj-3', name: 'Open API', phase: 'Phase 8', platform: 'API',
    progress: 77, totalTC: 980, executed: 760, passed: 701, failed: 41, blocked: 18,
    notRun: 220, automation: 800, automationCoverage: 82, openDefect: 9, closedDefect: 55,
    critical: 0, dailyProgress: [55, 60, 66, 72, 77],
  },
  {
    id: 'prj-4', name: 'Dashboard Internal', phase: 'Phase 2', platform: 'Web',
    progress: 41, totalTC: 420, executed: 172, passed: 150, failed: 15, blocked: 7,
    notRun: 248, automation: 130, automationCoverage: 31, openDefect: 6, closedDefect: 12,
    critical: 0, dailyProgress: [18, 24, 30, 36, 41],
  },
  {
    id: 'prj-5', name: 'BNI Mobile', phase: 'Phase 5', platform: 'Mobile',
    progress: 69, totalTC: 740, executed: 510, passed: 470, failed: 28, blocked: 12,
    notRun: 230, automation: 380, automationCoverage: 51, openDefect: 11, closedDefect: 33,
    critical: 1, dailyProgress: [45, 52, 60, 65, 69],
  },
  {
    id: 'prj-6', name: 'BNI Sekuritas', phase: 'Phase 3', platform: 'Web',
    progress: 58, totalTC: 600, executed: 348, passed: 310, failed: 26, blocked: 12,
    notRun: 252, automation: 240, automationCoverage: 40, openDefect: 7, closedDefect: 19,
    critical: 0, dailyProgress: [30, 38, 45, 52, 58],
  },
  {
    id: 'prj-7', name: 'BNI Life Portal', phase: 'Phase 6', platform: 'Desktop',
    progress: 74, totalTC: 520, executed: 385, passed: 352, failed: 22, blocked: 11,
    notRun: 135, automation: 310, automationCoverage: 60, openDefect: 4, closedDefect: 28,
    critical: 0, dailyProgress: [50, 58, 64, 70, 74],
  },
]

export const seedResources = [
  {
    id: 'res-1', name: 'Kevin Dewangga', role: 'Automation Engineer', projects: ['BNI Direct Revamp'],
    phase: 'Phase 7', todayTask: 'Automation Login', status: 'Working', workload: 100,
    utilization: 110, progress: 75, manualProgress: 82, automationProgress: 48, reviewProgress: 36,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '09:00', text: 'Execute TC-100' },
      { time: '10:30', text: 'Execute TC-101' },
      { time: '13:00', text: 'Automation Script' },
      { time: '15:00', text: 'Push Git' },
      { time: '17:00', text: 'Update Progress' },
    ],
    standup: { yesterday: '35 TC executed', today: 'Automation Login', blocker: 'None' },
  },
  {
    id: 'res-2', name: 'Andi Pratama', role: 'Manual Tester', projects: ['Wondr Enhancement', 'Open API'],
    phase: 'Phase 4', todayTask: 'SIT Execution', status: 'Working', workload: 80,
    utilization: 80, progress: 62, manualProgress: 70, automationProgress: 30, reviewProgress: 40,
    activities: [
      { time: '08:30', text: 'Login' },
      { time: '09:15', text: 'Execute SIT batch 1' },
      { time: '11:00', text: 'Log defect WONDR-221' },
      { time: '14:00', text: 'Execute SIT batch 2' },
      { time: '16:30', text: 'Update Progress' },
    ],
    standup: { yesterday: '20 TC executed', today: 'Regression', blocker: 'Waiting API' },
  },
  {
    id: 'res-3', name: 'Rudi Hartono', role: 'Manual Tester', projects: [],
    phase: 'Phase 2', todayTask: 'Idle', status: 'Idle', workload: 35,
    utilization: 35, progress: 0, manualProgress: 20, automationProgress: 0, reviewProgress: 10,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '10:00', text: 'Review test plan' },
    ],
    standup: { yesterday: '15 TC executed', today: 'Review', blocker: 'None' },
  },
  {
    id: 'res-4', name: 'Budi Santoso', role: 'Automation Engineer', projects: ['Open API'],
    phase: 'Phase 8', todayTask: 'Review Script', status: 'Review', workload: 60,
    utilization: 65, progress: 84, manualProgress: 60, automationProgress: 88, reviewProgress: 70,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '09:00', text: 'Review PR #142' },
      { time: '11:30', text: 'Run regression pipeline' },
      { time: '14:00', text: 'Fix flaky script' },
      { time: '16:00', text: 'Update Progress' },
    ],
    standup: { yesterday: '40 TC automated', today: 'Review PR', blocker: 'None' },
  },
  {
    id: 'res-5', name: 'Sinta Maharani', role: 'Automation Engineer', projects: ['BNI Mobile', 'BNI Direct Revamp'],
    phase: 'Phase 5', todayTask: 'Automation Payment', status: 'Working', workload: 90,
    utilization: 95, progress: 71, manualProgress: 55, automationProgress: 78, reviewProgress: 30,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '09:00', text: 'Automation Payment flow' },
      { time: '12:00', text: 'Run KRE pipeline' },
      { time: '15:00', text: 'Push Git' },
      { time: '17:00', text: 'Update Progress' },
    ],
    standup: { yesterday: '28 TC automated', today: 'Automation Payment', blocker: 'None' },
  },
  {
    id: 'res-6', name: 'Dewi Lestari', role: 'Manual Tester', projects: ['BNI Sekuritas'],
    phase: 'Phase 3', todayTask: 'UAT Execution', status: 'Blocked', workload: 70,
    utilization: 75, progress: 48, manualProgress: 60, automationProgress: 10, reviewProgress: 20,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '09:30', text: 'Execute UAT batch' },
      { time: '11:00', text: 'Blocked — env down' },
    ],
    standup: { yesterday: '18 TC executed', today: 'UAT', blocker: 'Environment down' },
  },
  {
    id: 'res-7', name: 'Fajar Nugroho', role: 'Automation Engineer', projects: ['BNI Life Portal', 'BNI Sekuritas'],
    phase: 'Phase 6', todayTask: 'Regression', status: 'Working', workload: 85,
    utilization: 88, progress: 66, manualProgress: 50, automationProgress: 72, reviewProgress: 45,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '09:00', text: 'Run regression' },
      { time: '13:00', text: 'Automation script' },
      { time: '16:00', text: 'Update Progress' },
    ],
    standup: { yesterday: '30 TC executed', today: 'Regression', blocker: 'None' },
  },
  {
    id: 'res-8', name: 'Maya Anggraini', role: 'Manual Tester', projects: ['BNI Direct Revamp'],
    phase: 'Phase 7', todayTask: 'Meeting', status: 'Meeting', workload: 50,
    utilization: 55, progress: 55, manualProgress: 65, automationProgress: 15, reviewProgress: 25,
    activities: [
      { time: '08:00', text: 'Login' },
      { time: '09:00', text: 'Phase sync meeting' },
      { time: '11:00', text: 'Execute SIT' },
    ],
    standup: { yesterday: '22 TC executed', today: 'SIT', blocker: 'None' },
  },
]

export const seedAssignments = [
  { id: 'asg-1', resourceName: 'Kevin Dewangga', project: 'BNI Direct Revamp', task: 'Automation Login', target: 100, done: 78, dueDate: '2026-06-30', status: 'On Track' },
  { id: 'asg-2', resourceName: 'Andi Pratama', project: 'Open API', task: 'Regression', target: 250, done: 170, dueDate: '2026-07-02', status: 'On Track' },
  { id: 'asg-3', resourceName: 'Budi Santoso', project: 'Open API', task: 'Review Script', target: 120, done: 100, dueDate: '2026-06-29', status: 'At Risk' },
  { id: 'asg-4', resourceName: 'Sinta Maharani', project: 'BNI Mobile', task: 'Automation Payment', target: 150, done: 105, dueDate: '2026-07-01', status: 'On Track' },
  { id: 'asg-5', resourceName: 'Dewi Lestari', project: 'BNI Sekuritas', task: 'UAT Execution', target: 200, done: 95, dueDate: '2026-06-28', status: 'Delayed' },
  { id: 'asg-6', resourceName: 'Fajar Nugroho', project: 'BNI Life Portal', task: 'Regression', target: 180, done: 120, dueDate: '2026-07-03', status: 'On Track' },
]

// Execution harian (5 hari kerja terakhir) — untuk grafik trend pass rate
export const seedExecution = {
  today: { executed: 420, passed: 389, failed: 21, blocked: 4, notComplete: 6 },
  passRateTrend: [
    { day: 'Mon', rate: 95 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 93 },
    { day: 'Thu', rate: 91 },
    { day: 'Fri', rate: 96 },
  ],
}

// Heatmap status mingguan per resource (Mon-Fri)
export const seedHeatmap = [
  { name: 'Kevin Dewangga', days: ['ok', 'ok', 'ok', 'ok', 'ok'] },
  { name: 'Andi Pratama', days: ['ok', 'ok', 'bad', 'ok', 'warn'] },
  { name: 'Rudi Hartono', days: ['off', 'off', 'ok', 'ok', 'ok'] },
  { name: 'Sinta Maharani', days: ['ok', 'ok', 'ok', 'bad', 'bad'] },
  { name: 'Budi Santoso', days: ['ok', 'ok', 'ok', 'ok', 'ok'] },
  { name: 'Dewi Lestari', days: ['ok', 'warn', 'bad', 'bad', 'ok'] },
]
