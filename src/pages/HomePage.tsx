
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Activity, Bell, Shield, Brain, Fingerprint } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-130px)] flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-float mb-6">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-2 futuristic-text">
                DrowsyGuard
              </h1>
              <p className="text-xl text-blue-400 animate-fade-in">
                Advanced real-time drowsiness detection system
              </p>
            </div>
            
            <p className="text-xl text-gray-400 mb-8 animate-fade-in delay-200 max-w-2xl mx-auto">
              Using AI to prevent accidents and save lives with precision monitoring and real-time alerts
            </p>
            
            <div className="flex justify-center mb-16 animate-fade-in delay-300">
              <Link to="/detect">
                <Button className="neon-button text-lg px-8 py-6 rounded-full shadow-lg">
                  Start Detection
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="futuristic-card card-hover animate-fade-in delay-100">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20">
                      <Eye size={32} className="animate-pulse" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-blue-300">Real-time Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    Advanced AI algorithms monitor your alertness level continuously in real-time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="futuristic-card card-hover animate-fade-in delay-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                      <Bell size={32} />
                    </div>
                  </div>
                  <CardTitle className="text-center text-amber-300">Instant Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    Receive immediate audio and visual alerts when drowsiness is detected.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="futuristic-card card-hover animate-fade-in delay-500">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 border border-green-500/30 shadow-lg shadow-green-500/20">
                      <Activity size={32} />
                    </div>
                  </div>
                  <CardTitle className="text-center text-green-300">Detailed Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    Track your alertness patterns over time with comprehensive logs and reports.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="max-w-3xl mx-auto futuristic-card p-8 rounded-2xl animate-fade-in delay-700">
              <h2 className="text-2xl font-bold mb-4 futuristic-text">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400 mb-3">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-blue-300 font-medium mb-1">Detection</h3>
                  <p className="text-sm text-gray-400">Monitors your facial expressions and eye movements</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-indigo-900/40 flex items-center justify-center text-indigo-400 mb-3">
                    <Brain size={24} />
                  </div>
                  <h3 className="text-indigo-300 font-medium mb-1">Analysis</h3>
                  <p className="text-sm text-gray-400">AI processes data to identify signs of drowsiness</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-cyan-900/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-cyan-300 font-medium mb-1">Protection</h3>
                  <p className="text-sm text-gray-400">Instant alerts help prevent accidents</p>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                DrowsyGuard uses your webcam to monitor eye movements and facial expressions,
                analyzing them in real-time to detect signs of drowsiness. When fatigue is detected,
                the system immediately alerts you, helping prevent accidents caused by drowsy driving or operation of machinery.
              </p>
              
              <div className="text-gray-400 mb-8 px-4 py-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                <div className="flex items-center">
                  <Fingerprint className="mr-2 text-blue-400" size={20} />
                  <p className="text-sm">All processing happens locally on your device, ensuring your privacy and data security.</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link to="/detect">
                  <Button variant="outline" size="lg" className="neon-button rounded-full hover:text-white">
                    Try It Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
