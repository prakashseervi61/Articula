import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Activity, Cpu, Layers, BarChart3, Ruler, FileText, Info, ScanLine } from 'lucide-react';
import Abbr from './Abbr';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Activity, path: '/' },
    { id: 'how-it-works', label: 'How It Works', icon: Cpu, path: '/how-it-works' },
    { id: 'workspace', label: 'Workspace', icon: Layers, path: '/workspace' },
    { id: 'mri-explorer', label: 'MRI Explorer', icon: ScanLine, path: '/mri-explorer' },
    { id: 'implant-matching', label: 'Implant Sizing', icon: Ruler, path: '/implant-matching' },
    { id: 'report', label: 'Clinical Report', icon: FileText, path: '/report' },
    { id: 'about', label: 'About & CDS', icon: Info, path: '/about' }
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800/80 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-slate-900/95">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center gap-4 py-2">
          
          {/* Sleek, Clean Brand Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center text-left focus:outline-none group"
          >
            <span className="font-bold text-lg tracking-wider text-white">ARTICULA</span>
          </Link>

          {/* Declarative NavLink Links */}
          <nav className="nav-scrollbar-hidden hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                    className={`flex shrink-0 items-center space-x-1.5 whitespace-nowrap rounded-md px-2.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>



        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="nav-scrollbar-hidden flex gap-1.5 overflow-x-auto border-t border-slate-800 bg-slate-900/95 px-4 py-2.5 lg:hidden sm:px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
                className={`flex shrink-0 items-center space-x-1.5 whitespace-nowrap rounded px-3 py-1.5 text-xs transition-colors ${
                isActive ? 'bg-sky-600 text-white font-medium' : 'text-slate-300 bg-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
}
