
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskContext } from "../../TaskContext/TaskContext";
import { AuthContext } from "../../auth/AuthContext";
import { toast } from "react-toastify";

const AddSubTask = () => {
  const { taskId } = useParams(); 
  const { addSubtask } = useContext(TaskContext); // Context function
  const { user } = useContext(AuthContext); // Logged-in employee
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-fill task info for display
  const [info, setInfo] = useState({ employeeId: "", taskId: "" });
  useEffect(() => {
    if (user && taskId) {
      setInfo({ employeeId: user.id, taskId });
    }
  }, [user, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Subtask title cannot be empty");

    setLoading(true);

    try {
      const result = await addSubtask(info.taskId, title, info.employeeId);

      if (result.success) {
        setTitle("");
       
        navigate("/employeetask");
      }
    } catch (err) {
      console.error("Add subtask error:", err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl -mx-8 -mt-8 px-8 py-6 mb-6 text-white text-center shadow-md">
          <h1 className="text-2xl font-bold">Add Subtask</h1>
        </div>

        {/* Task Info */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 p-2"><span className="font-semibold">Task ID:</span> {info.taskId}</p>
          <p className="text-gray-700 p-2"><span className="font-semibold">Employee ID:</span> {info.employeeId}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subtask Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter subtask title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding..." : "Add Subtask"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubTask;
