import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Bu sefer context'ten login fonksiyonunu alıyoruz
  const { login } = useData();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login({ email, password });
      navigate('/expenses'); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-slate-800">Log In to ExpenseFlow</h2>
             <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-slate-600">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="text-sm font-medium text-slate-600">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div>
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    </div>
  );
}
export default LoginPage;