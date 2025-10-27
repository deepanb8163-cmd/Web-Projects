import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { ReportForm } from './ReportForm'
import { Admin } from './Admin'
import { Privacy } from './Privacy'
import { Abuse } from './Abuse'
import "../app.css"

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const App: React.FC = () => {
  const [tab, setTab] = useState<'report'|'admin'|'privacy'|'abuse'>('report')
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    const socket = io(API_BASE, { transports: ['websocket'] })
    socket.on('incident:new', (payload) => setEvents(e => [`New incident: ${payload.description}`, ...e].slice(0, 4)))
    socket.on('incident:update', (payload) => setEvents(e => [`Incident ${payload.id} → ${payload.status}`, ...e].slice(0, 4)))
    return () => { socket.close() }
  }, [])

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <h1>🚑 Accident Reporting & Emergency Alert</h1>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('report')}>Report</button>
        <button onClick={() => setTab('admin')}>Admin</button>
        <button onClick={() => setTab('privacy')}>Privacy</button>
        <button onClick={() => setTab('abuse')}>Abuse</button>
      </nav>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          {tab === 'report' && <ReportForm />}
          {tab === 'admin' && <Admin />}
          {tab === 'privacy' && <Privacy />}
          {tab === 'abuse' && <Abuse />}
        </div>
        <aside style={{ width: 320 }}>
          <h3>Live feed</h3>
          <ul>
            {events.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </aside>
      </div>
    </div>
  )
}
