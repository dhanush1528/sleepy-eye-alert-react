
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { AuthAPI } from '@/lib/api';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      // For the demo, we'll simulate a successful login
      // In a real app, this would call the API
      setTimeout(() => {
        localStorage.setItem('auth_token', 'demo_token');
        localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Demo User', email: values.email }));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to DrowsyGuard!",
        });
        
        navigate('/detect');
      }, 1000);
      
      // Real implementation would be:
      /*
      await AuthAPI.login(values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back to DrowsyGuard!",
      });
      navigate('/detect');
      */
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">DrowsyGuard</h1>
          <p className="mt-2 text-gray-600">
            Sign in to monitor and track your alertness
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
