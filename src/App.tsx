/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Blitz from './pages/Blitz';
import Inclusoes from './pages/Inclusoes';
import Transferencias from './pages/Transferencias';
import Disciplina from './pages/Disciplina';

// Protected Route Component
const ProtectedRoute = ({ children, user }: { children: React.ReactNode, user: any }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="blitz" element={<Blitz />} />
          <Route path="inclusoes" element={<Inclusoes />} />
          <Route path="transferencias" element={<Transferencias />} />
          <Route path="disciplina" element={<Disciplina />} />
        </Route>
      </Routes>
    </Router>
  );
}
