import { differenceInDays, parseISO, isValid, format } from 'date-fns'

// ── Date helpers ──────────────────────────────────────────────

/**
 * Returns number of whole days since a date string (ISO format).
 * Returns null if no date provided or unparseable.
 */
export function daysSince(dateStr) {
  if (!dateStr) return null
  try {
    const d = parseISO(dateStr)
    if (!isValid(d)) return null
    return differenceInDays(new Date(), d)
  } catch {
    return null
  }
}

/**
 * Formats a date string for display.
 * @param {string} dateStr - ISO date string
 * @param {string} [fmt='MMM d, yyyy'] - date-fns format string
 */
export function fmtDate(dateStr, fmt = 'MMM d, yyyy') {
  if (!dateStr) return null
  try {
    const d = parseISO(dateStr)
    if (!isValid(d)) return dateStr
    return format(d, fmt)
  } catch {
    return dateStr
  }
}

// ── Urgency ───────────────────────────────────────────────────

/**
 * Urgency levels for referral contacts.
 * 'secured'  → referral_status is "got referral" or "strong advocate"
 * 'overdue'  → active, last_contact > 60 days ago (or never contacted)
 * 'soon'     → active, last_contact 30–60 days ago
 * 'ok'       → active, last_contact < 30 days ago
 * 'inactive' → is_active is false
 */
export function getUrgency(contact) {
  if (!contact) return 'ok'

  const status = (contact.referral_status || '').toLowerCase().trim()
  if (status === 'got referral' || status === 'strong advocate') return 'secured'
  if (!contact.is_active) return 'inactive'

  const days = daysSince(contact.last_contact)
  if (days === null || days > 60) return 'overdue'
  if (days > 30) return 'soon'
  return 'ok'
}

/**
 * Urgency configuration for styling.
 * Each entry: { label, cssClass, borderColor, tagClass, sortOrder }
 */
export const URGENCY_CONFIG = {
  overdue: {
    label:       'Overdue',
    cssClass:    'tag-overdue',
    borderColor: 'var(--red)',
    bgColor:     'var(--red-dim)',
    textColor:   'var(--red)',
    sortOrder:   0,
  },
  soon: {
    label:       'Follow up',
    cssClass:    'tag-soon',
    borderColor: 'var(--yellow)',
    bgColor:     'var(--yellow-dim)',
    textColor:   'var(--yellow)',
    sortOrder:   1,
  },
  ok: {
    label:       'On track',
    cssClass:    'tag-ok',
    borderColor: 'var(--accent)',
    bgColor:     'var(--accent-dim)',
    textColor:   'var(--accent)',
    sortOrder:   2,
  },
  secured: {
    label:       'Secured',
    cssClass:    'tag-secured',
    borderColor: 'var(--green)',
    bgColor:     'var(--green-dim)',
    textColor:   'var(--green)',
    sortOrder:   3,
  },
  inactive: {
    label:       'Inactive',
    cssClass:    'tag-inactive',
    borderColor: 'var(--border-strong)',
    bgColor:     'var(--surface2)',
    textColor:   'var(--text3)',
    sortOrder:   4,
  },
}

/**
 * Sorts two contacts by urgency (most urgent first).
 * Within the same urgency level, sorts by last_contact ascending
 * (longest since contact rises to the top).
 */
export function sortByUrgency(a, b) {
  const ua = getUrgency(a)
  const ub = getUrgency(b)
  const oa = URGENCY_CONFIG[ua].sortOrder
  const ob = URGENCY_CONFIG[ub].sortOrder
  if (oa !== ob) return oa - ob

  // Same urgency — who was contacted longest ago floats up
  const da = a.last_contact || '0000-00-00'
  const db = b.last_contact || '0000-00-00'
  return da < db ? -1 : da > db ? 1 : 0
}

// ── Avatar helpers ────────────────────────────────────────────

/**
 * Returns 1–2 uppercase initials from a full name string.
 * "Jane Smith"  → "JS"
 * "Alice"       → "A"
 * ""            → "?"
 */
