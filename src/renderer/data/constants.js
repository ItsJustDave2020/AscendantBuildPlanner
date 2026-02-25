export const API_BASE = 'https://ascendanteq.com'

export const CLASSES = [
  { id: 1, name: 'Warrior', short: 'WAR', color: '#c69b6d' },
  { id: 2, name: 'Cleric', short: 'CLR', color: '#f5f5f5' },
  { id: 3, name: 'Paladin', short: 'PAL', color: '#f48cba' },
  { id: 4, name: 'Ranger', short: 'RNG', color: '#66bb6a' },
  { id: 5, name: 'Shadowknight', short: 'SHD', color: '#c41e3a' },
  { id: 6, name: 'Druid', short: 'DRU', color: '#ff7c0a' },
  { id: 7, name: 'Monk', short: 'MNK', color: '#00ff98' },
  { id: 8, name: 'Bard', short: 'BRD', color: '#69ccf0' },
  { id: 9, name: 'Rogue', short: 'ROG', color: '#fff468' },
  { id: 10, name: 'Shaman', short: 'SHM', color: '#0070dd' },
  { id: 11, name: 'Necromancer', short: 'NEC', color: '#9482c9' },
  { id: 12, name: 'Wizard', short: 'WIZ', color: '#40c7eb' },
  { id: 13, name: 'Magician', short: 'MAG', color: '#e6cc80' },
  { id: 14, name: 'Enchanter', short: 'ENC', color: '#b4a7d6' },
  { id: 15, name: 'Beastlord', short: 'BST', color: '#a87c50' },
  { id: 16, name: 'Berserker', short: 'BER', color: '#e06666' },
]

export const RACES = [
  'Barbarian', 'Dark Elf', 'Dwarf', 'Erudite', 'Gnome',
  'Half Elf', 'Halfling', 'High Elf', 'Human', 'Iksar',
  'Ogre', 'Troll', 'Vah Shir', 'Wood Elf', 'Froglok',
]

// Which races can be which classes (classic EQ + Kunark/Luclin)
export const RACE_CLASS_MATRIX = {
  'Barbarian':  [1, 4, 7, 10, 16],
  'Dark Elf':   [1, 2, 5, 7, 8, 9, 11, 12, 13, 14],
  'Dwarf':      [1, 2, 3, 4, 9, 16],
  'Erudite':    [2, 3, 5, 6, 11, 12, 13, 14],
  'Gnome':      [1, 2, 5, 7, 9, 11, 12, 13, 14],
  'Half Elf':   [1, 3, 4, 6, 8, 9],
  'Halfling':   [1, 2, 4, 6, 7, 9],
  'High Elf':   [1, 2, 3, 12, 13, 14],
  'Human':      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  'Iksar':      [1, 5, 7, 10, 11, 15],
  'Ogre':       [1, 5, 10, 16],
  'Troll':      [1, 5, 10, 16],
  'Vah Shir':   [1, 7, 8, 15, 16],
  'Wood Elf':   [1, 4, 6, 7, 8, 9],
  'Froglok':    [1, 2, 3, 5, 7, 9, 10, 12],
}

export const EQUIPMENT_SLOTS = [
  { id: 'charm', name: 'Charm', bit: 0 },
  { id: 'ear1', name: 'Left Ear', bit: 1 },
  { id: 'head', name: 'Head', bit: 2 },
  { id: 'face', name: 'Face', bit: 3 },
  { id: 'ear2', name: 'Right Ear', bit: 4 },
  { id: 'neck', name: 'Neck', bit: 5 },
  { id: 'shoulder', name: 'Shoulders', bit: 6 },
  { id: 'arms', name: 'Arms', bit: 7 },
  { id: 'back', name: 'Back', bit: 8 },
  { id: 'wrist1', name: 'Left Wrist', bit: 9 },
  { id: 'wrist2', name: 'Right Wrist', bit: 10 },
  { id: 'ranged', name: 'Range', bit: 11 },
  { id: 'hands', name: 'Hands', bit: 12 },
  { id: 'primary', name: 'Primary', bit: 13 },
  { id: 'secondary', name: 'Secondary', bit: 14 },
  { id: 'ring1', name: 'Left Ring', bit: 15 },
  { id: 'ring2', name: 'Right Ring', bit: 16 },
  { id: 'chest', name: 'Chest', bit: 17 },
  { id: 'legs', name: 'Legs', bit: 18 },
  { id: 'feet', name: 'Feet', bit: 19 },
  { id: 'waist', name: 'Waist', bit: 20 },
  { id: 'ammo', name: 'Ammo', bit: 21 },
]

export const STATS = [
  'astr', 'asta', 'aagi', 'adex', 'aint', 'awis', 'acha',
  'ac', 'hp', 'mana', 'endur',
  'fr', 'cr', 'mr', 'pr', 'dr',
  'heroic_str', 'heroic_sta', 'heroic_agi', 'heroic_dex',
  'heroic_int', 'heroic_wis', 'heroic_cha',
  'haste', 'attack', 'damage', 'regen', 'manaregen',
]

export const STAT_LABELS = {
  astr: 'STR', asta: 'STA', aagi: 'AGI', adex: 'DEX',
  aint: 'INT', awis: 'WIS', acha: 'CHA',
  ac: 'AC', hp: 'HP', mana: 'Mana', endur: 'Endurance',
  fr: 'Fire Resist', cr: 'Cold Resist', mr: 'Magic Resist',
  pr: 'Poison Resist', dr: 'Disease Resist',
  heroic_str: 'H-STR', heroic_sta: 'H-STA', heroic_agi: 'H-AGI',
  heroic_dex: 'H-DEX', heroic_int: 'H-INT', heroic_wis: 'H-WIS',
  heroic_cha: 'H-CHA',
  haste: 'Haste', attack: 'Attack', damage: 'Damage',
  regen: 'HP Regen', manaregen: 'Mana Regen',
}

export const TIER_COLORS = {
  1: { name: 'Greater', css: 'tier-greater', hex: '#4ade80', bg: 'bg-eq-greater/10', border: 'border-eq-greater/30', text: 'text-eq-greater' },
  2: { name: 'Exalted', css: 'tier-exalted', hex: '#4a9eff', bg: 'bg-eq-blue/10', border: 'border-eq-blue/30', text: 'text-eq-blue' },
  3: { name: 'Ascendant', css: 'tier-ascendant', hex: '#d4a843', bg: 'bg-eq-gold/10', border: 'border-eq-gold/30', text: 'text-eq-gold' },
}
