
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Activity, Bell } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-float mb-6">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-2">
              <span className="gradient-text">DrowsyGuard</span>
            </h1>
            <p className="text-xl text-gray-600 animate-fade-in">
              Advanced real-time drowsiness detection system
            </p>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 animate-fade-in delay-200">
            Using AI to prevent accidents and save lives with precision monitoring
          </p>
          
          <div className="flex justify-center mb-16 animate-fade-in delay-300">
            <Link to="/detect">
              <Button size="lg" className="text-lg px-8 py-6 button-hover-effect rounded-full shadow-lg shadow-blue-500/30">
                Start Detection
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card card-hover animate-fade-in delay-100">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Eye size={32} />
                  </div>
                </div>
                <CardTitle className="text-center">Real-time Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Advanced AI algorithms monitor your alertness level continuously in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card card-hover animate-fade-in delay-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Bell size={32} />
                  </div>
                </div>
                <CardTitle className="text-center">Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Receive immediate audio and visual alerts when drowsiness is detected.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card card-hover animate-fade-in delay-500">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Activity size={32} />
                  </div>
                </div>
                <CardTitle className="text-center">Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Track your alertness patterns over time with comprehensive logs and reports.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto glass-card p-8 rounded-2xl animate-fade-in delay-700">
            <h2 className="text-2xl font-bold mb-4 gradient-text">How It Works</h2>
            
            <p className="text-gray-600 mb-6">
              DrowsyGuard uses your webcam to monitor eye movements and facial expressions,
              analyzing them in real-time to detect signs of drowsiness. When fatigue is detected,
              the system immediately alerts you, helping prevent accidents caused by drowsy driving or operation of machinery.
            </p>
            
            <p className="text-gray-600 mb-8">
              All processing happens locally on your device, ensuring your privacy and data security.
              Start using DrowsyGuard today and stay safe wherever you go.
            </p>
            
            <div className="flex justify-center">
              <Link to="/detect">
                <Button variant="outline" size="lg" className="button-hover-effect rounded-full">
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
