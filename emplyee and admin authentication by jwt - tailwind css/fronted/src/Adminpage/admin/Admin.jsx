
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import { Link } from "react-router-dom";
// import { 

//   ShieldCheck, 

// } from "lucide-react";
// const Admin = () => {
//   const {
//     user,
//     fetchEmployees,
//     employees,
//     updateEmployee,
//     setEmployees,
//     deleteEmployee,
//     searchEmployees
//   } = useContext(AuthContext);

//   const [loading, setLoading] = useState(true);
//   const [editData, setEditData] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (!user || user.role !== "admin") return;

//     const loadEmployees = async () => {
//       setLoading(true);
//       await fetchEmployees();
//       setLoading(false);
//     };

//     loadEmployees();
//   }, []);

//   // Handle search input changes
//   const handleSearch = async (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     if (query.trim() === "") {
//       await fetchEmployees();
//     } else {
//       await searchEmployees(query);
//     }
//   };

//   const handleChange = (id, field, value) => {
//     setEditData((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value,
//       },
//     }));
//   };

//   const handleUpdate = async (id) => {
//     const edits = editData[id] || {};
//     const employee = employees.find((emp) => emp.id === id);
//     if (!employee) return;

//     const payload = {
//       id: employee.id,
//       name: edits.name ?? employee.name,
//       role: edits.role ?? employee.role,
//     };

//     await updateEmployee(id, payload);

//     setEmployees((prev) =>
//       prev.map((emp) => (emp.id === id ? { ...emp, ...payload } : emp))
//     );

//     setEditData((prev) => ({ ...prev, [id]: {} }));
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this employee?")) {
//       await deleteEmployee(id);
//     }
//   };

//   return (
//     <div className="p-6 font-sans">
//         <div className="flex flex-col items-center md:items-center mb-8 gap-4">
//           <div className="justify-center ">
//             <div className="flex items-center gap-2 mb-1">
//               <ShieldCheck className="text-indigo-600 w-8 h-8" />
//               <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control</h1>
//             </div>
//             <p className="text-gray-500 font-medium text-sm">Manage staff members and roles</p>
//           </div>
//            </div>

//      <div className="flex flex-col md:flex-row  items-center mb-6 gap-4">
//   {/* Action Buttons */}
// <div className="flex gap-6 mt-6">





// </div>



// </div>




//       {loading ? (
//         <p className="text-center text-gray-500">Loading employees...</p>
//       ) : employees.length === 0 ? (
//         <p className="text-center text-gray-500">No employees found.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-indigo-600 text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
//                 <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
//                 <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {employees.map((emp, index) => {
//                 const empEdit = editData[emp.id] || {};

//                 return (
//                   <tr
//                     key={emp.id}
//                     className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                       } hover:bg-indigo-50 transition`}
//                   >
//                     {/* ID */}
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {emp.id}
//                     </td>

//                     {/* Name */}
//                     <td className="px-6 py-4">
//                       <input
//                         type="text"
//                         value={empEdit.name ?? emp.name}
//                         onChange={(e) =>
//                           handleChange(emp.id, "name", e.target.value)
//                         }
//                         className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400"
//                       />
//                     </td>

//                     {/* Email */}
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {emp.email}
//                     </td>

//                     {/* Role */}
//                     <td className="px-6 py-4">
//                       <select
//                         value={empEdit.role ?? emp.role}
//                         onChange={(e) =>
//                           handleChange(emp.id, "role", e.target.value)
//                         }
//                         className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400"
//                       >
//                         <option value="employee">Employee</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4 flex gap-2 justify-center">
//                       <button
//                         onClick={() => handleUpdate(emp.id)}
//                         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
//                       >
//                         Update
//                       </button>
//                       <button
//                         onClick={() => handleDelete(emp.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}



//     </div>
//   );
// };

