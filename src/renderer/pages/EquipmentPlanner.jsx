import React, { useState, useMemo } from 'react'
import { Search, X, Loader2, Package } from 'lucide-react'
import { EQUIPMENT_SLOTS, STAT_LABELS, CLASSES } from '../data/constants'
import { useItemSearch } from '../hooks/useApi'

const ITEM_TIERS = [
  { suffix: null, label: 'Basic', color: 'text-eq-muted', bg: 'bg-eq-panel2', border: 'border-eq-border', active: 'bg-eq-muted/20 border-eq-muted' },
  { suffix: '(Enhanced)', label: 'Enhanced', color: 'text-eq-green', bg: 'bg-eq-green/5', border: 'border-eq-green/20', active: 'bg-eq-green/20 border-eq-green' },
  { suffix: '(Exalted)', label: 'Exalted', color: 'text-eq-blue', bg: 'bg-eq-blue/5', border: 'border-eq-blue/20', active: 'bg-eq-blue/20 border-eq-blue' },
  { suffix: '(Ascendant)', label: 'Ascendant', color: 'text-eq-gold', bg: 'bg-eq-gold/5', border: 'border-eq-gold/20', active: 'bg-eq-gold/20 border-eq-gold' },
]

function getBaseName(name) {
  return name
    .replace(/\s*\(Enhanced\)\s*$/, '')
    .replace(/\s*\(Exalted\)\s*$/, '')
    .replace(/\s*\(Ascendant\)\s*$/, '')
    .trim()
}

function getItemTierIndex(name) {
  if (name.endsWith('(Ascendant)')) return 3
  if (name.endsWith('(Exalted)')) return 2
  if (name.endsWith('(Enhanced)')) return 1
  return 0
}

function groupItemsByBase(items) {
  const groups = {}
  items.forEach(item => {
    const base = getBaseName(item.Name || item.name)
    if (!groups[base]) groups[base] = { baseName: base, tiers: [null, null, null, null] }
    const tierIdx = getItemTierIndex(item.Name || item.name)
    groups[base].tiers[tierIdx] = item
  })
  return Object.values(groups)
}

export default function EquipmentPlanner({ buildState }) {
  const { build, equipItem, unequipItem, clearEquipment, equipmentStats } = buildState
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="h-full flex gap-4">
      {/* Equipment Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-eq-gold">Equipment</h2>
            <p className="text-sm text-eq-muted">Click a slot to search and equip items.</p>
          </div>
          <button onClick={clearEquipment} className="btn-secondary text-xs">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {EQUIPMENT_SLOTS.map(slot => {
            const item = build.equipment[slot.id]
            const isActive = selectedSlot === slot.id
            return (
              <button
                key={slot.id}
                onClick={() => {
                  setSelectedSlot(slot.id)
                  setShowSearch(true)
                }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                  ${isActive
                    ? 'bg-eq-blue/10 border-eq-blue'
                    : item
                      ? 'bg-eq-panel border-eq-green/30 hover:border-eq-green/50'
                      : 'bg-eq-panel border-eq-border hover:border-eq-blue/30'
                  }
                `}
              >
                <div className="w-8 h-8 rounded bg-eq-panel2 border border-eq-border flex items-center justify-center shrink-0">
                  <Package size={14} className={item ? 'text-eq-green' : 'text-eq-muted/40'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-eq-muted font-medium">
                    {slot.name}
                  </div>
                  {item ? (
                    <div className="text-xs font-medium text-eq-text truncate">
                      {item.name}
                    </div>
                  ) : (
                    <div className="text-xs text-eq-muted/50 italic">Empty</div>
                  )}
                </div>
                {item && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      unequipItem(slot.id)
                    }}
                    className="w-5 h-5 rounded text-eq-red/60 hover:text-eq-red hover:bg-eq-red/10 flex items-center justify-center shrink-0"
                  >
                    <X size={12} />
                  </button>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Item Search / Stats Panel */}
      <div className="w-80 shrink-0">
        {showSearch && selectedSlot ? (
          <ItemSearchPanel
            slotId={selectedSlot}
            slotName={EQUIPMENT_SLOTS.find(s => s.id === selectedSlot)?.name}
            classId={build.classId}
            onEquip={(item) => {
              equipItem(selectedSlot, item)
              setShowSearch(false)
            }}
            onClose={() => setShowSearch(false)}
          />
        ) : (
          <EquipmentStatsPanel stats={equipmentStats} />
        )}
      </div>
    </div>
  )
}

