// Turunan KPI dari data mentah (resources, projects, assignments)

export function computeKpis({ projects, resources, assignments, execution }) {
  const resourceCount = resources.length
  const projectCount = projects.length

  const tcExecuted = projects.reduce((a, p) => a + (p.executed || 0), 0)
  const totalTC = projects.reduce((a, p) => a + (p.totalTC || 0), 0)
  const totalAutomation = projects.reduce((a, p) => a + (p.automation || 0), 0)

  const automationCoverage = totalTC ? Math.round((totalAutomation / totalTC) * 100) : 0

  const openDefect = projects.reduce((a, p) => a + (p.openDefect || 0), 0)
  const closedDefect = projects.reduce((a, p) => a + (p.closedDefect || 0), 0)
  const critical = projects.reduce((a, p) => a + (p.critical || 0), 0)

  const avgProgress = projectCount
    ? Math.round(projects.reduce((a, p) => a + (p.progress || 0), 0) / projectCount)
    : 0

  const totalPassed = projects.reduce((a, p) => a + (p.passed || 0), 0)
  const totalExecuted = tcExecuted || 1
  const passRate = Math.round((totalPassed / totalExecuted) * 100)

  return {
    resourceCount, projectCount, tcExecuted, totalTC, automationCoverage,
    openDefect, closedDefect, critical, avgProgress, passRate,
  }
}

export function computeAlerts({ projects, resources, assignments }) {
  const alerts = []

  const noUpdate = resources.filter((r) => r.status === 'Idle').length
  if (noUpdate > 0) alerts.push({ level: 'red', text: `${noUpdate} resource belum update progress / idle` })

  const delayed = assignments.filter((a) => a.status === 'Delayed').length
  if (delayed > 0) alerts.push({ level: 'orange', text: `${delayed} assignment terlambat` })

  const ahead = projects.filter((p) => p.progress >= 75).length
  if (ahead > 0) alerts.push({ level: 'green', text: `${ahead} project ahead schedule` })

  const lowAuto = projects.filter((p) => p.automationCoverage < 50).length
  if (lowAuto > 0) alerts.push({ level: 'red', text: `Automation coverage <50% pada ${lowAuto} project` })

  const blocked = resources.filter((r) => r.status === 'Blocked').length
  if (blocked > 0) alerts.push({ level: 'orange', text: `${blocked} resource sedang blocked` })

  const overload = resources.filter((r) => (r.utilization || 0) > 100).length
  if (overload > 0) alerts.push({ level: 'orange', text: `${overload} resource overload (>100%)` })

  return alerts
}

// Risk indicator project: kombinasi progress + critical defect + coverage
export function projectRisk(p) {
  let score = 0
  if (p.progress < 50) score += 2
  else if (p.progress < 70) score += 1
  if (p.critical > 0) score += 2
  if (p.automationCoverage < 50) score += 1
  if ((p.openDefect || 0) > 15) score += 1
  if (score >= 3) return 'red'
  if (score >= 1) return 'amber'
  return 'green'
}
