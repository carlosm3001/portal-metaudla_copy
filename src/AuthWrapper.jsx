import App from './App';
import { AuthProvider } from './context/AuthContext';

function AuthWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AuthWrapper;
