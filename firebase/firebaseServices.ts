import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const fetchGlobalData = async () => {
  try {
    const profileRef = doc(db, "global", "setting");
    const docSnap = await getDoc(profileRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching global data:", error);
    throw error;
  }
};

export const listenToGlobalData = (
  callback: (arg0: DocumentData | null) => void
) => {
  try {
    const profileRef = doc(db, "global", "setting");
    const unsubscribe = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data());
        } else {
          console.warn("Global settings document does not exist.");
          callback(null);
        }
      },
      (error) => {
        console.error("Error listening to global data:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up global data listener:", error);
  }
};

// User Services
export const userServices = {
  getUserProfile: async (userId: string) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const userRef = doc(db, "passengers", userId, "data", "profile");
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Profile not found");
      }

      return userSnap.data();
    } catch (error) {
      handleFirebaseError(error);
    }
  },
};

// Error handling utility
export const handleFirebaseError = (error: any) => {
  console.error("Firebase Error:", error);
  if (error.code) {
    switch (error.code) {
      case "permission-denied":
        return "You don't have permission to perform this action";
      case "not-found":
        return "The requested document was not found";
      case "already-exists":
        return "This record already exists";
      default:
        return "An error occurred while processing your request";
    }
  }
  return "An unexpected error occurred";
};
