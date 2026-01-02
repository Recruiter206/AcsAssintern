
import { useState, createContext, useEffect } from "react";
import API from "../api/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [ownData, setOwnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  // Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");

    if (token && role && name && id) {
      setUser({ token, role, name, id });
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const res = await API.post("/login", { email, password });
      const { token, role, name, id } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("id", id);

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token, role, name, id });

      toast.success("Login successful!");
      return { success: true, role };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const registerUser = async (name, email, password, role) => {
    try {
      const res = await API.post("/register", { name, email, password, role });
      toast.success("Registration successful!");
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.clear();
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
    setDashboard(null);
    setEmployees([]);
    setOwnData(null);
    toast.info("Logout successful!");
  };

  const fetchEmployees = async () => {
    if (user?.role !== "admin") return [];
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error(error);
      return [];
    }
  };

  // Corrected: send id in body
  const updateEmployee = async (id, data) => {
    if (user?.role !== "admin") {
      toast.error("Unauthorized");
      return null;
    }
    try {
      const payload = { id, ...data }; // ID must be in body
      const res = await API.put("/employee", payload);
      toast.success(res.data.message || "Employee updated successfully");
      await fetchEmployees(); // Refresh list
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update employee";
      toast.error(message);
      console.error(error);
      return null;
    }
  };

  const fetchOwnData = async () => {
    if (user?.role !== "employee") return null;
    try {
      const res = await API.get("/me");
      setOwnData(res.data);
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch own data");
      console.error(error);
      return null;
    }
  };

  const fetchDashboard = async () => {
    if (!user) return null;
    if (user.role === "admin") {
      await fetchEmployees();
      setDashboard({ message: "Admin Dashboard", employeeCount: employees.length });
    } else {
      await fetchOwnData();
      setDashboard({ message: "Employee Dashboard", name: ownData?.name });
    }
    return dashboard;
  };

  // Delete employee (admin only)
  const deleteEmployee = async (id) => {
    if (user?.role !== "admin") {
      toast.error("Unauthorized");
      return null;
    }

    try {
      const res = await API.delete("/delete", {
        data: { id } // 👈 DELETE me body aise bhejte hain
      });

      toast.success(res.data.message || "Employee deleted successfully");

      // Option 1: Refetch from backend
      await fetchEmployees();

      // Option 2 (optional): local state se remove
      // setEmployees(prev => prev.filter(emp => emp.id !== id));

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete employee";
      toast.error(message);
      console.error(error);
      return null;
    }
  };

  // Search employees (admin only)
  const searchEmployees = async (query) => {
    if (user?.role !== "admin") {
      toast.error("Unauthorized");
      return [];
    }

    try {
      const res = await API.get("/employees/search", {
        params: { query } // send as query param
      });
      setEmployees(res.data); // update state with search results
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to search employees";
      toast.error(message);
      console.error(error);
      return [];
    }
  };

  // Fetch admins (for employee chat)
  const fetchAdmins = async () => {
    if (user?.role !== "employee") return [];
    try {
      const res = await API.get("/admins"); 
      setAdmins(res.data);
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch admins");
      console.error(error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dashboard,
        employees,
        ownData,
        loading, setLoading,
        setOwnData,
        loginUser,
        registerUser,
        logout,
        fetchDashboard,
        fetchEmployees,
        fetchOwnData,
        updateEmployee, setEmployees, deleteEmployee, searchEmployees, admins, setAdmins, fetchAdmins
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
