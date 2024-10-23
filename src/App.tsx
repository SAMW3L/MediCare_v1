import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import MedicineManagement from './components/MedicineManagement';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <Router>
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/employees"
              element={
                isAuthenticated ? (
                  <EmployeeManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/medicines"
              element={
                isAuthenticated ? (
                  <MedicineManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/sales"
              element={
                isAuthenticated ? (
                  <Sales />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/reports"
              element={
                isAuthenticated ? (
                  <Reports />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;