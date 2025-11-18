import React from 'react'
import { Menu, X, Home, Activity, Users, Phone, ChevronRight, Info } from 'lucide-react';
import NavItem from './NavItem';

function NavBar() {
    return (
    <aside
      className="
        fixed top-0 left-0
        h-screen
        w-64
        bg-slate-800 text-white
        flex flex-col
        z-50
      "
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-wide">Healthcare Portal</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4 space-y-2 flex-1">
        <NavItem icon={<Info size={20} />} label="Home" active />
        <NavItem icon={<Users size={20} />} label="Services" />
        <NavItem icon={<Phone size={20} />} label="Contact" />
      </nav>
    </aside>
  );
}

export default NavBar