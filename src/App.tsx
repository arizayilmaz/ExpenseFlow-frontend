import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-8">
      <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;