
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-primary">
            DrowsyGuard
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Advanced real-time drowsiness detection system to prevent accidents and save lives.
          </p>
          
          <div className="flex justify-center mb-12">
            <Link to="/detect">
              <Button size="lg" className="text-lg px-8">
                Start Detection
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced AI algorithms monitor your alertness level continuously in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive immediate audio and visual alerts when drowsiness is detected.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your alertness patterns over time with comprehensive logs and reports.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            
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
                <Button variant="outline" size="lg">
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
