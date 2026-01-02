
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./Adminpage/admin/Admin";
import Employee from "./pages/employee/Employee";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ProtectedRoutes from "./auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import Home from "./pages/home/Home";
import TaskList from "./pages/Task/TaskList";
import AssingTask from "./pages/Task/AssingTasl";
import StatusTask from "./pages/Task/StatusTask";
import PublicRoute from './auth/PublicRoute';
import Employeetask from './pages/Task/Employeetask,';
import AddSubTask from './pages/Task/AddSubTask'
import AllEmployee from './pages/attendance/AllEmployee'
import Approve from './pages/attendance/Approve';
import EmployeeAttendance from './pages/attendance/EmployeeAttance'
import AdminChat from "./chatingpage/AdminChat";
import Employeechat from "./chatingpage/Employeechat";
const AppWrapper = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoutes role="employee">
              <Employee />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/mark"
          element={
            <ProtectedRoutes role="employee">
              <EmployeeAttendance />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/employeetask"
          element={
            <ProtectedRoutes role="employee">
              <Employeetask />
            </ProtectedRoutes>
          }
        />
             <Route
          path="/employeechat"
          element={
            <ProtectedRoutes role="employee">
              <Employeechat/>
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
        <Route
          path="/adminchat"
          element={
            <ProtectedRoutes role="admin">
              <AdminChat />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update"
          element={
            <ProtectedRoutes role="admin">
              <Approve />
            </ProtectedRoutes>
          }
        />   <Route
          path="/status"
          element={
            <ProtectedRoutes role="admin">
              <StatusTask />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/all"
          element={
            <ProtectedRoutes role="admin">
              <AllEmployee />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tasklist"
          element={
            <ProtectedRoutes role="admin">
              <TaskList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/assign"
          element={
            <ProtectedRoutes role="admin">
              <AssingTask />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoutes role="admin">
              <StatusTask />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-subtask/:taskId"
          element={
            <ProtectedRoutes role="employee">
              <AddSubTask />
            </ProtectedRoutes>
          }
        />

        <Route path="/" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
