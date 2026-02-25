import React, { useState } from 'react'
import { Shield, Swords, BookOpen, Scroll, Save, User, BarChart3 } from 'lucide-react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CharacterSetup from './pages/CharacterSetup'
import AAPlanner from './pages/AAPlanner'
import EquipmentPlanner from './pages/EquipmentPlanner'
import SpellBrowser from './pages/SpellBrowser'
import BuildSummary from './pages/BuildSummary'
import BuildManager from './pages/BuildManager'
import { useBuildState } from './hooks/useBuildState'
import { useAATree } from './hooks/useApi'

const TABS = [
  { id: 'character', label: 'Character', icon: User },
  { id: 'aas', label: 'AA Planner', icon: Scroll },
  { id: 'equipment', label: 'Equipment', icon: Shield },
  { id: 'spells', label: 'Spells', icon: BookOpen },
  { id: 'summary', label: 'Summary', icon: BarChart3 },
  { id: 'builds', label: 'Builds', icon: Save },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('character')
  const buildState = useBuildState()
  const { abilities: allAAs, loading: aasLoading } = useAATree()

  const renderPage = () => {
    switch (activeTab) {
      case 'character':
        return <CharacterSetup buildState={buildState} />
      case 'aas':
        return <AAPlanner buildState={buildState} allAAs={allAAs} loading={aasLoading} />
      case 'equipment':
        return <EquipmentPlanner buildState={buildState} />
      case 'spells':
        return <SpellBrowser buildState={buildState} />
      case 'summary':
        return <BuildSummary buildState={buildState} allAAs={allAAs} />
      case 'builds':
        return <BuildManager buildState={buildState} allAAs={allAAs} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header build={buildState.build} totalCredits={buildState.totalCredits} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-4">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
