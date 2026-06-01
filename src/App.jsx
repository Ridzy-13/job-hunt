import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import ReferralPage from './pages/ReferralPage.jsx'
import CompaniesPage from './pages/CompaniesPage.jsx'
import LeadsPage from './pages/LeadsPage.jsx'
import TargetCompaniesPage from './pages/TargetCompaniesPage.jsx'

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        Jay's Job Hunt
        <span>2026 MBA Search</span>
      </div>
      <NavLink exact to="/" className="nav-link" activeClassName="active">
        <i className="ti ti-users" /> Referral details
      </NavLink>
      <NavLink to="/leads" className="nav-link" activeClassName="active">
        <i className="ti ti-user-search" /> Leads
      </NavLink>
      <NavLink to="/target-companies" className="nav-link" activeClassName="active">
        <i className="ti ti-target" /> Target companies
      </NavLink>
      <NavLink to="/companies" className="nav-link" activeClassName="active">
        <i className="ti ti-building" /> Companies + refs
      </NavLink>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Switch>
            <Route exact path="/" component={ReferralPage} />
            <Route path="/leads" component={LeadsPage} />
            <Route path="/target-companies" component={TargetCompaniesPage} />
            <Route path="/companies" component={CompaniesPage} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  )
}