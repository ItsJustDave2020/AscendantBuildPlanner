import { useState, useEffect, useCallback } from 'react'
import { API_BASE } from '../data/constants'

// Generic fetch hook
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}${url}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!cancelled) setData(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}

// AA Tree - all universal AAs
export function useAATree() {
  const { data, loading, error } = useFetch('/api/aa/universal/tree')
  return {
    abilities: data?.abilities || [],
    loading,
    error,
  }
}

// Item search
export function useItemSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          query.set(key, value)
        }
      })
      query.set('limit', '100')

      const res = await fetch(`${API_BASE}/api/items/search?${query.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}

// Spell search
export function useSpellSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          query.set(key, value)
        }
      })
      query.set('limit', '100')

      const res = await fetch(`${API_BASE}/api/spells/search?${query.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}
