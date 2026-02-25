import React from 'react'

export default function Sidebar({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="w-48 bg-eq-panel border-r border-eq-border flex flex-col shrink-0">
      <div className="flex-1 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-eq-blue/15 text-eq-blue border-r-2 border-eq-blue'
                  : 'text-eq-muted hover:text-eq-text hover:bg-eq-panel2'
                }
              `}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
      <div className="p-3 border-t border-eq-border">
        <p className="text-[10px] text-eq-muted/60 text-center leading-tight">
          Data from ascendanteq.com
        </p>
      </div>
    </nav>
  )
}
