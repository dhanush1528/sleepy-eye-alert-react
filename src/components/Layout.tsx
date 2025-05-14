
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthAPI } from '@/lib/api';
import { Button } from './ui/button';
import { Eye, Home, Settings, FileText, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = AuthAPI.isAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    AuthAPI.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/detect', label: 'Detect', icon: <Eye size={18} /> },
    ...(isAuthenticated ? [
      { path: '/logs', label: 'Logs', icon: <FileText size={18} /> },
      { path: '/settings', label: 'Settings', icon: <Settings size={18} /> }
    ] : [])
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 mr-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Eye size={20} className="animate-pulse" />
            </div>
            <span className="text-2xl font-bold futuristic-text tracking-wider">DrowsyGuard</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
                  location.pathname === item.path 
                    ? 'bg-primary/20 text-primary animate-glow' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-white/5 flex items-center"
              >
                <LogOut size={18} className="mr-1.5" />
                Logout
              </Button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
                    location.pathname === '/login' 
                      ? 'bg-primary/20 text-primary animate-glow' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <User size={18} className="mr-1.5" />
                  Login
                </Link>
                
                <Link 
                  to="/register" 
                  className="px-4 py-2 ml-2 rounded-md bg-primary/80 hover:bg-primary text-white transition-all duration-300 shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
        
        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 animate-fade-in">
            <div className="container mx-auto px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`block px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
                    location.pathname === item.path 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 flex items-center"
                >
                  <LogOut size={18} className="mr-1.5" />
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} className="mr-1.5" />
                    Login
                  </Link>
                  
                  <Link 
                    to="/register"
                    className="block px-3 py-2 rounded-md bg-primary/80 hover:bg-primary text-white flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-4 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} DrowsyGuard. All rights reserved.</p>
          <p className="mt-1">Built with React, TailwindCSS & AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
