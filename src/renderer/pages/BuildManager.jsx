import React, { useState, useEffect, useCallback } from 'react'
import { Save, FolderOpen, Trash2, Download, Upload, Plus, Loader2, Check, AlertTriangle } from 'lucide-react'

export default function BuildManager({ buildState, allAAs }) {
  const { build, exportBuild, importBuild, resetBuild } = buildState
  const [savedBuilds, setSavedBuilds] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [saveName, setSaveName] = useState('')

  const isElectron = !!window.electronAPI

  // Load saved builds list
  const refreshList = useCallback(async () => {
    if (isElectron) {
      const builds = await window.electronAPI.listBuilds()
      setSavedBuilds(builds)
    } else {
      // Fallback to localStorage
      const keys = Object.keys(localStorage).filter(k => k.startsWith('build_'))
      setSavedBuilds(keys.map(k => k.replace('build_', '')))
    }
  }, [isElectron])

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // Save
  const handleSave = async () => {
    const name = saveName.trim() || build.name
    if (!name) return
    setLoading(true)

    try {
      const data = exportBuild()
      if (isElectron) {
        await window.electronAPI.saveBuild(name, data)
      } else {
        localStorage.setItem(`build_${name}`, JSON.stringify(data))
      }
      showMessage(`Saved "${name}" successfully!`)
      setSaveName('')
      refreshList()
    } catch (err) {
      showMessage(`Failed to save: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Load
  const handleLoad = async (name) => {
    setLoading(true)
    try {
      let data
      if (isElectron) {
        const result = await window.electronAPI.loadBuild(name)
        if (!result.success) throw new Error(result.error)
        data = result.data
      } else {
        const raw = localStorage.getItem(`build_${name}`)
        if (!raw) throw new Error('Build not found')
        data = JSON.parse(raw)
      }
      importBuild(data, allAAs)
      showMessage(`Loaded "${name}"!`)
    } catch (err) {
      showMessage(`Failed to load: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Delete
  const handleDelete = async (name) => {
    if (!confirm(`Delete build "${name}"?`)) return
    try {
      if (isElectron) {
        await window.electronAPI.deleteBuild(name)
      } else {
        localStorage.removeItem(`build_${name}`)
      }
      showMessage(`Deleted "${name}"`)
      refreshList()
    } catch (err) {
      showMessage(`Failed to delete: ${err.message}`, 'error')
    }
  }

  // Export to clipboard
  const handleExportClipboard = () => {
    const data = exportBuild()
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    showMessage('Build copied to clipboard!')
  }

  // Import from clipboard
  const handleImportClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const data = JSON.parse(text)
      importBuild(data, allAAs)
      showMessage('Build imported from clipboard!')
    } catch (err) {
      showMessage('Failed to import: invalid build data', 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-eq-gold">Build Manager</h2>
        <p className="text-sm text-eq-muted">Save, load, and share your builds.</p>
      </div>

      {/* Status message */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          message.type === 'error'
            ? 'bg-eq-red/10 border border-eq-red/30 text-eq-red'
            : 'bg-eq-green/10 border border-eq-green/30 text-eq-green'
        }`}>
          {message.type === 'error' ? <AlertTriangle size={14} /> : <Check size={14} />}
          {message.text}
        </div>
      )}

      {/* Save Panel */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <Save size={14} />
          Save Current Build
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="input-field flex-1"
              placeholder={build.name || 'Build name...'}
            />
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Saved Builds */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <FolderOpen size={14} />
          Saved Builds ({savedBuilds.length})
        </div>
        <div className="p-4">
          {savedBuilds.length === 0 ? (
            <p className="text-sm text-eq-muted/60 text-center py-6">
              No saved builds yet. Create one above!
            </p>
          ) : (
            <div className="space-y-2">
              {savedBuilds.map(name => (
                <div
                  key={name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-eq-panel2 border border-eq-border hover:border-eq-blue/30 transition-colors"
                >
                  <span className="flex-1 font-medium text-sm">{name}</span>
                  <button
                    onClick={() => handleLoad(name)}
                    className="btn-primary text-xs py-1.5"
                  >
                    <FolderOpen size={12} className="inline mr-1" />
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(name)}
                    className="btn-danger text-xs py-1.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Import/Export */}
      <div className="panel">
        <div className="panel-header">Share Builds</div>
        <div className="p-4 flex gap-3">
          <button onClick={handleExportClipboard} className="btn-secondary flex items-center gap-2 flex-1">
            <Upload size={14} />
            Copy Build to Clipboard
          </button>
          <button onClick={handleImportClipboard} className="btn-secondary flex items-center gap-2 flex-1">
            <Download size={14} />
            Import from Clipboard
          </button>
        </div>
      </div>

      {/* New Build */}
      <div className="panel">
        <div className="panel-header">New Build</div>
        <div className="p-4">
          <button
            onClick={() => {
              if (confirm('Start a new build? Unsaved changes will be lost.')) {
                resetBuild()
                showMessage('New build created!')
              }
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus size={14} />
            Start Fresh Build
          </button>
        </div>
      </div>
    </div>
  )
}
