
// A JavaScript implementation of the drowsiness detection algorithm
// based on the Python MediaPipe implementation

// Constants for detection thresholds
const EYE_AR_THRESH = 0.22;
const MOUTH_AR_THRESH = 0.6;
const ALERT_THRESHOLD = 15; // frames

// Eye and mouth landmark indices (simplified for JavaScript implementation)
// These correspond to the important points for EAR and MAR calculations
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [263, 387, 385, 362, 380, 373];
const MOUTH = [13, 14, 78, 308];

// Calculate distance between two points
const distance = (point1: number[], point2: number[]): number => {
  return Math.sqrt(
    Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2)
  );
};

// Calculate Eye Aspect Ratio (EAR)
const eyeAspectRatio = (landmarks: number[][], eyeIndices: number[]): number => {
  const top =
    distance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]]) +
    distance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]]);
  const bottom = 2 * distance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]]);
  return top / bottom || 0;
};

// Calculate Mouth Aspect Ratio (MAR)
const mouthAspectRatio = (landmarks: number[][]): number => {
  const vertical = distance(landmarks[MOUTH[0]], landmarks[MOUTH[1]]);
  const horizontal = distance(landmarks[MOUTH[2]], landmarks[MOUTH[3]]);
  return vertical / horizontal || 0;
};

// Process detection results from face landmarks
export const processFaceLandmarks = (
  faceLandmarks: any,
  frameWidth: number,
  frameHeight: number
): {
  ear: number;
  mar: number;
  eyeStatus: string;
  mouthStatus: string;
  drowsy: boolean;
  sleepStatus: string;
  headAngle: number;
} => {
  // Convert landmarks to array format
  const landmarks = faceLandmarks.map((landmark: any) => [
    landmark.x * frameWidth,
    landmark.y * frameHeight,
  ]);

  // Calculate EAR
  const leftEar = eyeAspectRatio(landmarks, LEFT_EYE);
  const rightEar = eyeAspectRatio(landmarks, RIGHT_EYE);
  const ear = (leftEar + rightEar) / 2.0;

  // Calculate MAR
  const mar = mouthAspectRatio(landmarks);

  // Determine eye status
  const eyeStatus = ear < EYE_AR_THRESH ? "Closed" : "Open";
  
  // Determine mouth status
  const mouthStatus = mar > MOUTH_AR_THRESH ? "Yawning" : "Not Yawning";
  
  // Calculate head angle (simplified)
  // In a real implementation, this would use 3D points to calculate actual head pose
  const headAngle = Math.random() * 10; // Placeholder for demo purposes
  
  // Determine sleep status
  const sleepStatus = (eyeStatus === "Closed" && headAngle > 5) ? "Slept" : "Not Slept";
  
  // Determine overall drowsiness
  const drowsy = eyeStatus === "Closed" || mouthStatus === "Yawning";

  return {
    ear,
    mar,
    eyeStatus,
    mouthStatus,
    drowsy,
    sleepStatus,
    headAngle,
  };
};

// This is a mock implementation since we're not using actual MediaPipe in the browser
// In a production app, you would use a library like face-api.js or MediaPipe for Web
export const mockProcessImageData = (imageData: string): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Random EAR value around the threshold to simulate eye open/closed
      const ear = Math.random() * 0.1 + 0.18; // 0.18 - 0.28
      const eyeStatus = ear < EYE_AR_THRESH ? "Closed" : "Open";
      
      // Random MAR value
      const mar = Math.random() * 0.3 + 0.5; // 0.5 - 0.8
      const mouthStatus = mar > MOUTH_AR_THRESH ? "Yawning" : "Not Yawning";
      
      // Random head angle
      const headAngle = Math.random() * 30;
      
      // Determine sleep status based on eye and head
      const sleepStatus = (eyeStatus === "Closed" && Math.random() > 0.7) 
        ? "Slept" 
        : "Not Slept";
      
      // Overall drowsiness detection
      const drowsy = eyeStatus === "Closed" || mouthStatus === "Yawning";
      
      resolve({
        eye_status: eyeStatus,
        mouth_status: mouthStatus,
        sleep_status: sleepStatus,
        ear_value: ear,
        mar_value: mar,
        head_angle: headAngle,
        drowsy: drowsy
      });
    }, 300); // Simulate processing delay
  });
};
