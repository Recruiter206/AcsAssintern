
import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/Api";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);          // Full tasks (detailed)
  const [taskStatus, setTaskStatus] = useState([]); // Status summary (from /status)
  const [loading, setLoading] = useState(true);

  // -------------------- ADMIN: Fetch all assigned tasks --------------------
  const fetchAllTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/task/all");  // Uses getAllAssignedTasksForAdmin
      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- ADMIN: Fetch task summary/status --------------------
  const fetchTaskStatus = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/task/status"); // Uses getTaskSummaryForAdmin
      setTaskStatus(res.data.tasks || []);      // Store summary separately
    } catch (error) {
      toast.error("Failed to fetch task status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- EMPLOYEE: Fetch own tasks --------------------
  const fetchEmployeeTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/task/my-tasks");
      console.log("res.data.tasks",res.data.tasks)
      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error("Failed to fetch your tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
const updateSubtask = async (subtask_id, status, description) => {
  try {
    const res = await API.put(`/task/subtask/${subtask_id}`, {
      status,
      employee_description: description,
    });
    toast.success(res.data.message || "Subtask updated");

    // Update tasks locally without refetching everything
    setTasks(prevTasks =>
      prevTasks.map(task => ({
        ...task,
        subtasks: task.subtasks.map(st =>
          st.subtask_id === subtask_id
            ? { ...st, status, employee_description: description }
            : st
        )
      }))
    );

    return res.data;
  } catch (error) {
    toast.error("Failed to update subtask");
    console.error(error);
    return { success: false };
  }
};

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

  // Add this inside TaskProvider
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


  // -------------------- INITIAL FETCH --------------------
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      fetchAllTasks();
      fetchTaskStatus();  // Fetch summary for admin dashboard
    } else {
      fetchEmployeeTasks();
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        taskStatus,          // Task summary for admin
        loading,
        fetchAllTasks,
        fetchEmployeeTasks,
        fetchTaskStatus,
        updateSubtask,
        assignTask,addSubtask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
