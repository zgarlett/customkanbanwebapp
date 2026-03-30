import './App.css'
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'
import BoardList from './pages/BoardList'

function App() {

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-shell__header">
          <div className="app-shell__brand">
            <span className="app-shell__dot" aria-hidden="true" />
            <strong>Kanban HQ</strong>
          </div>

          <nav className="app-shell__menu" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Dashboard
            </NavLink>
            <NavLink
              to="/boards"
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              Board List
            </NavLink>
            <NavLink to="/board" className={({ isActive }) => (isActive ? 'is-active' : '')}>
              Board
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/board" element={<Board />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
