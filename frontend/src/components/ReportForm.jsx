import { useState } from 'react'
import api from './api.js'

export default function ReportForm() {
  const [description, setDescription] = useState('')
  const [coords, setCoords] = useState(null)
  const [locStatus, setLocStatus] = useState('idle') // idle | fetching | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('error')
      return
    }
    setLocStatus('fetching')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus('done')
      },
      () => setLocStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description) return
    setSubmitting(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.post('/events/submit-text', {
        text: description,
        latitude: coords?.lat,
        longitude: coords?.lng,
      })

      if (res.data.duplicate) {
        setError(res.data.message || 'This looks like a duplicate report.')
      } else {
        setResult(res.data.event || res.data.result || res.data)
        setToast('Weather report submitted successfully ✅')
        setDescription('')
        setTimeout(() => setToast(null), 6000)
      }
    } catch (err) {
      console.error(err)
      const detail = err.response?.data?.detail
      setError(detail ? JSON.stringify(detail) : err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
      <h2 className="text-white font-semibold mb-4">Submit Weather Report</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <button
          type="button"
          onClick={getLocation}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 flex items-center gap-2 w-fit"
        >
          📍 {locStatus === 'fetching' ? 'Getting location...' : coords ? 'Location captured ✓' : 'Use my location (optional)'}
        </button>
        {locStatus === 'error' && (
          <p className="text-red-400 text-xs">Couldn't get location — check permissions.</p>
        )}

        <textarea
          placeholder="Describe the weather event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="bg-slate-800 text-white placeholder-slate-500 rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={submitting || !description}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-4 py-2 transition disabled:opacity-50"
        >
          {submitting ? 'Analyzing...' : 'Submit Report'}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      {result && (
        <div className="mt-4 bg-slate-800 border border-green-500/40 rounded-lg p-3 text-sm">
          <p className="text-green-400">✓ Event detected: {result.event_type}</p>
          <p className="text-green-400">✓ Location identified: {result.city || 'Not detected'}</p>
          <p className="text-green-400">✓ Severity: {result.severity}</p>
          <p className="text-green-400">✓ Confidence: {result.confidence}%</p>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', top: '95%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#22a316', color: '#fff',
          padding: '13px 28px', borderRadius: 12,
          fontSize: 18, fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          zIndex: 9999,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}