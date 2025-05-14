
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { toast } = useToast();
  const isAuthenticated = AuthAPI.isAuthenticated();

  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please login to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
