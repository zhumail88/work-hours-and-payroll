import { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '../components/Toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Logged in with Google successfully', 'success');
    } catch (err: any) {
      console.error("Google Login failed", err);
      showToast(err.message, 'error');
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showToast('Logged in successfully', 'success');
    } catch (err: any) {
      console.error("Email Login failed", err);
      if (err.code === 'auth/invalid-credential') {
        showToast("Invalid email or password.", 'error');
      } else {
        showToast(err.message, 'error');
      }
      throw err;
    }
  };

  const registerEmail = async (email: string, pass: string, organization?: string, position?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      
      if (userCredential.user) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          organization: organization || '',
          position: position || '',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
      showToast('Account created successfully!', 'success');
    } catch (err: any) {
      console.error("Registration failed", err);
      if (err.code === 'auth/email-already-in-use') {
        showToast("Email is already registered.", 'error');
      } else if (err.code === 'auth/weak-password') {
        showToast("Password should be at least 6 characters.", 'error');
      } else {
        showToast(err.message, 'error');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out', 'info');
    } catch (err: any) {
      console.error("Logout failed", err);
      showToast('Failed to logout', 'error');
    }
  };

  const clearError = () => {}; 

  return { 
    user, 
    loading, 
    error: null, 
    loginGoogle, 
    loginEmail, 
    registerEmail, 
    logout,
    clearError
  };
};