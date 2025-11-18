import React from 'react'
import { Menu, X, Home, Activity, Users, Phone, ChevronRight, Info } from 'lucide-react';

function Card({ data }) {
  return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center">
      
      {/* Icon/Image Placeholder based on category */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
        data.category === 'Infectious Disease' ? 'bg-red-100 text-red-600' :
        data.category === 'Prevention' ? 'bg-blue-100 text-blue-600' :
        'bg-purple-100 text-purple-600'
      }`}>
        <Activity size={32} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
           <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{data.category}</span>
           <span className="text-gray-300">•</span>
           <span className="text-xs text-gray-400">{data.date}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{data.title}</h3>
        <p className="text-gray-600 leading-relaxed">{data.description}</p>
      </div>

      <button className="w-full md:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group">
        Read More
        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}

export default Card