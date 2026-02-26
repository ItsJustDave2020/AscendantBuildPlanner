import React, { useState, useMemo } from 'react'
import { Search, Filter, Plus, Minus, X, ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react'
import { CLASSES, TIER_COLORS } from '../data/constants'

export default function AAPlanner({ buildState, allAAs, loading }) {
  const { build, toggleAA, setAARank, removeAA, clearAllAAs, creditCosts, totalCredits } = buildState

  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState(0)  // 0 = all
  const [filterClass, setFilterClass] = useState(0) // 0 = all
  const [sortBy, setSortBy] = useState('name')
  const [expandedAA, setExpandedAA] = useState(null)
  const [showSelected, setShowSelected] = useState(false)

  // Filter out own class AAs (can't buy your own)
  const filteredAAs = useMemo(() => {
    let result = allAAs.filter(aa => aa.enabled === 1)

    // Filter out AAs that belong to the user's class (can't buy your own class's AAs)
    if (build.classId) {
      result = result.filter(aa => {
        const classNames = aa.originalClassNames || []
        return !classNames.includes(build.className)
      })
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(aa =>
        aa.name.toLowerCase().includes(term) ||
        (aa.description && aa.description.toLowerCase().includes(term))
      )
    }

    if (filterTier > 0) {
      result = result.filter(aa => aa.tier === filterTier)
    }

    if (filterClass > 0) {
      const className = CLASSES.find(c => c.id === filterClass)?.name
      if (className) {
        result = result.filter(aa =>
          aa.originalClassNames?.includes(className)
        )
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'tier': return a.tier - b.tier || a.name.localeCompare(b.name)
        case 'class': return (a.originalClassNames[0] || '').localeCompare(b.originalClassNames[0] || '')
        case 'cost': return a.totalCost - b.totalCost
        default: return 0
      }
    })

    return result
  }, [allAAs, searchTerm, filterTier, filterClass, sortBy, build.classId, build.className])

  const selectedCount = Object.keys(build.selectedAAs).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-eq-blue" size={40} />
        <span className="ml-3 text-eq-muted">Loading AA data...</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-eq-gold">AA Planner</h2>
          <p className="text-sm text-eq-muted">
            Browse and select cross-class AAs. {allAAs.length} AAs available.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSelected(!showSelected)}
            className={`btn-secondary text-xs ${showSelected ? 'ring-1 ring-eq-blue' : ''}`}
          >
            Selected ({selectedCount})
          </button>
          {selectedCount > 0 && (
            <button onClick={clearAllAAs} className="btn-danger text-xs">
              <Trash2 size={12} className="inline mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="panel mb-4">
        <div className="p-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-eq-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
                placeholder="Search AAs by name or description..."
              />
            </div>
          </div>

          <select
            value={filterTier}
            onChange={(e) => setFilterTier(parseInt(e.target.value))}
            className="select-field w-auto"
          >
            <option value={0}>All Tiers</option>
            <option value={1}>Greater (T1)</option>
            <option value={2}>Exalted (T2)</option>
            <option value={3}>Ascendant (T3)</option>
          </select>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(parseInt(e.target.value))}
            className="select-field w-auto"
          >
            <option value={0}>All Classes</option>
            {CLASSES.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select-field w-auto"
          >
            <option value="name">Sort: Name</option>
            <option value="tier">Sort: Tier</option>
            <option value="class">Sort: Class</option>
            <option value="cost">Sort: Cost</option>
          </select>
        </div>
      </div>

      {/* Credit Summary */}
      {selectedCount > 0 && (
        <div className="panel mb-4">
          <div className="panel-header text-xs">Credit Costs by Class</div>
          <div className="p-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(creditCosts).sort().map(([className, tiers]) => (
                <div key={className} className="bg-eq-panel2 rounded-lg px-3 py-2 text-xs">
                  <div className="font-semibold text-eq-text mb-1">{className}</div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(tier => {
                      if (!tiers[tier]) return null
                      const t = TIER_COLORS[tier]
                      return (
                        <span key={tier} className={`${t.text} font-medium`}>
                          {t.name[0]}: {tiers[tier]}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AA List */}
      <div className="flex-1 overflow-y-auto">
        {showSelected ? (
          <SelectedAAList
            build={build}
            setAARank={setAARank}
            removeAA={removeAA}
          />
        ) : (
          <div className="space-y-1">
            <div className="text-xs text-eq-muted mb-2">
              Showing {filteredAAs.length} AAs
            </div>
            {filteredAAs.map(aa => (
              <AACard
                key={aa.universalId}
                aa={aa}
                isSelected={!!build.selectedAAs[aa.universalId]}
                selectedRanks={build.selectedAAs[aa.universalId]?.ranks || 0}
                isExpanded={expandedAA === aa.universalId}
                onToggleExpand={() => setExpandedAA(
                  expandedAA === aa.universalId ? null : aa.universalId
                )}
                onSetRank={(rank) => setAARank(aa, rank)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AACard({ aa, isSelected, selectedRanks, isExpanded, onToggleExpand, onSetRank }) {
  const tier = TIER_COLORS[aa.tier]

  return (
    <div
      className={`
        panel transition-all duration-150 overflow-hidden
        ${isSelected ? `ring-1 ${tier.text === 'text-eq-greater' ? 'ring-eq-greater/50' : tier.text === 'text-eq-blue' ? 'ring-eq-blue/50' : 'ring-eq-gold/50'}` : ''}
      `}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-eq-panel2/50"
        onClick={onToggleExpand}
      >
        {/* Tier badge */}
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.border} ${tier.text}`}>
          {tier.name}
        </span>

        {/* Name */}
        <span className="font-medium text-sm flex-1">{aa.name}</span>

        {/* Classes */}
        <div className="flex gap-1 shrink-0">
          {aa.originalClassNames?.map(cn => {
            const cls = CLASSES.find(c => c.name === cn)
            return cls ? (
              <span
                key={cn}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ color: cls.color, backgroundColor: cls.color + '15' }}
              >
                {cls.short}
              </span>
            ) : null
          })}
        </div>

        {/* Ranks */}
        <span className="text-xs text-eq-muted w-16 text-right">
          {aa.totalRanks > 1 ? `${aa.totalRanks} ranks` : '1 rank'}
        </span>

        {/* Cost */}
        <span className={`text-xs font-medium w-14 text-right ${tier.text}`}>
          {aa.totalCost} pts
        </span>

        {/* Add/Remove Controls */}
        <div className="flex items-center gap-1 ml-2 shrink-0" onClick={e => e.stopPropagation()}>
          {isSelected ? (
            <>
              <button
                onClick={() => onSetRank(selectedRanks - 1)}
                className="w-6 h-6 rounded bg-eq-red/20 text-eq-red hover:bg-eq-red/30 flex items-center justify-center"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 text-center text-xs font-bold text-eq-text">
                {selectedRanks}/{aa.totalRanks}
              </span>
              <button
                onClick={() => onSetRank(Math.min(selectedRanks + 1, aa.totalRanks))}
                disabled={selectedRanks >= aa.totalRanks}
                className="w-6 h-6 rounded bg-eq-green/20 text-eq-green hover:bg-eq-green/30 flex items-center justify-center disabled:opacity-30"
              >
                <Plus size={12} />
              </button>
            </>
          ) : (
            <button
              onClick={() => onSetRank(1)}
              className="px-2 py-1 rounded text-xs bg-eq-blue/20 text-eq-blue hover:bg-eq-blue/30"
            >
              <Plus size={12} className="inline mr-0.5" />
              Add
            </button>
          )}
        </div>

        {/* Expand icon */}
        {isExpanded ? <ChevronUp size={14} className="text-eq-muted" /> : <ChevronDown size={14} className="text-eq-muted" />}
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-eq-border bg-eq-panel2/30 text-sm">
          {aa.description && (
            <p className="text-eq-muted mb-2">{aa.description}</p>
          )}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div>
              <span className="text-eq-muted">Expansion: </span>
              <span>{aa.expansionName}</span>
            </div>
            <div>
              <span className="text-eq-muted">Level Req: </span>
              <span>{aa.levelReq}</span>
            </div>
            <div>
              <span className="text-eq-muted">Type: </span>
              <span>{aa.typeName}</span>
            </div>
            <div>
              <span className="text-eq-muted">Total Cost: </span>
              <span className={tier.text}>{aa.totalCost} pts ({aa.totalRanks} rank{aa.totalRanks > 1 ? 's' : ''})</span>
            </div>
            {aa.recastTime > 0 && (
              <div>
                <span className="text-eq-muted">Recast: </span>
                <span>{aa.recastTime}s</span>
              </div>
            )}
          </div>
          {aa.effectSummary?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-eq-border/50">
              <span className="text-eq-muted text-xs">Effects:</span>
              {aa.effectSummary.map((eff, i) => (
                <div key={i} className="text-xs text-eq-text mt-0.5">
                  {eff.effectDesc} {eff.range && <span className="text-eq-muted">({eff.range})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SelectedAAList({ build, setAARank, removeAA }) {
  const selected = Object.entries(build.selectedAAs)

  if (selected.length === 0) {
    return (
      <div className="text-center py-12 text-eq-muted">
        <p className="text-lg mb-2">No AAs selected yet</p>
        <p className="text-sm">Browse the AA list and click "Add" to start building.</p>
      </div>
    )
  }

  // Group by tier
  const byTier = { 1: [], 2: [], 3: [] }
  selected.forEach(([id, { ranks, aa }]) => {
    byTier[aa.tier]?.push({ id, ranks, aa })
  })

  return (
    <div className="space-y-4">
      {[1, 2, 3].map(tier => {
        const items = byTier[tier]
        if (items.length === 0) return null
        const t = TIER_COLORS[tier]
        return (
          <div key={tier}>
            <h3 className={`font-display text-sm font-semibold mb-2 ${t.text}`}>
              {t.name} Tier ({items.length} AAs)
            </h3>
            <div className="space-y-1">
              {items.sort((a, b) => a.aa.name.localeCompare(b.aa.name)).map(({ id, ranks, aa }) => (
                <div
                  key={id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${t.bg} ${t.border}`}
                >
                  <span className="font-medium text-sm flex-1">{aa.name}</span>
                  <div className="flex gap-1">
                    {aa.originalClassNames?.map(cn => {
                      const cls = CLASSES.find(c => c.name === cn)
                      return cls ? (
                        <span key={cn} className="text-[10px] font-bold" style={{ color: cls.color }}>
                          {cls.short}
                        </span>
                      ) : null
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAARank(aa, ranks - 1)}
                      className="w-5 h-5 rounded bg-eq-red/20 text-eq-red hover:bg-eq-red/30 flex items-center justify-center"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">
                      {ranks}/{aa.totalRanks}
                    </span>
                    <button
                      onClick={() => setAARank(aa, ranks + 1)}
                      disabled={ranks >= aa.totalRanks}
                      className="w-5 h-5 rounded bg-eq-green/20 text-eq-green hover:bg-eq-green/30 flex items-center justify-center disabled:opacity-30"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeAA(parseInt(id))}
                    className="w-5 h-5 rounded text-eq-red/70 hover:text-eq-red hover:bg-eq-red/10 flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
