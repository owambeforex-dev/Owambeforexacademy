import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
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
        
        // Self-healing for Admin: Ensure admin document exists
        const ADMIN_EMAIL = "info.realcipher@gmail.com";
        if (user.email === ADMIN_EMAIL) {
          getDoc(userDocRef).then(async (docSnap) => {
            if (!docSnap.exists() || docSnap.data()?.role !== 'super_admin') {
              console.log("[AuthContext] Admin document missing or invalid, creating/fixing...");
              try {
                await setDoc(userDocRef, {
                  uid: user.uid,
                  name: 'Super Admin',
                  email: user.email,
                  role: 'super_admin',
                  updatedAt: new Date().toISOString()
                }, { merge: true });
                console.log("[AuthContext] Admin document fixed");
              } catch (err) {
                console.error("[AuthContext] Failed to fix admin document:", err);
                setLoading(false); // Stop loading on failure
              }
            }
          }).catch(err => {
            console.error("[AuthContext] Error in admin self-healing check:", err);
            setLoading(false); // Stop loading on failure
          });
        }

        // Safety timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setLoading(prev => {
            if (prev) {
              console.warn("[AuthContext] Loading timeout reached, forcing loading=false");
              return false;
            }
            return prev;
          });
        }, 5000); // 5 seconds timeout

        unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            clearTimeout(timeoutId);
            const data = docSnap.data();
            console.log("[AuthContext] userData fetched successfully:", data.role);
            setUserData(data);
            setLoading(false);
          } else {
            console.warn("[AuthContext] userData document does not exist for UID:", user.uid);
            setUserData(null);
            if (user.email !== ADMIN_EMAIL) {
              clearTimeout(timeoutId);
              setLoading(false);
            }
          }
        }, (error) => {
          clearTimeout(timeoutId);
          console.error("[AuthContext] Error fetching user data:", error);
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
