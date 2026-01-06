
// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { TaskContext } from "../../TaskContext/TaskContext";
// import { AuthContext } from "../../auth/AuthContext";
// import { toast } from "react-toastify";

// const AddSubTask = () => {
//   const { taskId } = useParams(); 
//   const { addSubtask } = useContext(TaskContext); // Context function
//   const { user } = useContext(AuthContext); // Logged-in employee
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Auto-fill task info for display
//   const [info, setInfo] = useState({ employeeId: "", taskId: "" });
//   useEffect(() => {
//     if (user && taskId) {
//       setInfo({ employeeId: user.id, taskId });
//     }
//   }, [user, taskId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return toast.error("Subtask title cannot be empty");

//     setLoading(true);

//     try {
//       const result = await addSubtask(info.taskId, title, info.employeeId);

//       if (result.success) {
//         setTitle("");
       
//         navigate("/employeetask");
//       }
//     } catch (err) {
//       console.error("Add subtask error:", err);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative">
//         {/* Gradient Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl -mx-8 -mt-8 px-8 py-6 mb-6 text-white text-center shadow-md">
//           <h1 className="text-2xl font-bold">Add Subtask</h1>
//         </div>

//         {/* Task Info */}
//         <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <p className="text-gray-700 p-2"><span className="font-semibold">Task ID:</span> {info.taskId}</p>
//           <p className="text-gray-700 p-2"><span className="font-semibold">Employee ID:</span> {info.employeeId}</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Subtask Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter subtask title"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-lg text-white font-semibold transition ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Adding..." : "Add Subtask"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddSubTask;
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskContext } from "../../TaskContext/TaskContext";
import { AuthContext } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import { ListPlus, Hash, UserCircle, ArrowLeft } from "lucide-react"; // npm i lucide-react

const AddSubTask = () => {
  const { taskId } = useParams();
  const { addSubtask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [info, setInfo] = useState({ employeeId: "", taskId: "" });
  useEffect(() => {
    if (user && taskId) {
      setInfo({ employeeId: user.id, taskId });
    }
  }, [user, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      const result = await addSubtask(info.taskId, title, info.employeeId);
      if (result.success) {
        setTitle("");
      
        navigate("/employeetask");
      }
    } catch (err) {
      console.error(err);
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-600 to-blue-700 -z-10 rounded-b-[3rem] shadow-lg"></div>
      
      <div className="w-full max-w-lg">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
          <span className="font-medium text-sm">Back to Tasks</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
           <div className="flex items-center gap-4 justify-center  py-4  bg-gradient-to-r from-blue-600 to-blue-900 mb-10">
              <div className="py-2 text-indigo-50 rounded-2xl ">
                <ListPlus size={28} />
              </div>
              <div className="">
                <h1 className="text-2xl font-black py-2 text-center text-white tracking-tight">Add New Subtask</h1>
               
              </div>
            </div>
          <div className="p-8 md:p-10">
            {/* Header */}
           

            {/* Read-Only Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-12 text-indigo-500 mb-1">
                
                  <span className="text-[10px] gap-7 font-bold uppercase tracking-wider">Task ID</span>
                  <p className="text-slate-700 font-bold truncate">{info.taskId}</p>
                </div>
                
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-indigo-500 mb-1">
                  <UserCircle size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider mr-3">Owner ID:</span>
                   <p className="text-slate-700 font-bold truncate">{info.employeeId}</p>
                </div>
               
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-slate-700 text-sm font-bold my-3 ml-1 transition-colors group-focus-within:text-indigo-600">
                  Subtask Name
                </label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                  rows="3"
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Subtask</span>
                    <ListPlus size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
          Secured Project Management System
        </p>
      </div>
    </div>
  );
};

export default AddSubTask;
