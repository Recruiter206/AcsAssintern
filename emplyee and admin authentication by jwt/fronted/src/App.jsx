
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Admin from './pages/admin/Admin';
import Employee from './pages/employee/Employee';
import ProtectedRoutes from './auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/employee"
          element={
            <ProtectedRoutes role="employee">
              <Employee />
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoutes role="admin">
              <Admin />
            </ProtectedRoutes>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;
