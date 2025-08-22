// src/app/page.tsx
'use client';

import { useUser } from "@clerk/nextjs";
import CyberScope from './components/CyberScope/CyberScope';

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Please sign in to access CyberScope</div>
        {/* Or redirect using window.location or Next.js router */}
      </div>
    );
  }

  return <CyberScope />;
}