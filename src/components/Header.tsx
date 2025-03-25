
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, Calendar, Pill, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Activity className="w-5 h-5" /> },
    { name: 'Symptômes', path: '/symptoms', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Selles', path: '/stool-log', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Médicaments', path: '/medications', icon: <Pill className="w-5 h-5" /> },
  ];
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  return (
    <header className="relative z-10">
      <div className="glass-card fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-3xl rounded-xl py-3 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-crohn-500 text-white rounded-lg p-1.5">
              <Activity className="w-5 h-5" />
            </span>
            <span className="font-display font-medium text-lg">Crohn Companion</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                  location.pathname === item.path 
                    ? "bg-crohn-100 text-crohn-700 dark:bg-crohn-900/30 dark:text-crohn-300" 
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/30"
                )}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/30"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Mobile navigation */}
        {menuOpen && (
          <nav className="md:hidden absolute top-full left-0 right-0 mt-1 glass-card rounded-lg p-2 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className={cn(
                    "px-3 py-2 rounded-lg font-medium text-sm flex items-center space-x-3 transition-all duration-300",
                    location.pathname === item.path 
                      ? "bg-crohn-100 text-crohn-700 dark:bg-crohn-900/30 dark:text-crohn-300" 
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/30"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
      
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>
    </header>
  );
};

export default Header;
