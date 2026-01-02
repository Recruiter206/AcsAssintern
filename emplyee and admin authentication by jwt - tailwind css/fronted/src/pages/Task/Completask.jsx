import React, { useContext, useEffect } from "react";
import { TaskContext } from "../../TaskContext/TaskContext";

const Completask = () => {
  const { tasks, fetchEmployeeTasks, updateSubtask } = useContext(TaskContext);

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  const handleCompleteAll = (task) => {
    task.subtasks.forEach((sub) => {
      if (sub.status.toLowerCase() !== "completed") {
        updateSubtask(sub.subtask_id, "completed", sub.employee_description || "");
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Complete Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks assigned yet.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.task_id}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              {task.start_date && task.end_date && (
                <span className="text-gray-500 text-sm">
                  {task.start_date} - {task.end_date}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4">{task.description}</p>

            <button
              onClick={() => handleCompleteAll(task)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Complete Task
            </button>

            <div className="mt-4 space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.subtask_id}
                  className={`p-2 rounded-lg ${
                    sub.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : sub.status === "in progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {sub.title} - {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Completask;
