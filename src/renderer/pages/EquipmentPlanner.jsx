import React, { useState } from 'react'
import { Search, X, Loader2, Package } from 'lucide-react'
import { EQUIPMENT_SLOTS, STAT_LABELS, CLASSES } from '../data/constants'
import { useItemSearch } from '../hooks/useApi'

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

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchName.trim()) return
    search({ name: searchName })
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
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-eq-blue" size={24} />
          </div>
        )}
        {!loading && results.length === 0 && searchName && (
          <p className="text-center text-eq-muted text-xs py-8">No items found.</p>
        )}
        {results.map(item => (
          <button
            key={item.id}
            onClick={() => onEquip(item)}
            className="w-full text-left p-2 rounded hover:bg-eq-panel2 transition-colors"
          >
            <div className="text-xs font-medium text-eq-blue">{item.name}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {Object.entries(STAT_LABELS).map(([key, label]) => {
                const val = item[key]
                if (!val || val === 0) return null
                return (
                  <span key={key} className="text-[10px] text-eq-muted">
                    <span className="text-eq-text font-medium">{val > 0 ? '+' : ''}{val}</span> {label}
                  </span>
                )
              })}
            </div>
          </button>
        ))}
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
