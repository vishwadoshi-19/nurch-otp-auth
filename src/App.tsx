import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import {
  FormState,
  PhoneVerificationState,
  UserDetailsState,
  ShiftsState,
  WagesState,
  EducationState,
  SkillsState,
  PersonalInfoState,
  TestimonialState,
  IdProofState,
} from "./types";
import { PhoneVerification } from "./components/PhoneVerification";
import { UserDetails } from "./components/UserDetails";
import { ShiftSelection } from "./components/ShiftSelection";
import { WagesSection } from "./components/WagesSection";
import { EducationSection } from "./components/EducationSection";
import { SkillsSection } from "./components/SkillsSection";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { TestimonialSection } from "./components/TestimonialSection";
import { IdProofSection } from "./components/IdProofSection";
import { FormProgress } from "./components/FormProgress";

const FORM_STEPS = [
  { id: "phone", label: "Phone" },
  { id: "details", label: "Details" },
  { id: "wages", label: "Wages" },
  { id: "education", label: "Education" },
  { id: "shifts", label: "Shifts" },
  { id: "skills", label: "Skills" },
  { id: "personal", label: "Personal" },
  { id: "testimonial", label: "Testimonial" },
  { id: "idproof", label: "ID Proof" },
] as const;

function App() {
  const [step, setStep] = useState<
    | "phone"
    | "details"
    | "wages"
    | "education"
    | "shifts"
    | "skills"
    | "personal"
    | "testimonial"
    | "idproof"
    | "completed"
  >("phone");
  const [formState, setFormState] = useState<FormState>({});
  const [verificationState, setVerificationState] =
    useState<PhoneVerificationState>({
      verificationId: null,
      phoneNumber: "",
      showOTP: false,
      otp: "",
      isVerified: false,
    });
  const [userDetails, setUserDetails] = useState<UserDetailsState>({
    fullName: "",
    jobLocation: "",
    gender: "",
    profilePhoto: null,
    previewUrl: "",
    agency: "",
  });
  const [wagesState, setWagesState] = useState<WagesState>({
    lessThan5Hours: 0,
    hours12: 0,
    hours24: 0,
  });
  const [educationState, setEducationState] = useState<EducationState>({
    qualification: "",
    certificate: null,
    certificatePreview: "",
    experience: 0,
    maritalStatus: "",
    languages: [],
  });
  const [shiftsState, setShiftsState] = useState<ShiftsState>({
    preferredShifts: [],
  });
  const [skillsState, setSkillsState] = useState<SkillsState>({
    jobRole: "",
    services: [],
  });
  const [personalInfoState, setPersonalInfoState] = useState<PersonalInfoState>(
    {
      foodPreference: "",
      smoking: "",
      carryFood: "",
      additionalInfo: "",
    }
  );
  const [testimonialState, setTestimonialState] = useState<TestimonialState>({
    recording: null,
    customerName: "",
    customerPhone: "",
  });
  const [idProofState, setIdProofState] = useState<IdProofState>({
    aadharNumber: "",
    aadharFront: null,
    aadharBack: null,
    panNumber: "",
    panCard: null,
  });

  const handlePhoneVerified = () => {
    setFormState((prev) => ({
      ...prev,
      phoneNumber: verificationState.phoneNumber,
    }));
    setStep("details");
  };

  const handleDetailsSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...userDetails,
    }));
    setStep("wages");
  };

  const handleWagesSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...wagesState,
    }));
    setStep("education");
  };

  const handleEducationSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...educationState,
    }));
    setStep("shifts");
  };

  const handleShiftsSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...shiftsState,
    }));
    setStep("skills");
  };

  const handleSkillsSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...skillsState,
    }));
    setStep("personal");
  };

  const handlePersonalInfoSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...personalInfoState,
    }));
    setStep("testimonial");
  };

  const handleTestimonialSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...testimonialState,
    }));
    setStep("idproof");
  };

  const handleIdProofSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...idProofState,
    }));
    setStep("completed");
    console.log("Complete form data:", formState);
  };

  if (step === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-6">
        <div className="text-center text-white space-y-6">
          <Heart className="w-16 h-16 mx-auto text-red-400 animate-pulse" />
          <h1 className="text-4xl font-bold">Thank you!</h1>
          <p className="text-xl text-blue-50">
            Your application has been received.
          </p>
          <div className="mt-8 bg-white/10 p-6 rounded-lg text-left max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Application Summary</h2>
            <div className="flex items-center justify-center mb-6">
              <Image
                src={userDetails.previewUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover border-2 border-white"
              />
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-blue-200">Phone Number:</dt>
                <dd>{verificationState.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Full Name:</dt>
                <dd>{userDetails.fullName}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Agency:</dt>
                <dd>{userDetails.agency}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Job Location:</dt>
                <dd>{userDetails.jobLocation}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Gender:</dt>
                <dd>{userDetails.gender}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Expected Wages:</dt>
                <dd>
                  <ul className="list-disc list-inside">
                    <li>Less than 5 hours: ₹{wagesState.lessThan5Hours}</li>
                    <li>12 hours: ₹{wagesState.hours12}</li>
                    <li>24 hours: ₹{wagesState.hours24}</li>
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-blue-200">Education:</dt>
                <dd>{educationState.qualification}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Experience:</dt>
                <dd>{educationState.experience} years</dd>
              </div>
              <div>
                <dt className="text-blue-200">Languages:</dt>
                <dd>{educationState.languages.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Preferred Shifts:</dt>
                <dd>{shiftsState.preferredShifts.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Job Role:</dt>
                <dd>{skillsState.jobRole}</dd>
              </div>
              <div>
                <dt className="text-blue-200">Services:</dt>
                <dd>
                  <ul className="list-disc list-inside">
                    {skillsState.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <FormProgress currentStep={step} steps={[...FORM_STEPS]} />

      <AnimatePresence mode="wait">
        {step === "phone" && (
          <PhoneVerification
            verificationState={verificationState}
            setVerificationState={setVerificationState}
            onVerified={handlePhoneVerified}
          />
        )}

        {step === "details" && (
          <UserDetails
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            onSubmit={handleDetailsSubmitted}
          />
        )}

        {step === "wages" && (
          <WagesSection
            wagesState={wagesState}
            setWagesState={setWagesState}
            onBack={() => setStep("details")}
            onNext={handleWagesSubmitted}
          />
        )}

        {step === "education" && (
          <EducationSection
            educationState={educationState}
            setEducationState={setEducationState}
            onBack={() => setStep("wages")}
            onNext={handleEducationSubmitted}
          />
        )}

        {step === "shifts" && (
          <ShiftSelection
            shiftsState={shiftsState}
            setShiftsState={setShiftsState}
            onBack={() => setStep("education")}
            onSubmit={handleShiftsSubmitted}
          />
        )}

        {step === "skills" && (
          <SkillsSection
            skillsState={skillsState}
            setSkillsState={setSkillsState}
            onBack={() => setStep("shifts")}
            onNext={handleSkillsSubmitted}
          />
        )}

        {step === "personal" && (
          <PersonalInfoSection
            personalInfoState={personalInfoState}
            setPersonalInfoState={setPersonalInfoState}
            onBack={() => setStep("skills")}
            onNext={handlePersonalInfoSubmitted}
          />
        )}

        {step === "testimonial" && (
          <TestimonialSection
            testimonialState={testimonialState}
            setTestimonialState={setTestimonialState}
            onBack={() => setStep("personal")}
            onNext={handleTestimonialSubmitted}
          />
        )}

        {step === "idproof" && (
          <IdProofSection
            idProofState={idProofState}
            setIdProofState={setIdProofState}
            onBack={() => setStep("testimonial")}
            onNext={handleIdProofSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
