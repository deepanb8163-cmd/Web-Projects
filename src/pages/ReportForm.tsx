import React, { useEffect, useState } from 'react'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const ReportForm: React.FC = () => {
  const [desc, setDesc] = useState('')
  const [coords, setCoords] = useState<{lat:number, lng:number} | null>(null)
  const [address, setAddress] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!coords) { setMsg('Location not available'); return }

    const fd = new FormData()
    fd.append('description', desc)
    fd.append('lat', String(coords.lat))
    fd.append('lng', String(coords.lng))
    fd.append('address', address)
    fd.append('severity', severity)
    if (photos) Array.from(photos).forEach(p => fd.append('photos', p))

    const res = await fetch(`${API_BASE}/api/incidents`, { method: 'POST', body: fd })
    const data = await res.json()
    if (data.ok) setMsg('Incident submitted successfully.')
    else setMsg(data.error || 'Error submitting')
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <h2>Report an Accident</h2>
      <textarea placeholder="What happened?" value={desc} onChange={e => setDesc(e.target.value)} required />
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Address (optional)" value={address} onChange={e => setAddress(e.target.value)} />
        <select value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <input type="file" accept="image/*" multiple onChange={e => setPhotos(e.target.files)} />
      </div>
      <button type="submit">Submit</button>
      <div>{coords ? `Your location: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Locating...'}</div>
      <div role="status">{msg}</div>
    </form>
  )
}
