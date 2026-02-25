import React, { useState, useEffect } from 'react'
import { Search, Loader2, BookOpen, Clock, Zap, Target } from 'lucide-react'
import { CLASSES } from '../data/constants'
import { useSpellSearch } from '../hooks/useApi'

const SKILL_NAMES = {
  0: '1H Blunt', 1: '1H Slash', 2: '2H Blunt', 3: '2H Slash',
  4: 'Abjuration', 5: 'Alteration', 6: 'Apply Poison', 7: 'Archery',
  8: 'Backstab', 9: 'Bind Wound', 10: 'Bash', 11: 'Block',
  12: 'Brass', 13: 'Channeling', 14: 'Conjuration', 15: 'Defense',
  16: 'Disarm', 17: 'Disarm Traps', 18: 'Divination', 19: 'Dodge',
  20: 'Double Attack', 21: 'Dragon Punch', 22: 'Dual Wield', 23: 'Eagle Strike',
  24: 'Evocation', 25: 'Feign Death', 26: 'Flying Kick', 27: 'Forage',
  28: 'Hand to Hand', 29: 'Hide', 30: 'Kick', 31: 'Meditate',
  32: 'Mend', 33: 'Offense', 34: 'Parry', 35: 'Pick Lock',
  36: 'Piercing', 37: 'Riposte', 38: 'Round Kick', 39: 'Safe Fall',
  40: 'Sense Heading', 41: 'Singing', 42: 'Sneak', 43: 'Specialize Abjure',
  44: 'Specialize Alter', 45: 'Specialize Conjur', 46: 'Specialize Divination', 47: 'Specialize Evoc',
  48: 'Pick Pockets', 49: 'Stringed', 50: 'Swimming', 51: 'Throwing',
  52: 'Tiger Claw', 53: 'Tracking', 54: 'Wind', 55: 'Fishing',
  56: 'Make Poison', 57: 'Tinkering', 58: 'Research', 59: 'Alchemy',
  60: 'Baking', 61: 'Tailoring', 62: 'Sense Traps', 63: 'Blacksmithing',
  64: 'Fletching', 65: 'Brewing', 66: 'Alcohol Tolerance', 67: 'Begging',
  68: 'Jewelry Making', 69: 'Pottery', 70: 'Percussion',
  71: 'Intimidation', 72: 'Berserking', 73: 'Taunt', 74: 'Frenzy',
}

const TARGET_TYPES = {
  1: 'Line of Sight', 2: 'AE Caster', 3: 'Group v1', 4: 'AE Caster',
  5: 'Single', 6: 'Self', 8: 'Targeted AE', 9: 'Animal',
  10: 'Undead', 11: 'Summoned', 13: 'Lifetap', 14: 'Pet',
  15: 'Corpse', 16: 'Plant', 17: 'Giant', 18: 'Dragon',
  20: 'Targeted AE Tap', 24: 'AE Undead', 25: 'AE Summoned',
  36: 'AE Caster v2', 40: 'Group v2', 41: 'Group Teleport',
  43: 'Beam', 44: 'Free Target', 46: 'Target of Target',
}

