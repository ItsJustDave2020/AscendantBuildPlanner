import React from 'react'
import { BarChart3, Scroll, Shield, Coins } from 'lucide-react'
import { CLASSES, TIER_COLORS, STAT_LABELS, EQUIPMENT_SLOTS } from '../data/constants'

export default function BuildSummary({ buildState, allAAs }) {
  const { build, creditCosts, totalCredits, equipmentStats } = buildState

  const selectedAACount = Object.keys(build.selectedAAs).length
  const equippedItemCount = Object.values(build.equipment).filter(Boolean).length

  const cls = CLASSES.find(c => c.id === build.classId)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-eq-gold">Build Summary</h2>
        <p className="text-sm text-eq-muted">Overview of your complete character build.</p>
      </div>

      {/* Character Info */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <BarChart3 size={14} />
          Character
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-eq-muted block">Build Name</span>
              <span className="font-semibold text-eq-text">{build.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-eq-muted block">Class</span>
              <span className="font-semibold" style={{ color: cls?.color }}>
                {cls?.name || 'None'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-eq-muted block">Race</span>
              <span className="font-semibold text-eq-text">{build.race || 'None'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-eq-muted block">Level</span>
              <span className="font-semibold text-eq-blue">{build.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AA Summary */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <Scroll size={14} />
          Cross-Class AAs ({selectedAACount} selected)
        </div>
        <div className="p-4 space-y-4">
          {/* Tier totals */}
          <div className="flex gap-4">
            {[1, 2, 3].map(tier => {
              const t = TIER_COLORS[tier]
              const count = totalCredits[tier] || 0
              return (
                <div key={tier} className={`flex-1 p-3 rounded-lg border ${t.bg} ${t.border}`}>
                  <div className={`text-xs font-semibold ${t.text}`}>{t.name}</div>
                  <div className="text-2xl font-bold text-eq-text">{count}</div>
                  <div className="text-[10px] text-eq-muted">credits needed</div>
                </div>
              )
            })}
          </div>

          {/* Credit costs breakdown by class */}
          {Object.keys(creditCosts).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-eq-muted mb-2 flex items-center gap-1">
                <Coins size={12} />
                Tome Requirements (Credits per Class)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-eq-border">
                      <th className="text-left py-1.5 px-2 text-eq-muted font-medium">Class</th>
                      <th className={`text-center py-1.5 px-2 ${TIER_COLORS[1].text}`}>Greater</th>
                      <th className={`text-center py-1.5 px-2 ${TIER_COLORS[2].text}`}>Exalted</th>
                      <th className={`text-center py-1.5 px-2 ${TIER_COLORS[3].text}`}>Ascendant</th>
                      <th className="text-center py-1.5 px-2 text-eq-muted">Total</th>
                      <th className="text-right py-1.5 px-2 text-eq-gold">Plat Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(creditCosts).sort().map(([className, tiers]) => {
                      const total = (tiers[1] || 0) + (tiers[2] || 0) + (tiers[3] || 0)
                      const platCost = (tiers[1] || 0) * 100 + (tiers[2] || 0) * 300 + (tiers[3] || 0) * 500
                      const cls = CLASSES.find(c => c.name === className)
                      return (
                        <tr key={className} className="border-b border-eq-border/30 hover:bg-eq-panel2/30">
                          <td className="py-1.5 px-2 font-medium" style={{ color: cls?.color }}>
                            {className}
                          </td>
                          <td className="text-center py-1.5 px-2">{tiers[1] || '-'}</td>
                          <td className="text-center py-1.5 px-2">{tiers[2] || '-'}</td>
                          <td className="text-center py-1.5 px-2">{tiers[3] || '-'}</td>
                          <td className="text-center py-1.5 px-2 font-bold">{total}</td>
                          <td className="text-right py-1.5 px-2 text-eq-gold font-medium">
                            {platCost.toLocaleString()}pp
                          </td>
                        </tr>
                      )
                    })}
                    <tr className="font-bold bg-eq-panel2/30">
                      <td className="py-1.5 px-2">TOTAL</td>
                      <td className="text-center py-1.5 px-2">{totalCredits[1] || 0}</td>
                      <td className="text-center py-1.5 px-2">{totalCredits[2] || 0}</td>
                      <td className="text-center py-1.5 px-2">{totalCredits[3] || 0}</td>
                      <td className="text-center py-1.5 px-2">
                        {(totalCredits[1] || 0) + (totalCredits[2] || 0) + (totalCredits[3] || 0)}
                      </td>
                      <td className="text-right py-1.5 px-2 text-eq-gold">
                        {(
                          (totalCredits[1] || 0) * 100 +
                          (totalCredits[2] || 0) * 300 +
                          (totalCredits[3] || 0) * 500
                        ).toLocaleString()}pp
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selected AA list */}
          {selectedAACount > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-eq-muted mb-2">Selected AAs</h4>
              <div className="grid grid-cols-2 gap-1">
                {Object.values(build.selectedAAs)
                  .sort((a, b) => a.aa.tier - b.aa.tier || a.aa.name.localeCompare(b.aa.name))
                  .map(({ ranks, aa }) => {
                    const t = TIER_COLORS[aa.tier]
                    return (
                      <div key={aa.universalId} className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-eq-panel2/50">
                        <span className={`text-[9px] font-bold uppercase ${t.text}`}>{t.name[0]}</span>
                        <span className="flex-1 truncate">{aa.name}</span>
                        <span className="text-eq-muted">{ranks}/{aa.totalRanks}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Summary */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <Shield size={14} />
          Equipment ({equippedItemCount}/{EQUIPMENT_SLOTS.length} slots)
        </div>
        <div className="p-4">
          {equippedItemCount === 0 ? (
            <p className="text-sm text-eq-muted/60 text-center py-4">No items equipped.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                {EQUIPMENT_SLOTS.map(slot => {
                  const item = build.equipment[slot.id]
                  if (!item) return null
                  return (
                    <div key={slot.id} className="flex gap-2 text-xs">
                      <span className="text-eq-muted w-20 shrink-0">{slot.name}:</span>
                      <span className="text-eq-blue font-medium truncate">{item.name}</span>
                    </div>
                  )
                })}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-eq-muted mb-2">Total Equipment Stats</h4>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(STAT_LABELS).map(([key, label]) => {
                    const val = equipmentStats[key]
                    if (!val) return null
                    return (
                      <div key={key} className="flex items-center justify-between px-2 py-0.5 text-xs">
                        <span className="text-eq-muted">{label}</span>
                        <span className={`font-bold ${val > 0 ? 'text-eq-green' : 'text-eq-red'}`}>
                          {val > 0 ? '+' : ''}{val}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
