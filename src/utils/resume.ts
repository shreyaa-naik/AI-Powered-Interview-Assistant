import * as pdfjsLib from 'pdfjs-dist'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - vite worker import
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'
import mammoth from 'mammoth'

let workerReady = false
function ensurePdfWorker() {
  if (workerReady) return
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker()
  workerReady = true
}

export async function readPdf(file: File): Promise<string> {
  ensurePdfWorker()
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjsLib.getDocument({ data }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((it: any) => ('str' in it ? it.str : '')).join(' ') + '\n'
  }
  return text
}

export async function readDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

function toTitleCase(s: string) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

function guessNameFromEmail(email?: string | null) {
  if (!email) return undefined
  const local = email.split('@')[0]
  const parts = local.split(/[._-]+/).filter(Boolean)
  if (parts.length >= 2) return toTitleCase(parts.slice(0, 2).join(' '))
  if (parts.length === 1) return toTitleCase(parts[0]!)
  return undefined
}

export function extractFieldsFromText(text: string) {
  const emailMatch = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
  // Phone patterns: +cc ##########, (###) ###-####, ###-###-####, etc.
  const phoneCandidates = Array.from(
    text.matchAll(/(?:\+\d{1,3}[\s-]*)?(?:\(?\d{3}\)?[\s-]*)?\d{3}[\s-]*\d{4,}/g)
  ).map((m) => m[0])
  const phone = phoneCandidates
    .map((p) => p.replace(/[^\d+]/g, ''))
    .filter((p) => p.replace(/\D/g, '').length >= 10 && p.replace(/\D/g, '').length <= 15)
    .sort((a, b) => b.length - a.length)[0]

  // Name: labeled -> first-line guess -> from email
  const byLabel = text.match(/\bname\b\s*[:\-]?\s*([a-zA-Z ,.'-]{3,60})/i)?.[1]
  const lines = text
    .split(/\r?\n+/)
    .map((l) => l.trim())
    .filter(Boolean)

  const firstLikelyLine = lines.find((l) => {
    const lc = l.toLowerCase()
    if (lc.length < 3 || lc.length > 60) return false
    if (/(resume|curriculum|vitae|profile|email|phone|contact|experience|education|projects)/i.test(lc)) return false
    return /^[a-z ,.'-]+$/i.test(l)
  })

  const name = byLabel?.trim() || (firstLikelyLine ? toTitleCase(firstLikelyLine) : guessNameFromEmail(emailMatch?.[0]))

  return {
    name,
    email: emailMatch?.[0]?.trim(),
    phone: phone?.trim(),
  }
}

export async function extractResumeText(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop()
  if (ext === 'pdf') return readPdf(file)
  if (ext === 'docx') return readDocx(file)
  if (ext === 'txt') return await file.text()
  throw new Error('Unsupported file type. Please upload PDF or DOCX')
}


