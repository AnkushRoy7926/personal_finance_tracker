'use client';

import { JSX, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@src/firebaseConfig";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/login"); // Redirect to login if not authenticated
        } else {
          setLoading(false); // User is authenticated
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <p>Loading...</p>; // Optional loading indicator
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
