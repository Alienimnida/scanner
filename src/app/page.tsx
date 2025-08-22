// src/app/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import CyberScope from "./components/CyberScope/CyberScope";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import TrinexLandingPage1 from "./components/ui/TrinexLandingPage1";

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn) {
    return <TrinexLandingPage1 />;
  }

  return <CyberScope />;
}
