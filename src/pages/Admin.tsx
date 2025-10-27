import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

type Incident = {
  _id: string
  description: string
  status: string
  severity: string
  location: { lat: number; lng: number; address?: string }
  photos: string[]
  createdAt: string
}

export const Admin: React.FC = () => {
  const [token, setToken] = useState('')
  const [items, setItems] = useState<Incident[]>([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchIncidents() {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(`${API_BASE}/api/incidents`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      })
      const data = await res.json()
      if (data.items) {
        setItems(data.items)
        setMsg(`Loaded ${data.items.length} incidents`)
      } else {
        setMsg(data.error || 'Error loading incidents')
      }
    } catch (err) {
      setMsg('❌ Failed to fetch incidents. Check API or token.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchIncidents()
  }, [token])

  return (
    <div style={{ display: 'grid', gap: 12, padding: 20 }}>
      <h2>🚨 Admin Dashboard</h2>
      <input
        placeholder="JWT token (admin)"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ padding: 8, width: '100%', maxWidth: 500 }}
      />
      <button onClick={fetchIncidents} disabled={!token || loading}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>
      <div role="status" style={{ color: msg.startsWith('❌') ? 'red' : 'green' }}>
        {msg}
      </div>

      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f3f3' }}>
            <th>Time</th>
            <th>Description</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Location</th>
            <th>Photos</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id}>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td>{i.description}</td>
              <td style={{ color: i.status === 'Resolved' ? 'green' : i.status === 'Pending' ? 'orange' : 'blue' }}>
                {i.status}
              </td>
              <td
                style={{
                  fontWeight: 'bold',
                  color:
                    i.severity === 'Severe'
                      ? 'red'
                      : i.severity === 'Moderate'
                      ? 'darkorange'
                      : 'green',
                }}
              >
                {i.severity}
              </td>
              <td>
                {i.location?.address
                  ? i.location.address
                  : `${i.location?.lat?.toFixed(3)}, ${i.location?.lng?.toFixed(3)}`}
              </td>
              <td>
                {i.photos?.length > 0 ? (
                  i.photos.map((p, idx) => (
                    <a
                      key={idx}
                      href={`${API_BASE}/uploads/${p}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: 6 }}
                    >
                      📷
                    </a>
                  ))
                ) : (
                  <span>No photos</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
