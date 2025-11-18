import React from 'react'

function NavItem({ icon, label, active = false }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  )
}

export default NavItem