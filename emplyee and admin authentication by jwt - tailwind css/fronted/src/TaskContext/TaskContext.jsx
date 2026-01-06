
import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/Api";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------- ADMIN: Fetch all --------------------
  const fetchAllTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/task/all");
      const data = res.data.tasks || [];
      setTasks(data);
      return data; // FIX: Return data taaki component me undefined na aaye
    } catch (error) {
      toast.error("Failed to fetch tasks");
      return [];
    } finally {
      setLoading(false);
    }
  };

    // -------------------- ADMIN: Fetch task summary/status --------------------
  const fetchTaskStatus = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/task/status"); 
      setTaskStatus(res.data.tasks || []);     
    } catch (error) {
      toast.error("Failed to fetch task status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // add subtask
const addSubtask = async (task_id, title, employee_id) => {
  try {
    const res = await API.post("/task/subtask", {
      task_id,
      title,
      employee_id
    });
    toast.success(res.data.message || "Subtask added successfully");
    
    // Refresh tasks for employee
    if (user.role === "employee") fetchEmployeeTasks();
    else fetchAllTasks();

    return res.data; // return data so component can handle success
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to add subtask");
    console.error(error);
    return { success: false, message: error.response?.data?.message || "Failed" };
  }
};
  // -------------------- EMPLOYEE: Fetch own tasks --------------------
  const fetchEmployeeTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/task/my-tasks");
      const data = res.data.tasks || [];
      console.log("Fetched Employee Tasks:", data);
      setTasks(data);
      return data; // FIX: Yeh return karna zaroori hai
    } catch (error) {
      toast.error("Failed to fetch your tasks");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UPDATE SUBTASK --------------------
  const updateSubtask = async (subtask_id, status, description) => {
    try {
      
      const res = await API.put(`/task/subtask/${subtask_id}`, {
        status,
        employee_description: description,
      });

      toast.success(res.data.message || "Subtask updated");

      // Local State Update Logic
      setTasks(prevTasks =>
        prevTasks.map(task => ({
          ...task,
          subtasks: (task.subtasks || []).map(st =>
            st.subtask_id === parseInt(subtask_id)
              ? { ...st, status, employee_description: description }
              : st
          )
        }))
      );
      return res.data;
    } catch (error) {
      // FIX: Agar error 'CHECK constraint failed' hai, to matlab DB reset chahiye
      const errorMsg = error.response?.data?.message || "Update failed";
      toast.error(errorMsg);
      console.error("Update Subtask Error:", error);
      return { success: false };
    }
  };

  // ... (Baki functions assignTask aur addSubtask sahi hain)

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      fetchAllTasks();
    } else {
      fetchEmployeeTasks();
    }
  }, [user]);


  // -------------------- ASSIGN TASK (ADMIN) --------------------
  const assignTask = async (title, description, startDate, endDate, employee_ids) => {
    try {
      const res = await API.post("/task/assign", {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        employee_ids,
      });
      toast.success(res.data.message || "Task assigned successfully");
      fetchAllTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign task");
      console.error(error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        taskStatus,
        loading,
        fetchAllTasks,
        fetchEmployeeTasks,
        addSubtask,
     
       
        
        fetchTaskStatus,
        updateSubtask,
        assignTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
