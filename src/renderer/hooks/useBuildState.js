import { useState, useCallback, useMemo } from 'react'
import { STATS, EQUIPMENT_SLOTS } from '../data/constants'

const emptyEquipment = () => {
  const eq = {}
  EQUIPMENT_SLOTS.forEach(slot => { eq[slot.id] = null })
  return eq
}

const defaultBuild = () => ({
  name: 'New Build',
  race: '',
  classId: null,
  className: '',
  level: 60,
  // Selected AAs: { [universalId]: { ranks: number, aa: aaObject } }
  selectedAAs: {},
  // Equipment: { [slotId]: itemObject | null }
  equipment: emptyEquipment(),
})

export function useBuildState() {
  const [build, setBuild] = useState(defaultBuild())

  const setCharacter = useCallback((updates) => {
    setBuild(prev => ({ ...prev, ...updates }))
  }, [])

  const resetBuild = useCallback(() => {
    setBuild(defaultBuild())
  }, [])

  // AA Management
  const toggleAA = useCallback((aa, maxRank = null) => {
    setBuild(prev => {
      const selected = { ...prev.selectedAAs }
      const id = aa.universalId

      if (selected[id]) {
        // If already selected, increment rank or remove
        if (maxRank && selected[id].ranks < maxRank) {
          selected[id] = { ...selected[id], ranks: selected[id].ranks + 1 }
        } else {
          delete selected[id]
        }
      } else {
        // Add with rank 1
        selected[id] = { ranks: 1, aa }
      }

      return { ...prev, selectedAAs: selected }
    })
  }, [])

  const setAARank = useCallback((aa, rank) => {
    setBuild(prev => {
      const selected = { ...prev.selectedAAs }
      const id = aa.universalId

      if (rank <= 0) {
        delete selected[id]
      } else {
        selected[id] = { ranks: Math.min(rank, aa.totalRanks), aa }
      }

      return { ...prev, selectedAAs: selected }
    })
  }, [])

  const removeAA = useCallback((universalId) => {
    setBuild(prev => {
      const selected = { ...prev.selectedAAs }
      delete selected[universalId]
      return { ...prev, selectedAAs: selected }
    })
  }, [])

  const clearAllAAs = useCallback(() => {
    setBuild(prev => ({ ...prev, selectedAAs: {} }))
  }, [])

  // Equipment Management
  const equipItem = useCallback((slotId, item) => {
    setBuild(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slotId]: item }
    }))
  }, [])

  const unequipItem = useCallback((slotId) => {
    setBuild(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slotId]: null }
    }))
  }, [])

  const clearEquipment = useCallback(() => {
    setBuild(prev => ({ ...prev, equipment: emptyEquipment() }))
  }, [])

  // Credit costs by tier and class
  const creditCosts = useMemo(() => {
    const costs = {} // { className: { 1: count, 2: count, 3: count } }
    Object.values(build.selectedAAs).forEach(({ ranks, aa }) => {
      aa.originalClassNames.forEach(cls => {
        if (!costs[cls]) costs[cls] = { 1: 0, 2: 0, 3: 0 }
        costs[cls][aa.tier] = (costs[cls][aa.tier] || 0) + ranks
      })
    })
    return costs
  }, [build.selectedAAs])

  // Total credits by tier
  const totalCredits = useMemo(() => {
    const totals = { 1: 0, 2: 0, 3: 0 }
    Object.values(build.selectedAAs).forEach(({ ranks, aa }) => {
      totals[aa.tier] = (totals[aa.tier] || 0) + ranks
    })
    return totals
  }, [build.selectedAAs])

  // Total equipment stats
  const equipmentStats = useMemo(() => {
    const totals = {}
    STATS.forEach(s => { totals[s] = 0 })

    Object.values(build.equipment).forEach(item => {
      if (!item) return
      STATS.forEach(stat => {
        if (item[stat]) totals[stat] += item[stat]
      })
    })
    return totals
  }, [build.equipment])

  // Save/Load
  const exportBuild = useCallback(() => {
    return {
      name: build.name,
      race: build.race,
      classId: build.classId,
      className: build.className,
      level: build.level,
      selectedAAs: Object.fromEntries(
        Object.entries(build.selectedAAs).map(([id, { ranks, aa }]) => [
          id, { ranks, aaId: aa.universalId, aaName: aa.name, tier: aa.tier }
        ])
      ),
      equipment: Object.fromEntries(
        Object.entries(build.equipment).map(([slot, item]) => [
          slot, item ? { id: item.id, name: item.name } : null
        ])
      ),
    }
  }, [build])

  const importBuild = useCallback((data, allAAs = []) => {
    const aaMap = {}
    allAAs.forEach(aa => { aaMap[aa.universalId] = aa })

    const selectedAAs = {}
    if (data.selectedAAs) {
      Object.entries(data.selectedAAs).forEach(([id, { ranks }]) => {
        if (aaMap[id]) {
          selectedAAs[id] = { ranks, aa: aaMap[id] }
        }
      })
    }

    setBuild({
      name: data.name || 'Imported Build',
      race: data.race || '',
      classId: data.classId || null,
      className: data.className || '',
      level: data.level || 60,
      selectedAAs,
      equipment: data.equipment
        ? Object.fromEntries(
            EQUIPMENT_SLOTS.map(slot => [
              slot.id,
              data.equipment[slot.id] || null
            ])
          )
        : emptyEquipment(),
    })
  }, [])

  return {
    build,
    setCharacter,
    resetBuild,
    toggleAA,
    setAARank,
    removeAA,
    clearAllAAs,
    equipItem,
    unequipItem,
    clearEquipment,
    creditCosts,
    totalCredits,
    equipmentStats,
    exportBuild,
    importBuild,
  }
}
