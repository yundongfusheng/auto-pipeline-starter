import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Todos from './pages/Todos';
import About from './pages/About';
import Login from './pages/Login';
import Kanban from './pages/Kanban';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min
      retry: 1,
    },
  },
});

function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth & Kanban routes (own layout, no shared Navbar) */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />

          {/* Original routes with shared Navbar */}
          <Route path="/" element={<NavLayout><Home /></NavLayout>} />
          <Route path="/todos" element={<NavLayout><Todos /></NavLayout>} />
          <Route path="/about" element={<NavLayout><About /></NavLayout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
