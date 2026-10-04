// ─── PDF & Printable Document Report Generator for Scrolln't Pro ───────────────
import { shareContent } from './nativeShare'

export interface WeeklyReportData {
  userName: string
  dateRange: string
  totalMinutes: number
  improvement: number
  grade: string
  currentStreak: number
  xpEarned: number
  sessionsCompleted: number
  distractionsBlocked: number
  squadRank: string
  dailyMinutes: number[]
  themeAccent?: string
}

export function generateReportHtml(data: WeeklyReportData): string {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Math.floor(data.totalMinutes / 60)
  const mins = data.totalMinutes % 60
  const maxDay = Math.max(...data.dailyMinutes, 1)

  const barsHtml = data.dailyMinutes
    .map((m, i) => {
      const pct = Math.max(8, Math.round((m / maxDay) * 100))
      return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <span style="font-size: 11px; font-weight: 700; color: ${m > 0 ? '#C8FF00' : '#666'}; font-family: monospace;">${m}m</span>
        <div style="width: 100%; height: 100px; background: #141414; border-radius: 6px; display: flex; align-items: flex-end; overflow: hidden; padding: 2px;">
          <div style="width: 100%; height: ${pct}%; background: ${m > 0 ? '#C8FF00' : '#222'}; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 12px; font-weight: 800; color: #888; font-family: sans-serif;">${days[i]}</span>
      </div>
    `
    })
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scrolln't Weekly Productivity Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media print {
      body { background: #080808 !important; color: #f5f5f5 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      @page { margin: 12mm; size: auto; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #080808;
      color: #F5F5F5;
      padding: 24px;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.5;
    }
    .card {
      background: #0E0E0E;
      border: 1px solid #222;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .accent { color: #C8FF00; }
    .badge {
      display: inline-block;
      background: rgba(200,255,0,0.15);
      border: 1px solid rgba(200,255,0,0.4);
      color: #C8FF00;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid #222; padding-bottom: 16px;">
    <div>
      <div style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;">
        🗿 SCROLLN'T <span class="badge">PRO REPORT</span>
      </div>
      <div style="font-size: 13px; color: #888; margin-top: 4px;">Discipline & Screen Time Mastery · ${data.dateRange}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 14px; font-weight: 700; color: #CCC;">${data.userName}</div>
      <div style="font-size: 12px; color: #666;">Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
    </div>
  </div>

  <!-- Main Hero Score -->
  <div class="card" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(200,255,0,0.08) 0%, rgba(14,14,14,1) 100%);">
    <div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 4px;">Total Focus Time</div>
      <div style="font-size: 38px; font-weight: 900; color: #C8FF00; letter-spacing: -1px; line-height: 1;">
        ${hours}h ${mins}m
      </div>
      <div style="font-size: 13px; color: ${data.improvement >= 0 ? '#C8FF00' : '#FF3B30'}; margin-top: 6px; font-weight: 700;">
        ${data.improvement >= 0 ? '↑' : '↓'} ${Math.abs(data.improvement)}% vs previous week
      </div>
    </div>
    <div style="text-align: center; background: #080808; border: 1px solid #222; border-radius: 16px; padding: 14px 22px;">
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888;">Grade</div>
      <div style="font-size: 36px; font-weight: 900; color: #C8FF00; line-height: 1; margin-top: 2px;">${data.grade}</div>
    </div>
  </div>

  <!-- Daily Breakdown Chart -->
  <div class="card">
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 14px;">Daily Focus Breakdown</div>
    <div style="display: flex; gap: 8px; align-items: flex-end; height: 130px;">
      ${barsHtml}
    </div>
  </div>

  <!-- Key Metrics Grid -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
    <div class="card" style="margin-bottom: 0; padding: 14px;">
      <div style="font-size: 11px; color: #888; text-transform: uppercase;">Streak Maintained</div>
      <div style="font-size: 22px; font-weight: 900; color: #FFB800; margin-top: 4px;">🔥 ${data.currentStreak} Days</div>
    </div>
    <div class="card" style="margin-bottom: 0; padding: 14px;">
      <div style="font-size: 11px; color: #888; text-transform: uppercase;">XP Earned</div>
      <div style="font-size: 22px; font-weight: 900; color: #BF7FFF; margin-top: 4px;">⚡ +${data.xpEarned.toLocaleString()} XP</div>
    </div>
    <div class="card" style="margin-bottom: 0; padding: 14px;">
      <div style="font-size: 11px; color: #888; text-transform: uppercase;">Sessions Finished</div>
      <div style="font-size: 22px; font-weight: 900; color: #C8FF00; margin-top: 4px;">✓ ${data.sessionsCompleted} Complete</div>
    </div>
    <div class="card" style="margin-bottom: 0; padding: 14px;">
      <div style="font-size: 11px; color: #888; text-transform: uppercase;">Distractions Blocked</div>
      <div style="font-size: 22px; font-weight: 900; color: #FF3B30; margin-top: 4px;">🛡️ ${data.distractionsBlocked} Blocked</div>
    </div>
  </div>

  <!-- Footer Seal -->
  <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1A1A1A;">
    <div style="font-size: 18px; margin-bottom: 4px;">🗿</div>
    <div style="font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 0.1em;">
      Certified Scrolln't Discipline Record · Stay Hard
    </div>
  </div>

  <div class="no-print" style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="background: #C8FF00; color: #080808; border: none; font-weight: 900; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-size: 15px; text-transform: uppercase;">
      🖨️ Print / Save as PDF
    </button>
  </div>
</body>
</html>`
}

/**
 * Triggers PDF export / print dialog or opens printable view
 */
export async function exportReportToPDF(data: WeeklyReportData): Promise<boolean> {
  const html = generateReportHtml(data)

  // 1. If in browser/WebView with print support, create print frame
  try {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => {
        try {
          printWindow.focus()
          printWindow.print()
        } catch {}
      }, 350)
      return true
    }
  } catch {}

  // 2. Direct window.print fallback
  if (typeof window !== 'undefined' && typeof window.print === 'function') {
    try {
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = '0'
      document.body.appendChild(iframe)

      const doc = iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(html)
        doc.close()
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus()
            iframe.contentWindow?.print()
            setTimeout(() => document.body.removeChild(iframe), 2000)
          } catch {
            document.body.removeChild(iframe)
          }
        }, 400)
        return true
      }
    } catch {}
  }

  // 3. Fallback: Download HTML file that opens in PDF-printer
  downloadReportHTML(data)
  return true
}

