
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { DetectionAPI, RoboflowAPI } from '@/lib/api';
import { AuthAPI } from '@/lib/api';
import { Play, Square, Clock, AlertTriangle, Activity, Eye, Moon, Camera, Cpu, Shield, Volume2 } from 'lucide-react';

// Alert sound
const alertSound = new Audio('/alert.mp3');

type DetectionStatus = 'awake' | 'drowsy' | 'sleeping' | 'inactive';

// Interface for API response
interface DrowsinessDetectionResponse {
  eye_status: string;
  mouth_status: string;
  sleep_status: string;
  ear_value: number;
  mar_value: number;
  head_angle: number;
  drowsy: boolean;
}

const DetectionPage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState<DetectionStatus>('inactive');
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [drowsyEvents, setDrowsyEvents] = useState(0);
  const [sleepEvents, setSleepEvents] = useState(0);
  const [detectionResponse, setDetectionResponse] = useState<DrowsinessDetectionResponse | null>(null);
  
  // Refs for interval handling
  const detectionIntervalRef = useRef<number | null>(null);
  const sessionIntervalRef = useRef<number | null>(null);

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
  
  // Format session time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Capture image from webcam and send to API
  const captureAndDetect = useCallback(async () => {
    if (!webcamRef.current || !isDetecting) return;
    
    try {
      // Capture image from webcam as base64
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        console.error("Failed to capture image from webcam");
        return;
      }
      
      // Remove data URL prefix to get just the base64 data
      const base64Data = imageSrc.split(',')[1];
      
      // Send to Roboflow API
      const response = await RoboflowAPI.detectDrowsiness(base64Data);
      console.log("Drowsiness detection response:", response);
      
      setDetectionResponse(response);
      
      // Determine status based on API response
      let newStatus: DetectionStatus = 'awake';
      
      if (response.drowsy === true) {
        if (response.sleep_status === "Slept" || response.eye_status === "Closed") {
          newStatus = 'sleeping';
        } else {
          newStatus = 'drowsy';
        }
      }
      
      // Update status
      setStatus(newStatus);
      
      // Count drowsy and sleep events
      if (newStatus === 'drowsy' && status !== 'drowsy') {
        setDrowsyEvents(prev => prev + 1);
      } else if (newStatus === 'sleeping' && status !== 'sleeping') {
        setSleepEvents(prev => prev + 1);
      }
      
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
    } catch (error) {
      console.error("Error during drowsiness detection:", error);
      toast({
        title: "Detection Error",
        description: "Failed to process drowsiness detection. Please try again.",
        variant: "destructive",
      });
    }
  }, [isDetecting, status]);
  
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
    setSessionTime(0);
    setDrowsyEvents(0);
    setSleepEvents(0);
    setDetectionResponse(null);
    
    // Start session timer
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }
    
    sessionIntervalRef.current = window.setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    // Start detection at intervals
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    // Run detection every 3 seconds
    detectionIntervalRef.current = window.setInterval(() => {
      captureAndDetect();
    }, 3000);
    
    toast({
      title: "Detection Started",
      description: "Drowsiness detection is now active.",
    });
  }, [webcamReady, captureAndDetect]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('inactive');
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }
    
    toast({
      title: "Detection Stopped",
      description: "Drowsiness detection has been deactivated.",
    });
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, []);
  
  // Handle loading status for webcam
  const renderWebcamStatus = () => {
    if (webcamError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 futuristic-card rounded-xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Webcam Error</p>
            <p className="text-sm text-gray-400">{webcamError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 neon-button"
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
          <div className="text-center futuristic-card p-6 rounded-xl">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-blue-400 mb-2">Initializing webcam...</p>
            <p className="text-xs text-gray-400">Please allow camera access when prompted</p>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  // Get status color for animations
  const getStatusColor = (status: DetectionStatus) => {
    switch (status) {
      case 'awake': return 'text-green-400';
      case 'drowsy': return 'text-amber-400';
      case 'sleeping': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  // Get status description
  const getStatusDescription = (status: DetectionStatus) => {
    switch (status) {
      case 'awake': return 'You are alert and focused. Keep up the good work!';
      case 'drowsy': return 'Warning: You are showing signs of drowsiness! Consider taking a break.';
      case 'sleeping': return 'Alert: You appear to be falling asleep! Stop what you are doing immediately.';
      default: return 'Start detection to monitor drowsiness levels.';
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 futuristic-text animate-fade-in">Drowsiness Detection</h1>
          <p className="text-gray-400 mb-6 animate-fade-in delay-100">Begin monitoring to detect signs of drowsiness in real-time.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Webcam Preview */}
            <div className="lg:col-span-2 animate-fade-in delay-200">
              <Card className="futuristic-card overflow-hidden border-2 border-white/5">
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
                        <div className="flex items-center rounded-full backdrop-blur-lg bg-black/40 border border-red-500/20 px-3 py-1.5 text-sm text-red-400 font-medium">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                          LIVE
                        </div>
                      </div>
                    )}
                    
                    {/* Scanning overlay when detecting */}
                    {isDetecting && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse delay-500"></div>
                        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50 animate-pulse delay-300"></div>
                        <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50 animate-pulse delay-700"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                    {!isDetecting ? (
                      <Button 
                        onClick={startDetection} 
                        disabled={!webcamReady || !!webcamError}
                        className="neon-button w-full sm:w-auto rounded-full px-6 py-3 flex items-center justify-center"
                      >
                        <Play className="mr-2" size={18} />
                        Start Detection
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        onClick={stopDetection}
                        className="w-full sm:w-auto rounded-full px-6 py-3 flex items-center justify-center"
                      >
                        <Square className="mr-2" size={18} />
                        Stop Detection
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Detection Info Cards */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Card className="futuristic-card animate-fade-in delay-300">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Camera className="text-blue-400 mb-2" size={24} />
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Camera Status</h3>
                    <p className={`text-sm ${webcamReady ? 'text-green-400' : 'text-red-400'}`}>
                      {webcamReady ? 'Connected' : 'Disconnected'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="futuristic-card animate-fade-in delay-400">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Cpu className="text-purple-400 mb-2" size={24} />
                    <h3 className="text-sm font-medium text-gray-300 mb-1">AI Status</h3>
                    <p className={`text-sm ${isDetecting ? 'text-green-400' : 'text-gray-400'}`}>
                      {isDetecting ? 'Active' : 'Inactive'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="futuristic-card animate-fade-in delay-500">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Volume2 className="text-cyan-400 mb-2" size={24} />
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Alerts</h3>
                    <p className="text-sm text-cyan-400">Enabled</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Status Panel */}
            <div className="animate-fade-in delay-400">
              <Card className="futuristic-card h-full border-2 border-white/5">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center futuristic-text">
                    <Activity className="mr-2 text-blue-400" size={20} />
                    Status Monitor
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-400">Current Status:</p>
                      
                      <div className="p-6 rounded-lg futuristic-card mb-4 flex items-center justify-center h-24 border border-white/5">
                        {status === 'inactive' ? (
                          <span className="text-gray-500 flex items-center">
                            <Clock className="mr-2" /> Detection inactive
                          </span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <StatusBadge status={status} size="lg" pulsing={status === 'drowsy' || status === 'sleeping'} />
                            
                            {isDetecting && (
                              <div className="mt-2 flex space-x-1">
                                {['awake', 'drowsy', 'sleeping'].map((s) => (
                                  <div 
                                    key={s} 
                                    className={`w-2 h-2 rounded-full ${status === s ? 'animate-pulse' : 'opacity-30'} ${
                                      s === 'awake' ? 'bg-green-500' : s === 'drowsy' ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm italic ${getStatusColor(status)}`}>
                        {getStatusDescription(status)}
                      </p>
                    </div>
                    
                    {/* Detection Details */}
                    {detectionResponse && isDetecting && (
                      <div className="border-t border-white/10 pt-5 mt-5">
                        <p className="text-sm font-medium mb-3 text-gray-400 flex items-center">
                          <Eye className="mr-2 text-blue-400" size={16} />
                          Detection Details:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                            <span className="text-gray-400">Eye Status:</span>
                            <span className={detectionResponse.eye_status === "Open" ? "text-green-300" : "text-red-300"}>
                              {detectionResponse.eye_status}
                            </span>
                          </div>
                          <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                            <span className="text-gray-400">Mouth Status:</span>
                            <span className={detectionResponse.mouth_status === "Not Yawning" ? "text-green-300" : "text-amber-300"}>
                              {detectionResponse.mouth_status}
                            </span>
                          </div>
                          <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                            <span className="text-gray-400">Sleep Status:</span>
                            <span className={detectionResponse.sleep_status === "Not Slept" ? "text-green-300" : "text-red-300"}>
                              {detectionResponse.sleep_status}
                            </span>
                          </div>
                          <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                            <span className="text-gray-400">Head Angle:</span>
                            <span className="text-blue-300">{detectionResponse.head_angle.toFixed(1)}°</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-white/10 pt-5 mt-5">
                      <p className="text-sm font-medium mb-4 text-gray-400 flex items-center">
                        <Clock className="mr-2 text-blue-400" size={16} />
                        Session Statistics:
                      </p>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400">Session Duration:</span>
                          <span className="font-medium text-blue-300">{formatTime(sessionTime)}</span>
                        </div>
                        <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400">Drowsy Events:</span>
                          <span className="font-medium text-amber-300">{drowsyEvents}</span>
                        </div>
                        <div className="flex justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400">Sleep Events:</span>
                          <span className="font-medium text-red-300">{sleepEvents}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-5 mt-5">
                      <p className="text-sm font-medium mb-3 text-gray-400 flex items-center">
                        <Shield className="mr-2 text-blue-400" size={16} />
                        Alert Sensitivity:
                      </p>
                      <Slider
                        defaultValue={[75]}
                        max={100}
                        step={1}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center animate-fade-in delay-600">
            <div className="futuristic-card inline-block p-4 rounded-xl border border-blue-500/20">
              <p className="text-sm text-gray-400">
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
