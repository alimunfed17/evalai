"use client";

import { useState } from "react";
import ResumeForm from "@/components/Candidate/ResumeForm";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleSuccess = () => {
    setResumeUploaded(true);

    setTimeout(() => {
      setShowButton(true);
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center h-full gap-6">
      {!resumeUploaded && <ResumeForm onSuccess={handleSuccess} />}

      {resumeUploaded && !showButton && (
        <p className="text-green-500 text-lg text-center">
          Resume uploaded successfully! Wait to start the interview
        </p>
      )}

      {showButton && (
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-4 text-center">
          <Button
            onClick={() => window.open("/interview", "_blank")}
            className="w-full text-lg py-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Start Interview
          </Button>
        </div>
      )}
    </div>
  );
}

