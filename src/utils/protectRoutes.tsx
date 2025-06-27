'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@src/firebaseConfig";
import LoadingScreen from "@src/components/loading";
import { Snackbar, Alert } from "@mui/material";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const [loading, setLoading] = useState(true);
    const [offline, setOffline] = useState(false);
    const router = useRouter();

    useEffect(() => {

      const handleOffline = () => {
        setOffline(true);
        setTimeout(() => router.push("/"), 3000); // Redirect to home after 3s
      };
      const handleOnline = () => setOffline(false);
      // Check initial network status
      if (!navigator.onLine) {
        handleOffline();
      }


      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, [router]);

    if (loading || offline) {
      return (
        <>
          <LoadingScreen />
          <Snackbar open={offline}>
            <Alert severity="error" sx={{ width: '100%' }}>
              No Internet Connection. Redirecting to homepage...
            </Alert>
          </Snackbar>
        </>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
