
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthAPI } from '@/lib/api';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = AuthAPI.isAuthenticated();
  
  const handleLogout = () => {
    AuthAPI.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            DrowsyGuard
          </Link>
          
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Link 
              to="/" 
              className={`px-2 py-1 rounded-md ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
            >
              Home
            </Link>
            
            <Link 
              to="/detect" 
              className={`px-2 py-1 rounded-md ${location.pathname === '/detect' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
            >
              Detect
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/logs" 
                  className={`px-2 py-1 rounded-md ${location.pathname === '/logs' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                >
                  Logs
                </Link>
                
                <Link 
                  to="/settings" 
                  className={`px-2 py-1 rounded-md ${location.pathname === '/settings' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                >
                  Settings
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className={`px-2 py-1 rounded-md ${location.pathname === '/login' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                >
                  Login
                </Link>
                
                <Link 
                  to="/register" 
                  className={`px-2 py-1 rounded-md ${location.pathname === '/register' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} DrowsyGuard. All rights reserved.</p>
          <p className="mt-1">Built with React, TailwindCSS & ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
