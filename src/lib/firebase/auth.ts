import { auth, db } from "./config";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserData } from "@/types/index";

// Setup recaptcha verifier
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
  });
};

// Send OTP to phone number
export const sendOTP = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
) => {
  try {
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    return { success: true, verificationId };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error };
  }
};

// Verify OTP and sign in
export const verifyOTP = async (verificationId: string, otp: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};

// Check if user exists in Firestore
export const checkUserExists = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists();
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
};

// Create user in Firestore
export const createUser = async (user: User, userData: Partial<UserData>) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      phone: user.phoneNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...userData,
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() as UserData };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return { success: false, error };
  }
};
