import { differenceInDays, parseISO, isValid, format } from 'date-fns'

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

export function getUrgency(contact) {
  if (!contact) return 'ok'
  const status = (contact.referral_status || '').toLowerCase().trim()
  if (status.includes('got referral') || status.includes('strong advocate')) return 'secured'
  if (!contact.is_active) return 'inactive'
  const days = daysSince(contact.last_contact)
  if (days === null || days > 60) return 'overdue'
  if (days > 30) return 'soon'
  return 'ok'
}

export const URGENCY_CONFIG = {
  overdue:   { label: 'Overdue',          bg: '#FCEBEB', color: '#A32D2D', border: '#E24B4A' },
  soon:      { label: 'Follow up soon',   bg: '#FAEEDA', color: '#633806', border: '#EF9F27' },
  secured:   { label: 'Referral secured', bg: '#EAF3DE', color: '#27500A', border: '#639922' },
  ok:        { label: 'Recent',           bg: '#E6F1FB', color: '#0C447C', border: '#378ADD' },
  'no-date': { label: 'No date set',      bg: '#F1EFE8', color: '#5F5E5A', border: '#B4B2A9' },
  inactive:  { label: 'Inactive',         bg: '#F1EFE8', color: '#888780', border: '#B4B2A9' },
}

export function initials(name) {
  if (!name || !name.trim()) return '?'
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  ['#B5D4F4','#0C447C'],
  ['#9FE1CB','#085041'],
  ['#FAC775','#633806'],
  ['#F4C0D1','#72243E'],
  ['#C0DD97','#27500A'],
  ['#F5C4B3','#712B13'],
  ['#CECBF6','#3C3489'],
  ['#F0997B','#993C1D'],
]

export function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[Math.abs(h)]
}

export function generateInsight(contacts) {
  if (!contacts || contacts.length === 0) return null
  const active = contacts.filter(c => c.is_active)
  const overdue = active
    .filter(c => getUrgency(c) === 'overdue')
    .sort((a, b) => (daysSince(b.last_contact) ?? 0) - (daysSince(a.last_contact) ?? 0))
  if (overdue.length > 0) {
    const c = overdue[0]
    const d = daysSince(c.last_contact)
    const who = c.company ? c.name + ' at ' + c.company : c.name
    const days = d !== null ? d + ' days' : 'many days'
    return who + ' has not been contacted in ' + days + ' - reach out today.'
  }
  const secured = active.filter(c => getUrgency(c) === 'secured')
  if (secured.length > 0) {
    return 'You have ' + secured.length + ' referral' + (secured.length !== 1 ? 's' : '') + ' secured. Keep nurturing your network!'
  }
  return 'All active contacts are on track. Keep building relationships!'
}

export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

export function daysAgoLabel(dateStr) {
  const d = daysSince(dateStr)
  if (d === null) return null
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return d + ' days ago'
}