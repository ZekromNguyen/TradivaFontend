import AppRouter from './routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50" style={{ color: '#111827' }}>
        <AppRouter />
      </div>
    </AuthProvider>
  )
}

export default App