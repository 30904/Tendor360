import * as XLSX from 'xlsx'
import { showToast } from './toast'

export function exportRowsToExcel(rows, { sheetName = 'Report', fileName } = {}) {
  if (!rows?.length) {
    showToast.warning('No data available to export')
    return false
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const resolvedName =
    fileName ||
    `${sheetName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`

  XLSX.writeFile(workbook, resolvedName)
  showToast.success('Report exported successfully')
  return true
}
