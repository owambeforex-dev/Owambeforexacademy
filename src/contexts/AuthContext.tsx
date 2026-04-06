import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

interface AuthContextType {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
  isEmailVerified: boolean;
  refreshUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  isEmailVerified: false,
  refreshUserData: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeData: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Clean up previous data subscription if it exists
      if (unsubscribeData) {
        unsubscribeData();
        unsubscribeData = null;
      }

      if (user) {
        // Subscribe to user data in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeData) {
        unsubscribeData();
      }
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    isEmailVerified: currentUser?.emailVerified || false,
    refreshUserData,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