export function initials(name) {
  if (!name || !name.trim()) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Palette of background colours for avatars (accessible, distinct)
const AVATAR_PALETTE = [
  { bg: '#dbeafe', fg: '#1d4ed8' }, // blue
  { bg: '#dcfce7', fg: '#15803d' }, // green
  { bg: '#fef9c3', fg: '#854d0e' }, // yellow
  { bg: '#fce7f3', fg: '#be185d' }, // pink
  { bg: '#ede9fe', fg: '#6d28d9' }, // purple
  { bg: '#ffedd5', fg: '#c2410c' }, // orange
  { bg: '#cffafe', fg: '#0e7490' }, // cyan
  { bg: '#f1f5f9', fg: '#475569' }, // slate
]

const AVATAR_PALETTE_DARK = [
  { bg: 'rgba(59,130,246,0.18)',  fg: '#93c5fd' }, // blue
  { bg: 'rgba(74,222,128,0.15)',  fg: '#86efac' }, // green
  { bg: 'rgba(251,191,36,0.15)',  fg: '#fde68a' }, // yellow
  { bg: 'rgba(244,114,182,0.15)', fg: '#f9a8d4' }, // pink
  { bg: 'rgba(167,139,250,0.15)', fg: '#c4b5fd' }, // purple
  { bg: 'rgba(251,146,60,0.15)',  fg: '#fdba74' }, // orange
  { bg: 'rgba(34,211,238,0.15)',  fg: '#67e8f9' }, // cyan
  { bg: 'rgba(148,163,184,0.12)', fg: '#94a3b8' }, // slate
]

/**
 * Returns a consistent { bg, fg } colour pair for a given name.
 * Uses a simple hash so the same name always gets the same colour.
 */
export function avatarColor(name, darkMode = false) {
  if (!name) return (darkMode ? AVATAR_PALETTE_DARK : AVATAR_PALETTE)[0]
  const palette = darkMode ? AVATAR_PALETTE_DARK : AVATAR_PALETTE
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

/**
 * Returns avatar colors auto-detecting dark mode from the OS preference.
 */
export function avatarColorAuto(name) {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return avatarColor(name, dark)
}

// ── Misc ──────────────────────────────────────────────────────

/**
 * Generates a smart insight sentence for the referral contacts list.
 */
export function generateInsight(contacts) {
  if (!contacts || contacts.length === 0) return null

  const active = contacts.filter(c => c.is_active)

  const overdue = active
    .filter(c => getUrgency(c) === 'overdue')
    .sort((a, b) => (daysSince(b.last_contact) ?? 0) - (daysSince(a.last_contact) ?? 0))

  if (overdue.length > 0) {
    const c   = overdue[0]
    const d   = daysSince(c.last_contact)
    const dStr = d !== null ? `${d} days` : 'a while'
    return `${c.name}${c.company ? ` at ${c.company}` : ''} hasn't been contacted in ${dStr} — reach out today.`
  }

  const soon = active
    .filter(c => getUrgency(c) === 'soon')
    .sort((a, b) => (daysSince(b.last_contact) ?? 0) - (daysSince(a.last_contact) ?? 0))

  if (soon.length > 0) {
    const c = soon[0]
    const d = daysSince(c.last_contact)
    return `${c.name}${c.company ? ` at ${c.company}` : ''} is due for a follow-up — last contact was ${d} days ago.`
  }

  const secured = active.filter(c => getUrgency(c) === 'secured')
  if (secured.length > 0) {
    return `You have ${secured.length} referral${secured.length !== 1 ? 's' : ''} secured. Keep nurturing your network!`
  }

  return 'All active contacts are on track. Keep building relationships!'
}

/**
 * Truncates a string to maxLen characters with an ellipsis.
 */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

/**
 * Returns a human-friendly "X days ago" label.
 */
export function daysAgoLabel(dateStr) {
  const d = daysSince(dateStr)
  if (d === null) return null
  if (d === 0)   return 'Today'
  if (d === 1)   return '1 day ago'
  return `${d} days ago`
}
