import React from 'react'
import { User, Info } from 'lucide-react'
import { CLASSES, RACES, RACE_CLASS_MATRIX } from '../data/constants'

export default function CharacterSetup({ buildState }) {
  const { build, setCharacter } = buildState

  const availableClasses = build.race
    ? RACE_CLASS_MATRIX[build.race]?.map(id => CLASSES.find(c => c.id === id)).filter(Boolean) || []
    : CLASSES

  const availableRaces = build.classId
    ? RACES.filter(race => RACE_CLASS_MATRIX[race]?.includes(build.classId))
    : RACES

  const handleClassChange = (classId) => {
    const cls = CLASSES.find(c => c.id === classId)
    setCharacter({
      classId,
      className: cls?.name || '',
      // Clear race if incompatible
      race: build.race && RACE_CLASS_MATRIX[build.race]?.includes(classId) ? build.race : '',
    })
  }

  const handleRaceChange = (race) => {
    setCharacter({
      race,
      // Clear class if incompatible
      classId: build.classId && RACE_CLASS_MATRIX[race]?.includes(build.classId)
        ? build.classId : null,
      className: build.classId && RACE_CLASS_MATRIX[race]?.includes(build.classId)
        ? build.className : '',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-eq-gold mb-1">Character Setup</h2>
        <p className="text-sm text-eq-muted">Choose your race and class to begin planning your build.</p>
      </div>

      {/* Build Name */}
      <div className="panel">
        <div className="panel-header">Build Name</div>
        <div className="p-4">
          <input
            type="text"
            value={build.name}
            onChange={(e) => setCharacter({ name: e.target.value })}
            className="input-field max-w-md"
            placeholder="My Awesome Build"
          />
        </div>
      </div>

      {/* Level */}
      <div className="panel">
        <div className="panel-header">Level</div>
        <div className="p-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="60"
              value={build.level}
              onChange={(e) => setCharacter({ level: parseInt(e.target.value) })}
              className="flex-1 accent-eq-blue"
            />
            <span className="text-2xl font-bold text-eq-blue w-12 text-right">{build.level}</span>
          </div>
        </div>
      </div>

      {/* Race Selection */}
      <div className="panel">
        <div className="panel-header">Race</div>
        <div className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {RACES.map(race => {
              const isAvailable = availableRaces.includes(race)
              const isSelected = build.race === race
              return (
                <button
                  key={race}
                  onClick={() => handleRaceChange(race)}
                  disabled={!isAvailable}
                  className={`
                    px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-150
                    ${isSelected
                      ? 'bg-eq-blue/20 border-eq-blue text-eq-blue ring-1 ring-eq-blue/40'
                      : isAvailable
                        ? 'bg-eq-panel2 border-eq-border text-eq-text hover:border-eq-blue/40 hover:bg-eq-surface'
                        : 'bg-eq-panel2/50 border-eq-border/50 text-eq-muted/40 cursor-not-allowed'
                    }
                  `}
                >
                  {race}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="panel">
        <div className="panel-header">Class</div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CLASSES.map(cls => {
              const isAvailable = availableClasses.some(c => c.id === cls.id)
              const isSelected = build.classId === cls.id
              return (
                <button
                  key={cls.id}
                  onClick={() => handleClassChange(cls.id)}
                  disabled={!isAvailable}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                    border transition-all duration-150
                    ${isSelected
                      ? 'border-current ring-1 ring-current/40 bg-current/10'
                      : isAvailable
                        ? 'bg-eq-panel2 border-eq-border hover:border-eq-blue/40 hover:bg-eq-surface'
                        : 'bg-eq-panel2/50 border-eq-border/50 text-eq-muted/40 cursor-not-allowed'
                    }
                  `}
                  style={isSelected || isAvailable ? { color: isSelected ? cls.color : undefined } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isAvailable ? cls.color : '#555' }}
                  />
                  <span style={isSelected ? { color: cls.color } : {}}>{cls.name}</span>
                  <span className="text-xs text-eq-muted ml-auto">{cls.short}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-eq-blue/5 border border-eq-blue/20">
        <Info size={18} className="text-eq-blue shrink-0 mt-0.5" />
        <div className="text-sm text-eq-muted leading-relaxed">
          <p className="font-medium text-eq-text mb-1">About Cross-Class AAs</p>
          <p>
            On Ascendant, you can learn AAs from other classes through the credit system.
            Find Illegible Tomes (Greater, Exalted, or Ascendant tier) from NPC drops,
            turn them in with platinum at Guild Lobby class trainers to earn credits,
            then spend those credits on cross-class abilities. You cannot buy your own class's AAs
            this way — those are earned through normal AA experience.
          </p>
        </div>
      </div>
    </div>
  )
}