function ItemSearchPanel({ slotId, slotName, classId, onEquip, onClose }) {
  const { results, loading, error, search } = useItemSearch()
  const [searchName, setSearchName] = useState('')
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [selectedTiers, setSelectedTiers] = useState({})

  const grouped = useMemo(() => groupItemsByBase(results), [results])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchName.trim()) return
    search({ name: searchName })
    setExpandedGroup(null)
    setSelectedTiers({})
  }

  const getActiveTier = (baseName, tiers) => {
    if (selectedTiers[baseName] !== undefined) return selectedTiers[baseName]
    // Default to highest available tier
    for (let i = 3; i >= 0; i--) {
      if (tiers[i]) return i
    }
    return 0
  }

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header flex items-center justify-between">
        <span>Search: {slotName}</span>
        <button onClick={onClose} className="text-eq-muted hover:text-eq-text">
          <X size={14} />
        </button>
      </div>
      <form onSubmit={handleSearch} className="p-3 border-b border-eq-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="input-field text-xs"
            placeholder="Item name..."
            autoFocus
          />
          <button type="submit" disabled={loading} className="btn-primary text-xs px-3">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
          </button>
        </div>
      </form>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-eq-blue" size={24} />
          </div>
        )}
        {!loading && grouped.length === 0 && searchName && (
          <p className="text-center text-eq-muted text-xs py-8">No items found.</p>
        )}
        {grouped.map(group => {
          const isExpanded = expandedGroup === group.baseName
          const activeTier = getActiveTier(group.baseName, group.tiers)
          const activeItem = group.tiers[activeTier]
          const tierInfo = ITEM_TIERS[activeTier]
          const hasTiers = group.tiers.filter(Boolean).length > 1

          return (
            <div key={group.baseName} className="rounded-lg border border-eq-border overflow-hidden bg-eq-panel">
              {/* Item header */}
              <div
                className="flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-eq-panel2/50"
                onClick={() => setExpandedGroup(isExpanded ? null : group.baseName)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-eq-blue truncate">{group.baseName}</div>
                  {hasTiers && (
                    <div className={`text-[10px] font-semibold ${tierInfo.color}`}>
                      {tierInfo.label}
                    </div>
                  )}
                </div>
                {activeItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEquip({ ...activeItem, name: activeItem.Name || activeItem.name })
                    }}
                    className="px-2 py-1 rounded text-[10px] font-medium bg-eq-blue/20 text-eq-blue hover:bg-eq-blue/30 shrink-0"
                  >
                    Equip
                  </button>
                )}
              </div>

              {/* Expanded: tier selector + stats */}
              {isExpanded && (
                <div className="border-t border-eq-border bg-eq-panel2/30 px-2.5 py-2 space-y-2">
                  {/* Tier tabs */}
                  {hasTiers && (
                    <div className="flex gap-1">
                      {group.tiers.map((item, idx) => {
                        if (!item) return null
                        const t = ITEM_TIERS[idx]
                        const isActive = activeTier === idx
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedTiers(prev => ({ ...prev, [group.baseName]: idx }))}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-colors ${
                              isActive ? `${t.active} ${t.color}` : `${t.bg} ${t.border} ${t.color} opacity-60 hover:opacity-100`
                            }`}
                          >
                            {t.label}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Stats for active tier */}
                  {activeItem && (
                    <div className="space-y-1">
                      {/* Weapon stats */}
                      {(activeItem.damage > 0 || activeItem.delay > 0) && (
                        <div className="flex gap-3 text-[10px]">
                          {activeItem.damage > 0 && (
                            <span className="text-eq-muted">Dmg: <span className="text-eq-text font-medium">{activeItem.damage}</span></span>
                          )}
                          {activeItem.delay > 0 && (
                            <span className="text-eq-muted">Dly: <span className="text-eq-text font-medium">{activeItem.delay}</span></span>
                          )}
                          {activeItem.damage > 0 && activeItem.delay > 0 && (
                            <span className="text-eq-muted">Ratio: <span className="text-eq-text font-medium">{(activeItem.damage / activeItem.delay * 10).toFixed(1)}</span></span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {Object.entries(STAT_LABELS).map(([key, label]) => {
                          const val = activeItem[key]
                          if (!val || val === 0) return null
                          return (
                            <span key={key} className="text-[10px] text-eq-muted">
                              <span className="text-eq-text font-medium">{val > 0 ? '+' : ''}{val}</span> {label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EquipmentStatsPanel({ stats }) {
  const hasAnyStats = Object.values(stats).some(v => v !== 0)

  return (
    <div className="panel h-full">
      <div className="panel-header">Equipment Stats</div>
      <div className="p-4">
        {!hasAnyStats ? (
          <p className="text-sm text-eq-muted/60 text-center py-8">
            Equip items to see stat totals
          </p>
        ) : (
          <div className="space-y-3">
            {/* Primary stats */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1.5">Base Stats</h4>
              <div className="grid grid-cols-2 gap-1">
                {['astr', 'asta', 'aagi', 'adex', 'aint', 'awis', 'acha'].map(s => (
                  <StatRow key={s} label={STAT_LABELS[s]} value={stats[s]} />
                ))}
              </div>
            </div>

            {/* HP/Mana/AC */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1.5">Resources</h4>
              <div className="grid grid-cols-2 gap-1">
                {['ac', 'hp', 'mana', 'endur'].map(s => (
                  <StatRow key={s} label={STAT_LABELS[s]} value={stats[s]} />
                ))}
              </div>
            </div>

            {/* Resists */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1.5">Resists</h4>
              <div className="grid grid-cols-2 gap-1">
                {['fr', 'cr', 'mr', 'pr', 'dr'].map(s => (
                  <StatRow key={s} label={STAT_LABELS[s]} value={stats[s]} />
                ))}
              </div>
            </div>

            {/* Special */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1.5">Special</h4>
              <div className="grid grid-cols-2 gap-1">
                {['haste', 'attack', 'damage', 'regen', 'manaregen'].map(s => {
                  if (!stats[s]) return null
                  return <StatRow key={s} label={STAT_LABELS[s]} value={stats[s]} />
                })}
              </div>
            </div>

            {/* Heroics */}
            {['heroic_str', 'heroic_sta', 'heroic_agi', 'heroic_dex', 'heroic_int', 'heroic_wis', 'heroic_cha'].some(s => stats[s] > 0) && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1.5">Heroic Stats</h4>
                <div className="grid grid-cols-2 gap-1">
                  {['heroic_str', 'heroic_sta', 'heroic_agi', 'heroic_dex', 'heroic_int', 'heroic_wis', 'heroic_cha'].map(s => {
                    if (!stats[s]) return null
                    return <StatRow key={s} label={STAT_LABELS[s]} value={stats[s]} />
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded bg-eq-panel2/50 text-xs">
      <span className="text-eq-muted">{label}</span>
      <span className={`font-bold ${value > 0 ? 'text-eq-green' : value < 0 ? 'text-eq-red' : 'text-eq-text'}`}>
        {value > 0 ? '+' : ''}{value}
      </span>
    </div>
  )
}