/**
 * Downloads standalone HTML file for offline viewing or printing to PDF
 */
export function downloadReportHTML(data: WeeklyReportData): void {
  try {
    const html = generateReportHtml(data)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scrollnt-weekly-report-${new Date().toISOString().slice(0, 10)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (err) {
    console.error('Failed to download report HTML:', err)
  }
}

/**
 * Shares full report text summary via native share
 */
export async function shareFullWeeklyReport(data: WeeklyReportData): Promise<boolean> {
  const hours = Math.floor(data.totalMinutes / 60)
  const mins = data.totalMinutes % 60
  const text = `📊 SCROLLN'T WEEKLY REPORT (${data.dateRange})
━━━━━━━━━━━━━━━━━━━━
⏱️ Total Focus: ${hours}h ${mins}m (${data.improvement >= 0 ? '+' : ''}${data.improvement}% vs last week)
🏆 Grade: ${data.grade}
🔥 Current Streak: ${data.currentStreak} Days
⚡ XP Earned: +${data.xpEarned.toLocaleString()} XP
✓ Sessions Completed: ${data.sessionsCompleted}
🛡️ Distractions Blocked: ${data.distractionsBlocked} times
👥 Squad Rank: ${data.squadRank}
━━━━━━━━━━━━━━━━━━━━
🗿 Unshakable focus powered by Scrolln't`

  return shareContent({
    title: "Scrolln't Weekly Productivity Report",
    text,
  })
}
