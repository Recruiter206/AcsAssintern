
// import React, { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import { TaskContext } from "../../TaskContext/TaskContext";
// import { toast } from "react-toastify";

// const AssignTask = () => {
//   const { employees, fetchEmployees } = useContext(AuthContext);
//   const { assignTask } = useContext(TaskContext);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [employeeIds, setEmployeeIds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const toggleEmployee = (id) => {
//     setEmployeeIds((prev) =>
//       prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !description || !startDate || employeeIds.length === 0) {
//       toast.error("Please fill all fields and select employees.");
//       return;
//     }

//     await assignTask(title, description, startDate, endDate, employeeIds);

//     // Reset form
//     setTitle("");
//     setDescription("");
//     setStartDate("");
//     setEndDate("");
//     setEmployeeIds([]);
//     setSearchTerm("");
//   };

//   // Filter employees by name or ID
//   const filteredEmployees = employees.filter(
//     (emp) =>
//       emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(emp.id).includes(searchTerm)
//   );

//   return (
//     <div className="max-w-xl mx-auto my-5 py-6 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-2xl">
//       <div className="m-4"><h2 className="text-3xl font-sans mb-6 text-gray-800 text-center">
//         Assign Task
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-2">
//         {/* Task Info */}
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400"
//           required
//         />
//         <textarea
//           placeholder="Task Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full px-4 py-2 border rounded-md border-gray-400 focus:ring-2 focus:ring-blue-400"
//           rows={4}
//           required
//         />
//         <div className="flex gap-4">
//   <div className="flex-1 flex flex-col">
//     <label className="mb-1 font-semibold text-gray-700">Start Date</label>
//     <input
//       type="date"
//       value={startDate}
//       onChange={(e) => setStartDate(e.target.value)}
//       className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400"
//       required
//     />
//   </div>

//   <div className="flex-1 flex flex-col">
//     <label className="mb-1 font-semibold text-gray-700">End Date</label>
//     <input
//       type="date"
//       value={endDate}
//       onChange={(e) => setEndDate(e.target.value)}
//       className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400"
//     />
//   </div>
// </div>

        

//         {/* Employee Search */}
//         <div className="border p-4 border-gray-400 rounded-md bg-white shadow-sm">
//           <div className="flex justify-between mb-2">
//             <p className="font-semibold">Assign to Employees:</p>
//             <input
//               type="text"
//               placeholder="Search by name or ID"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400"
//             />
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
//             {filteredEmployees.map((emp) => (
//               <label
//                 key={emp.id}
//                 className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-blue-50 ${
//                   employeeIds.includes(emp.id) ? "bg-blue-100" : ""
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   value={emp.id}
//                   checked={employeeIds.includes(emp.id)}
//                   onChange={() => toggleEmployee(emp.id)}
//                 />
//                 <span className="text-gray-700">{emp.name} (ID: {emp.id})</span>
//               </label>
//             ))}
//             {filteredEmployees.length === 0 && (
//               <p className="text-gray-500 col-span-full">No employees found</p>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
//         >
//           Assign Task
//         </button>
//       </form></div>
//     </div>
//   );
// };

// export default AssignTask;
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { TaskContext } from "../../TaskContext/TaskContext";
import { toast } from "react-toastify";
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  Search, 
  CheckCircle2, 
  SendHorizontal,
  Plus
} from "lucide-react";

const AssignTask = () => {
  const { employees, fetchEmployees } = useContext(AuthContext);
  const { assignTask } = useContext(TaskContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeIds, setEmployeeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchEmployees(); }, []);

  const toggleEmployee = (id) => {
    setEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || employeeIds.length === 0) {
      toast.error("Kripya sabhi zaroori fields bharein.");
      return;
    }
    await assignTask(title, description, startDate, endDate, employeeIds);
  
    setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setEmployeeIds([]);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(emp.id).includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 font-sans">
  <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
    
    {/* --- Modern Gradient Header --- */}
    <div className="bg-gradient-to-r from-sky-600 to-sky-900 px-8 py-6 flex justify-between items-center text-white">
      <div className="flex flex-col">
        <h2 className="text-2xl font-black tracking-tight leading-none">Assign Task</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-70">Project Orchestration</p>
      </div>
      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
        <Plus size={24} className="text-white" />
      </div>
    </div>

    {/* --- Professional Form Section --- */}
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      
      {/* Section 1: Task Core Details */}
      <div className="space-y-4">
        <div className="group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Objective Title</label>
          <input
            type="text"
            placeholder="e.g., Q1 Financial Audit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 font-bold text-slate-700 transition-all placeholder:text-slate-300 shadow-sm"
            required
          />
        </div>
        
        <div className="group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Mission Context</label>
          <textarea
            placeholder="Outline the scope and key deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 font-medium placeholder:text-slate-300 text-slate-600 min-h-[110px] transition-all shadow-sm"
            required
          />
        </div>
      </div>

      {/* Section 2: Timeline Matrix */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block flex items-center gap-1.5">
            <Calendar size={12} className="text-sky-500"/> Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 font-black text-slate-600 text-xs shadow-sm cursor-pointer"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block flex items-center gap-1.5">
            <Calendar size={12} className="text-rose-500"/> End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 font-black text-slate-600 text-xs shadow-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Section 3: Personnel Selection */}
      <div className="space-y-4 pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
            <Users size={16} className="text-sky-600" /> Team Assignment
          </div>
          <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-[10px] font-black shadow-sm border border-sky-100">
            {employeeIds.length} ACTIVE
          </span>
        </div>

        {/* Dynamic Search Box */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Filter workforce by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-semibold text-sm transition-all shadow-sm"
          />
        </div>

        {/* Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar py-2">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => toggleEmployee(emp.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border-2 ${
                employeeIds.includes(emp.id)
                  ? "bg-sky-50 border-sky-500 shadow-md ring-1 ring-sky-500/20"
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                  employeeIds.includes(emp.id) ? "bg-sky-600 text-white shadow-lg shadow-sky-200" : "bg-slate-100 text-slate-400"
                }`}>
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[13px] leading-tight mb-0.5">{emp.name}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter italic">ID: {emp.id}</p>
                </div>
              </div>
              {employeeIds.includes(emp.id) && <CheckCircle2 className="text-sky-600" size={18} />}
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 col-span-full border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
               <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest italic">Staff member not found</p>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="submit"
        className="w-full bg-sky-600 hover:bg-sky-700 text-white p-[14px] rounded-[1.8rem] font-black text-base shadow-xl shadow-sky-100 hover:shadow-sky-200 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
      >
        <span>Deploy Assignment</span>
        <SendHorizontal size={20} />
      </button>
    </form>
  </div>
</div>

  );
};

export default AssignTask;
