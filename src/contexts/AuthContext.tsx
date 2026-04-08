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

    console.log("[AuthContext] Initializing auth listener...");

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthContext] Auth state changed:", user ? `User logged in: ${user.email}` : "No user logged in");
      
      setCurrentUser(user);
      
      // Clean up previous data subscription if it exists
      if (unsubscribeData) {
        console.log("[AuthContext] Cleaning up previous Firestore subscription");
        unsubscribeData();
        unsubscribeData = null;
      }

      if (user) {
        // We have a user, but we need to wait for their Firestore data
        setLoading(true);
        
        console.log("[AuthContext] Fetching userData for UID:", user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("[AuthContext] userData fetched successfully:", data.role);
            setUserData(data);
          } else {
            console.warn("[AuthContext] userData document does not exist for UID:", user.uid);
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("[AuthContext] Error fetching user data:", error);
          // If there's an error fetching data, we still need to stop loading
          // but we might want to keep the user logged in if it's just a temporary error
          setLoading(false);
        });
      } else {
        // No user, definitely not loading anymore
        console.log("[AuthContext] No user, clearing userData and stopping loading");
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("[AuthContext] Unmounting AuthProvider, cleaning up listeners");
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