// export default Admin;
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import {
//   ShieldCheck, Search, Trash2, Mail, Hash,
//   UserCog, Users, Save, UserPlus, Fingerprint
// } from "lucide-react";

// const Admin = () => {
//   const {
//     user, fetchEmployees, employees, updateEmployee,
//     setEmployees, deleteEmployee, searchEmployees
//   } = useContext(AuthContext);

//   const [loading, setLoading] = useState(true);
//   const [editData, setEditData] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     if (!user || user.role !== "admin") return;
//     const loadEmployees = async () => {
//       setLoading(true);
//       await fetchEmployees();
//       setLoading(false);
//     };
//     loadEmployees();
//   }, []);

//   const handleSearch = async (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     if (query.trim() === "") await fetchEmployees();
//     else await searchEmployees(query);
//   };

//   const handleChange = (id, field, value) => {
//     setEditData((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], [field]: value },
//     }));
//   };

//   const handleUpdate = async (id) => {
//     const edits = editData[id] || {};
//     const employee = employees.find((emp) => emp.id === id);
//     if (!employee) return;
//     const payload = { id: employee.id, name: edits.name ?? employee.name, role: edits.role ?? employee.role };
//     await updateEmployee(id, payload);
//     setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...payload } : emp)));
//     setEditData((prev) => ({ ...prev, [id]: {} }));
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Permanently delete this employee?")) await deleteEmployee(id);
//   };

//   return (
//     <div className="min-h-screen bg-[#f0f2f5] p-6 md:p-12 font-sans text-slate-800">
//       <div className="max-w-7xl mx-auto">

//         {/* --- Glassmorphic Header --- */}
        
//           <div className="flex flex-col items-center md:items-center mb-8 gap-4">
//             <div className="justify-center ">
//               <div className="flex items-center gap-2 mb-1">
               
//                 <h1 className="text-5xl font-black text-gray-900 tracking-tight">Admin Control</h1>
//               </div>
//               <p className="text-gray-500 font-medium p-2 text-sm">Manage staff members and roles</p>
//             </div>
//           </div>

        

//         {/* --- Search Bar & Action --- */}


//         {/* --- Main Table Card --- */}
//         <div className="  border border-white  ">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-separate border-spacing-y-1">
//               <thead className="bg-blue-500 rounded-lg ">
//                 <tr className="text-white uppercase text-xs font-black tracking-widest">
//                   <th className="px-10 py-4">Employee info</th>
//                   <th className="px-10 py-4">Account Details</th>
//                   <th className="px-10 py-4">Authority</th>
//                   <th className="px-10 py-4 text-center">Settings</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr><td colSpan="4" className="text-center py-20 font-black text-indigo-300 animate-pulse text-xl tracking-tighter">Synchronizing Database...</td></tr>
//                 ) : employees.map((emp) => {
//                   const empEdit = editData[emp.id] || {};
//                   const isEdited = empEdit.name || empEdit.role;

//                   return (
//                     <tr key={emp.id} className=" bg-slate-50 ">
//                       {/* Name Card */}
//                       <td className="bg-slate-50  px-3 py-3  border-y border-l border-transparent group-hover:border-indigo-100 ">
//                         <div className="flex items-center gap-5">
//                           <div className="w-10 h-10 rounded-[1.8rem] bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white  font-black shadow-xl shadow-indigo-200 ">
//                             {emp.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <input
//                               type="text"
//                               value={empEdit.name ?? emp.name}
//                               onChange={(e) => handleChange(emp.id, "name", e.target.value)}
//                               className="bg-transparent border-none p-0 focus:ring-0 font-black text-slate-800 text-lg block w-full"
//                             />
//                             <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1 uppercase tracking-widest">
//                               <Fingerprint size={12} /> ID :{emp.id}
//                             </span>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Contact Info */}
//                       <td className="bg-slate-50  px-3 py-3 border-y border-transparent group-hover:border-indigo-100 ">
//                         <div className="flex flex-col">
//                           <div className="flex items-center gap-2 text-slate-600 font-bold">
//                             <Mail size={16} className="text-indigo-400" />
//                             {emp.email}
//                           </div>
                      
//                         </div>
//                       </td>

//                       {/* Role Logic */}
//                       <td className="bg-slate-50 group-hover:bg-indigo-50/50 px-3 py-3 border-y border-transparent group-hover:border-indigo-100 ">
//                         <select
//                           value={empEdit.role ?? emp.role}
//                           onChange={(e) => handleChange(emp.id, "role", e.target.value)}
//                           className={`text-[11px] font-black px-6 py-3 rounded-2xl border-none ring-2 ring-transparent outline-none transition-all uppercase cursor-pointer shadow-sm ${(empEdit.role ?? emp.role) === 'admin'
//                               ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200'
//                               : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200'
//                             }`}
//                         >
//                           <option value="employee">Employee</option>
//                           <option value="admin">Admin</option>
//                         </select>
//                       </td>

//                       {/* Control Panel */}
//                       <td className="bg-slate-50 group-hover:bg-indigo-50/50 px-8 py-6 rounded-r-[2.5rem] border-y border-r border-transparent group-hover:border-indigo-100 transition-all">
//                         <div className="flex gap-3 justify-center">
                          
//                             <button
//                               onClick={() => handleUpdate(emp.id)}
//                               className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-300 hover:shadow-indigo-400 hover:-translate-y-1 transition-all"
//                             >
//                               <Save size={20} />
//                             </button>
                      
//                           <button
//                             onClick={() => handleDelete(emp.id)}
//                             className="p-4 text-white bg-rose-500 border border-rose-100 rounded-2xl shadow-sm hover:text-rose-500 hover:bg-white hover:-translate-y-1 transition-all"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Admin;
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import {
  ShieldCheck, Search, Trash2, Mail, Hash,
  UserCog, Users, Save, UserPlus, Fingerprint
} from "lucide-react";

const Admin = () => {
  const {
    user, fetchEmployees, employees, updateEmployee,
    setEmployees, deleteEmployee, searchEmployees
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const loadEmployees = async () => {
      setLoading(true);
      await fetchEmployees();
      setLoading(false);
    };
    loadEmployees();
  }, []);

  // Filter logic for Name, ID, and Email
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.id.toString().toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdate = async (id) => {
    const edits = editData[id] || {};
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) return;
    const payload = { id: employee.id, name: edits.name ?? employee.name, role: edits.role ?? employee.role };
    await updateEmployee(id, payload);
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...payload } : emp)));
    setEditData((prev) => ({ ...prev, [id]: {} }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this employee?")) await deleteEmployee(id);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">

        {/* --- Glassmorphic Header --- */}
        <div className="flex flex-col items-center md:items-center mb-8 gap-4">
          <div className="justify-center text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">Admin Control</h1>
            </div>
            <p className="text-gray-500 font-medium p-2 text-sm">Manage staff members and roles</p>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm outline-none transition-all"
          />
        </div>

        {/* --- Main Table Card --- */}
        <div className="border border-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-1">
              <thead className="bg-blue-500 rounded-lg">
                <tr className="text-white uppercase text-xs font-black tracking-widest">
                  <th className="px-10 py-4">Employee info</th>
                  <th className="px-10 py-4">Account Details</th>
                  <th className="px-10 py-4">Authority</th>
                  <th className="px-10 py-4 text-center">Settings</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-20 font-black text-indigo-300 animate-pulse text-xl tracking-tighter">Synchronizing Database...</td></tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => {
                    const empEdit = editData[emp.id] || {};

                    return (
                      <tr key={emp.id} className=" bg-slate-50 ">
                        {/* Name Card */}
                        <td className="bg-slate-50 px-3 py-3 border-y border-l border-transparent group-hover:border-indigo-100 ">
                          <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-[1.8rem] bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-black shadow-xl shadow-indigo-200">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <input
                                type="text"
                                value={empEdit.name ?? emp.name}
                                onChange={(e) => handleChange(emp.id, "name", e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 font-black text-slate-800 text-lg block w-full"
                              />
                              <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1 uppercase tracking-widest">
                                <Fingerprint size={12} /> ID :{emp.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="bg-slate-50 px-3 py-3 border-y border-transparent group-hover:border-indigo-100 ">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                              <Mail size={16} className="text-indigo-400" />
                              {emp.email}
                            </div>
                          </div>
                        </td>

                        {/* Role Logic */}
                        <td className="bg-slate-50 group-hover:bg-indigo-50/50 px-3 py-3 border-y border-transparent group-hover:border-indigo-100 ">
                          <select
                            value={empEdit.role ?? emp.role}
                            onChange={(e) => handleChange(emp.id, "role", e.target.value)}
                            className={`text-[11px] font-black px-6 py-3 rounded-2xl border-none ring-2 ring-transparent outline-none transition-all uppercase cursor-pointer shadow-sm ${(empEdit.role ?? emp.role) === 'admin'
                                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200'
                              }`}
                          >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* Control Panel */}
                        <td className="bg-slate-50 group-hover:bg-indigo-50/50 px-8 py-6 rounded-r-[2.5rem] border-y border-r border-transparent group-hover:border-indigo-100 transition-all">
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={() => handleUpdate(emp.id)}
                              className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-300 hover:shadow-indigo-400 hover:-translate-y-1 transition-all"
                            >
                              <Save size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="p-4 text-white bg-rose-500 border border-rose-100 rounded-2xl shadow-sm hover:text-rose-500 hover:bg-white hover:-translate-y-1 transition-all"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400 font-medium">No results found for "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
