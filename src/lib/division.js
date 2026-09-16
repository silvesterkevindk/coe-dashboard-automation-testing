// Helper divisi (Automation / Performance) — dipakai Organisasi & Dashboard.

export const DIVISIONS = ['Automation', 'Performance']

// Divisi tiap Test Lead berdasarkan id resource (fallback field `division`, lalu Automation).
// Lead baru yang belum terdaftar otomatis masuk "Automation".
export const LEAD_DIVISION = {
  'res-lead-1': 'Automation',  // Mbincar Rukun Sembiring
  'res-lead-2': 'Automation',  // Thomas Gunawan Sardjono
  'res-lead-3': 'Automation',  // Marinda Ika Dewi Sakariana
  'res-lead-4': 'Performance', // Dio Setiawan
  'res-lead-5': 'Performance', // Putri Puspita Purwiranda
}
export const divisionOf = (r) => r.division || LEAD_DIVISION[r.id] || 'Automation'

// Divisi sebuah resource:
//  - Test Lead        -> dari LEAD_DIVISION
//  - B2B Automation   -> Automation
//  - B2B Performance  -> Performance
//  - Manager / Team Leader / lainnya -> null (tidak masuk divisi manapun)
export function resourceDivision(r) {
  const jab = r.jabatan || 'B2B Automation'
  if (jab === 'Test Automation Lead') return divisionOf(r)
  if (jab === 'B2B Automation') return 'Automation'
  if (jab === 'B2B Performance') return 'Performance'
  return null
}
