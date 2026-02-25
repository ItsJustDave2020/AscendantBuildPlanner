import React from 'react'
import { CLASSES, TIER_COLORS } from '../data/constants'

export default function Header({ build, totalCredits }) {
  const cls = CLASSES.find(c => c.id === build.classId)

  return (
    <header className="bg-eq-panel border-b border-eq-border px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-lg font-bold text-eq-gold tracking-wide">
          Ascendant Build Planner
        </h1>
        <div className="h-5 w-px bg-eq-border" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-eq-muted">Build:</span>
          <span className="font-medium text-eq-text">{build.name}</span>
        </div>
        {cls && (
          <>
            <div className="h-5 w-px bg-eq-border" />
            <div className="flex items-center gap-2 text-sm">
              <span
                className="font-semibold"
                style={{ color: cls.color }}
              >
                {cls.name}
              </span>
              {build.race && (
                <span className="text-eq-muted">({build.race})</span>
              )}
              <span className="text-eq-muted">Lv.{build.level}</span>
            </div>
          </>
        )}
      </div>

      {/* Credit summary */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map(tier => {
          const t = TIER_COLORS[tier]
          return (
            <div
              key={tier}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${t.bg} ${t.border} border ${t.text}`}
            >
              <span>{t.name}:</span>
              <span className="font-bold">{totalCredits[tier] || 0}</span>
            </div>
          )
        })}
      </div>
    </header>
  )
}
