// Export helpers — CSV (pure JS, zero dependency) + PDF (jsPDF + autotable)

// ── CSV ──────────────────────────────────────────────────────────────────────

export function downloadCSV(filename, columns, rows) {
  const escape = (v) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const header = columns.map((c) => escape(c.label)).join(',')
  const body = rows.map((row, i) => columns.map((c) => escape(c.value(row, i))).join(','))
  const csv = [header, ...body].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${yyyymmdd()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── PDF ──────────────────────────────────────────────────────────────────────

export async function downloadPDF(title, subtitle = '', columns, rows) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Header
  doc.setFillColor(20, 35, 58) // bni-navy
  doc.rect(0, 0, 297, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('COE Automation Testing Dashboard — BNI', 10, 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 10, 13)

  // Title
  doc.setTextColor(20, 35, 58)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 10, 28)
  if (subtitle) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(subtitle, 10, 34)
  }

  autoTable(doc, {
    startY: subtitle ? 38 : 34,
    head: [columns.map((c) => c.label)],
    body: rows.map((row, i) => columns.map((c) => c.value(row, i))),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 133, 124], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 10, right: 10 },
  })

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text(`Halaman ${i} dari ${pageCount}`, 287, 205, { align: 'right' })
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${yyyymmdd()}.pdf`)
}

function yyyymmdd() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}
