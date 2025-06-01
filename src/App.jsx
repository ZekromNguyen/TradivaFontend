import AppRouter from './routes';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
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