export default function SpellBrowser({ buildState }) {
  const { build } = buildState
  const { results, loading, error, search } = useSpellSearch()

  const [searchName, setSearchName] = useState('')
  const [classId, setClassId] = useState(build.classId?.toString() || '')
  const [minLevel, setMinLevel] = useState('1')
  const [maxLevel, setMaxLevel] = useState('60')
  const [selectedSpell, setSelectedSpell] = useState(null)

  // Auto-set class when build class changes
  useEffect(() => {
    if (build.classId) setClassId(build.classId.toString())
  }, [build.classId])

  const handleSearch = (e) => {
    e.preventDefault()
    search({ name: searchName, classId, minLevel, maxLevel })
  }

  const getClassLevels = (spell) => {
    const levels = []
    for (let i = 1; i <= 16; i++) {
      const level = spell[`classes${i}`]
      if (level && level < 255) {
        const cls = CLASSES.find(c => c.id === i)
        if (cls) levels.push({ cls, level })
      }
    }
    return levels
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-bold text-eq-gold">Spell Browser</h2>
        <p className="text-sm text-eq-muted">Search spells by name, class, and level.</p>
      </div>

      {/* Search Form */}
      <div className="panel mb-4">
        <form onSubmit={handleSearch} className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1">
                Spell Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="input-field"
                placeholder="Search..."
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1">
                Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="select-field"
              >
                <option value="">All</option>
                {CLASSES.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1">
                Min Level
              </label>
              <input
                type="number"
                value={minLevel}
                onChange={(e) => setMinLevel(e.target.value)}
                min="1" max="75"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-eq-muted font-semibold mb-1">
                Max Level
              </label>
              <input
                type="number"
                value={maxLevel}
                onChange={(e) => setMaxLevel(e.target.value)}
                min="1" max="75"
                className="input-field"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary text-xs">
              {loading ? <Loader2 size={14} className="animate-spin inline mr-1" /> : <Search size={14} className="inline mr-1" />}
              Search Spells
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-eq-blue" size={32} />
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="text-xs text-eq-muted mb-2">
              Found <span className="font-bold text-eq-blue">{results.length}</span> spells
              {results.length === 100 && <span className="text-eq-gold"> (limited to 100)</span>}
            </div>

            <div className="space-y-1">
              {results.map(spell => {
                const classLevels = getClassLevels(spell)
                const isExpanded = selectedSpell === spell.id

                return (
                  <div key={spell.id} className="panel">
                    <div
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-eq-panel2/50"
                      onClick={() => setSelectedSpell(isExpanded ? null : spell.id)}
                    >
                      <img
                        src={`https://ascendanteq.com/icons/${spell.icon}.gif`}
                        alt=""
                        className="w-6 h-6"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <span className="font-medium text-sm text-eq-blue flex-1">{spell.name}</span>
                      <div className="flex gap-1 shrink-0">
                        {classLevels.slice(0, 4).map(({ cls, level }) => (
                          <span
                            key={cls.id}
                            className="text-[10px] font-bold"
                            style={{ color: cls.color }}
                          >
                            {cls.short}/{level}
                          </span>
                        ))}
                        {classLevels.length > 4 && (
                          <span className="text-[10px] text-eq-muted">+{classLevels.length - 4}</span>
                        )}
                      </div>
                      {spell.mana > 0 && (
                        <span className="text-xs text-eq-blue font-medium w-14 text-right">
                          {spell.mana} mana
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="px-4 py-3 border-t border-eq-border bg-eq-panel2/30 text-xs space-y-2">
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="text-eq-muted" />
                            <span className="text-eq-muted">Cast:</span>
                            <span>{(spell.cast_time / 1000).toFixed(1)}s</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="text-eq-muted" />
                            <span className="text-eq-muted">Recast:</span>
                            <span>{(spell.recast_time / 1000).toFixed(1)}s</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target size={11} className="text-eq-muted" />
                            <span className="text-eq-muted">Target:</span>
                            <span>{TARGET_TYPES[spell.targettype] || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap size={11} className="text-eq-muted" />
                            <span className="text-eq-muted">Skill:</span>
                            <span>{SKILL_NAMES[spell.skill] || 'Unknown'}</span>
                          </div>
                          {spell.range > 0 && (
                            <div className="flex items-center gap-1">
                              <Target size={11} className="text-eq-muted" />
                              <span className="text-eq-muted">Range:</span>
                              <span>{spell.range}</span>
                            </div>
                          )}
                          {spell.mana > 0 && (
                            <div className="flex items-center gap-1">
                              <Zap size={11} className="text-eq-muted" />
                              <span className="text-eq-muted">Mana:</span>
                              <span className="text-eq-blue font-medium">{spell.mana}</span>
                            </div>
                          )}
                        </div>

                        {/* Class levels */}
                        <div className="pt-1 border-t border-eq-border/50">
                          <span className="text-eq-muted">Classes: </span>
                          {classLevels.map(({ cls, level }, i) => (
                            <span key={cls.id}>
                              {i > 0 && <span className="text-eq-border mx-1">/</span>}
                              <span style={{ color: cls.color }} className="font-medium">
                                {cls.name} ({level})
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
