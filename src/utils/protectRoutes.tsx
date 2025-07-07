'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@src/firebaseConfig";
import LoadingScreen from "@src/components/loading";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      // Immediate offline redirect
      if (!navigator.onLine) {
        router.replace("/no_internet");
        return;
      }

      const handleOffline = () => {
        router.replace("/no_internet");
      };

      window.addEventListener("offline", handleOffline);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/login");
        } else {
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
        window.removeEventListener("offline", handleOffline);
      };
    }, [router]);

    if (loading) {
      return <LoadingScreen />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
