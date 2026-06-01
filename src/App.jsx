import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { ToastProvider } from './hooks/useToast.jsx'

// ── Page placeholders (replace with real pages) ───────────────
// import ReferralsPage       from './pages/referrals/ReferralsPage.jsx'
// import LeadsPage           from './pages/leads/LeadsPage.jsx'
// import TargetCompaniesPage from './pages/target-companies/TargetCompaniesPage.jsx'
// import AppDaysPage         from './pages/appdays/AppDaysPage.jsx'

function Placeholder({ title }) {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module</div>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
      <div className="page-body">
        <div className="empty">
          <i className="ti ti-layout-dashboard" />
          <div className="empty-title">Coming soon</div>
          <div className="empty-sub">This page is under construction.</div>
        </div>
      </div>
    </div>
  )
}

// ── Navigation config ─────────────────────────────────────────
const NAV_LINKS = [
  {
    to:    '/',
    label: 'Referral Details',
    icon:  'ti-users',
    exact: true,
  },
  {
    to:    '/leads',
    label: 'Leads',
    icon:  'ti-user-search',
    exact: false,
  },
  {
    to:    '/target-companies',
    label: 'Target Companies',
    icon:  'ti-target',
    exact: false,
  },
  {
    to:    '/companies',
    label: 'Companies + Refs',
    icon:  'ti-building',
    exact: false,
  },
]

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      {/* Logo / brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">Jay's Job Hunt</div>
        <div className="sidebar-logo-sub">2026 MBA Search</div>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV_LINKS.map(({ to, label, icon, exact }) => {
          const isActive = exact
            ? location.pathname === to
            : location.pathname === to || location.pathname.startsWith(to + '/')

          return (
            <NavLink
              key={to}
              to={to}
              className={`sidebar-nav-link${isActive ? ' active' : ''}`}
            >
              <i className={`ti ${icon}`} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        MBA Job Hunt · 2026
      </div>
    </aside>
  )
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"                  element={<Placeholder title="Referral Details" />} />
            <Route path="/leads"             element={<Placeholder title="Leads" />} />
            <Route path="/target-companies"  element={<Placeholder title="Target Companies" />} />
            <Route path="/companies"         element={<Placeholder title="Companies + Refs" />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  )
}

/* ── To wire up real pages, swap out the Placeholder elements:

  import ReferralsPage       from './pages/referrals/ReferralsPage.jsx'
  import LeadsPage           from './pages/leads/LeadsPage.jsx'
  import TargetCompaniesPage from './pages/target-companies/TargetCompaniesPage.jsx'
  import AppDaysPage         from './pages/appdays/AppDaysPage.jsx'

  <Route path="/"                 element={<ReferralsPage />} />
  <Route path="/leads"            element={<LeadsPage />} />
  <Route path="/target-companies" element={<TargetCompaniesPage />} />
  <Route path="/companies"        element={<AppDaysPage />} />

── */
