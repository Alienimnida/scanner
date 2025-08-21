import { useUser } from "@clerk/nextjs";

export function useUserContext() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  return {
    userId: user?.id || undefined,
    user,
    isLoaded,
    isSignedIn
  };
}