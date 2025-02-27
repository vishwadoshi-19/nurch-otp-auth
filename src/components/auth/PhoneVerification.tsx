"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, KeyRound } from "lucide-react";
import Image from "next/image";
import { PhoneVerificationState } from "@/types";
import { setupRecaptcha, sendOTP, verifyOTP } from "@/lib/firebase/auth";
import toast from "react-hot-toast";

interface PhoneVerificationProps {
  verificationState: PhoneVerificationState;
  setVerificationState: React.Dispatch<
    React.SetStateAction<PhoneVerificationState>
  >;
  onVerified: () => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  verificationState,
  setVerificationState,
  onVerified,
}) => {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup function to remove recaptcha when component unmounts
    return () => {
      const recaptchaElements = document.querySelectorAll(".grecaptcha-badge");
      recaptchaElements.forEach((element) => {
        element.remove();
      });
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format phone number to E.164 format if not already
      let formattedPhone = verificationState.phoneNumber;
      if (!formattedPhone.startsWith("+")) {
        // Assuming Indian phone numbers
        formattedPhone = `+91${formattedPhone}`;
      }

      // Setup recaptcha
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");

      // Send OTP
      const result = await sendOTP(formattedPhone, recaptchaVerifier);

      if (result.success) {
        setVerificationState((prev) => ({
          ...prev,
          showOTP: true,
          verificationId: result.verificationId,
          phoneNumber: formattedPhone,
        }));
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationState.verificationId) {
      toast.error("Verification ID not found. Please try again.");
      return;
    }

    try {
      const result = await verifyOTP(
        verificationState.verificationId,
        verificationState.otp
      );

      if (result.success) {
        setVerificationState((prev) => ({ ...prev, isVerified: true }));
        toast.success("Phone verified successfully!");
        onVerified();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-blue-400">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-white/10">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=200&h=200"
              alt="Healthcare"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">Phone Verification</h2>
        </div>
        <form
          onSubmit={
            verificationState.showOTP ? handleOTPSubmit : handlePhoneSubmit
          }
          className="space-y-6"
        >
          {!verificationState.showOTP ? (
            <>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  value={verificationState.phoneNumber}
                  onChange={(e) =>
                    setVerificationState({
                      ...verificationState,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
            </>
          ) : (
            <>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                  value={verificationState.otp}
                  onChange={(e) =>
                    setVerificationState({
                      ...verificationState,
                      otp: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {verificationState.showOTP ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
