import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "flowzen-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "flowzen-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "flowzen-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Real-time data models
export interface Stall {
  id: string;
  name: string;
  type: 'food' | 'water' | 'merchandise';
  crowd: number;
  waitingTime: number;
  location: { x: number; y: number };
  capacity: number;
}

export interface VIPUser {
  id: string;
  userId: string;
  tier: 'gold' | 'platinum' | 'diamond';
  gateAssigned: string;
  priority: number;
}

export interface SOSAlert {
  id: string;
  userId: string;
  type: 'medical' | 'security' | 'lost';
  location: string;
  status: 'pending' | 'attended' | 'resolved';
  timestamp: any;
  description: string;
}

export interface CrowdData {
  gateId: string;
  crowdLevel: number;
  timestamp: any;
  capacity: number;
}

// Firestore operations
export async function createSOSAlert(userId: string, type: string, description: string) {
  try {
    const docRef = await addDoc(collection(db, 'sos_alerts'), {
      userId,
      type,
      status: 'pending',
      timestamp: serverTimestamp(),
      description,
      resolved: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating SOS alert:', error);
    return null;
  }
}

export async function updateCrowdData(gateId: string, crowdLevel: number) {
  try {
    const gateRef = doc(db, 'gates', gateId);
    await updateDoc(gateRef, {
      crowdLevel,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating crowd data:', error);
  }
}

export function subscribeToSOSAlerts(callback: (alerts: SOSAlert[]) => void) {
  try {
    const q = query(collection(db, 'sos_alerts'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SOSAlert[];
      callback(alerts);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to SOS alerts:', error);
    return () => {};
  }
}

export function subscribeToCrowdData(gateId: string, callback: (data: CrowdData) => void) {
  try {
    const gateRef = doc(db, 'gates', gateId);
    const unsubscribe = onSnapshot(gateRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as CrowdData);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to crowd data:', error);
    return () => {};
  }
}
