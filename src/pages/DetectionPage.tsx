
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { DetectionAPI } from '@/lib/api';
import { AuthAPI } from '@/lib/api';
import { Play, Square, Clock, AlertTriangle, Activity } from 'lucide-react';

// Alert sound
const alertSound = new Audio('/alert.mp3');

type DetectionStatus = 'awake' | 'drowsy' | 'sleeping' | 'inactive';

const DetectionPage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState<DetectionStatus>('inactive');
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  
  // For simulating detection in this frontend-only version
  const simulationIntervalRef = useRef<number | null>(null);

  const webcamWidth = 640;
  const webcamHeight = 480;
  
  // Handle webcam initialization
  const handleWebcamInit = useCallback(() => {
    setWebcamReady(true);
  }, []);
  
  // Handle webcam errors
  const handleWebcamError = useCallback((error: string | null) => {
    setWebcamError(error || 'Failed to access webcam');
    setWebcamReady(false);
    toast({
      title: "Webcam Error",
      description: error || "Could not access webcam. Please check permissions.",
      variant: "destructive",
    });
  }, []);
  
  // Simulate detection status changes
  // In a real app, this would be replaced with actual ML detection
  const simulateDetection = useCallback(() => {
    const statuses: DetectionStatus[] = ['awake', 'drowsy', 'sleeping'];
    const weights = [0.7, 0.2, 0.1]; // Probability weights
    
    const randomIndex = (() => {
      const r = Math.random();
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (r < sum) return i;
      }
      return 0;
    })();
    
    const newStatus = statuses[randomIndex];
    setStatus(newStatus);
    
    // Play alert sound for drowsy or sleeping
    if (newStatus === 'drowsy' || newStatus === 'sleeping') {
      if (newStatus === 'sleeping') {
        alertSound.play().catch(e => console.error("Error playing alert:", e));
        
        toast({
          title: "Alert!",
          description: "You appear to be sleeping! Please take a break.",
          variant: "destructive",
        });
      }
    }
    
    // Save detection to backend if authenticated
    if (AuthAPI.isAuthenticated()) {
      DetectionAPI.saveDetection(newStatus, new Date())
        .catch(error => {
          console.error('Error saving detection:', error);
        });
    }
  }, []);
  
  // Start detection
  const startDetection = useCallback(() => {
    if (!webcamReady) {
      toast({
        title: "Webcam not ready",
        description: "Please ensure your webcam is connected and permissions are granted.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDetecting(true);
    setStatus('awake');
    
    // For demo purposes, we'll simulate detection
    // In a real app, you would process webcam frames with ML here
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    
    simulationIntervalRef.current = window.setInterval(() => {
      simulateDetection();
    }, 3000);
    
    toast({
      title: "Detection Started",
      description: "Drowsiness detection is now active.",
    });
  }, [webcamReady, simulateDetection]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('inactive');
    
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    
    toast({
      title: "Detection Stopped",
      description: "Drowsiness detection has been deactivated.",
    });
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);
  
  // Handle loading status for webcam
  const renderWebcamStatus = () => {
    if (webcamError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 glass-card rounded-xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-500 font-medium mb-2">Webcam Error</p>
            <p className="text-sm text-gray-600">{webcamError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 button-hover-effect"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
    
    if (!webcamReady) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm rounded-lg">
          <div className="text-center glass-card p-6 rounded-xl">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 mb-2">Initializing webcam...</p>
            <p className="text-xs text-gray-500">Please allow camera access when prompted</p>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 gradient-text animate-fade-in">Drowsiness Detection</h1>
          <p className="text-gray-600 mb-6 animate-fade-in delay-100">Begin monitoring to detect signs of drowsiness in real-time.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Webcam Preview */}
            <div className="lg:col-span-2 animate-fade-in delay-200">
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-4">
                  <div className="webcam-container relative">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      width={webcamWidth}
                      height={webcamHeight}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ width: webcamWidth, height: webcamHeight }}
                      onUserMedia={handleWebcamInit}
                      onUserMediaError={() => handleWebcamError("Could not access webcam")}
                      className="w-full h-auto rounded-lg"
                    />
                    
                    {renderWebcamStatus()}
                    
                    {isDetecting && status !== 'inactive' && (
                      <div className="absolute bottom-4 left-4">
                        <StatusBadge 
                          status={status} 
                          size="lg" 
                          pulsing={status === 'drowsy' || status === 'sleeping'} 
                        />
                      </div>
                    )}

                    {isDetecting && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center rounded-full bg-red-500/20 backdrop-blur-sm px-3 py-1.5 text-sm text-red-600 font-medium">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                          Monitoring
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    {!isDetecting ? (
                      <Button 
                        onClick={startDetection} 
                        disabled={!webcamReady || !!webcamError}
                        className="rounded-full button-hover-effect shadow-lg shadow-blue-500/20 px-6"
                      >
                        <Play className="mr-2" size={18} />
                        Start Detection
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        onClick={stopDetection}
                        className="rounded-full button-hover-effect shadow-lg shadow-red-500/20 px-6"
                      >
                        <Square className="mr-2" size={18} />
                        Stop Detection
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Status Panel */}
            <div className="animate-fade-in delay-400">
              <Card className="glass-card h-full">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gradient-text">
                    <Activity className="mr-2" size={20} />
                    Status Monitor
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-700">Current Status:</p>
                      
                      <div className="p-6 rounded-lg glass-card mb-4 flex items-center justify-center h-24">
                        {status === 'inactive' ? (
                          <span className="text-gray-500 flex items-center">
                            <Clock className="mr-2" /> Detection inactive
                          </span>
                        ) : (
                          <StatusBadge status={status} size="lg" pulsing={status === 'drowsy' || status === 'sleeping'} />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 italic">
                        {status === 'awake' && 'You are alert and focused. Keep up the good work!'}
                        {status === 'drowsy' && 'Warning: You are showing signs of drowsiness! Consider taking a break.'}
                        {status === 'sleeping' && 'Alert: You appear to be falling asleep! Stop what you are doing immediately.'}
                        {status === 'inactive' && 'Start detection to monitor drowsiness levels.'}
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-200/50 pt-5 mt-5">
                      <p className="text-sm font-medium mb-4 text-gray-700 flex items-center">
                        <Clock className="mr-2" size={16} />
                        Session Statistics:
                      </p>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between bg-gray-50/80 p-2 rounded-lg">
                          <span className="text-gray-600">Session Duration:</span>
                          <span className="font-medium">00:00:00</span>
                        </div>
                        <div className="flex justify-between bg-gray-50/80 p-2 rounded-lg">
                          <span className="text-gray-600">Drowsy Events:</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="flex justify-between bg-gray-50/80 p-2 rounded-lg">
                          <span className="text-gray-600">Sleep Events:</span>
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center animate-fade-in delay-600">
            <div className="glass-card inline-block p-4 rounded-xl">
              <p className="text-sm text-gray-600">
                For optimal detection, make sure you are in a well-lit environment and your face is clearly visible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetectionPage;
