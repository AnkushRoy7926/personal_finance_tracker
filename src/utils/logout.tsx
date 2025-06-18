import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';


export function useLogoutUser() {
  const router = useRouter();

  const logoutUser = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      router.push('/'); // Redirect to home
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return logoutUser;
}
