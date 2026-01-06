


// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import { AttendanceContext } from "../../attanceContext/AttadanceContext";

// const EmployeeAttendance = () => {
//   const { user } = useContext(AuthContext);
//   const { attendance, loading, error, message, fetchAttendance, markAttendance } =
//     useContext(AttendanceContext);


//   const [searchItem, setSearchIem] = useState("");
//   const [filterdate, setFilterdate] = useState("")
//   const [firstStatus, setFiterstatus] = useState("all")
//   useEffect(() => {
//     if (user) fetchAttendance();
//   }, [user]);
//   console.log("serch", searchItem)
//   console.log("serch", filterdate)
//   console.log("serch", firstStatus)
//   const handleMarkAttendance = () => {
//     if (user) markAttendance(user.id);
//   };


// // filter logic
// const filterAttance=attendance.filter((item)=>{

//   const matchesSearch = 
//       item.attendance_id?.toString().includes(searchItem) || 
//       item.employee_name?.toLowerCase().includes(searchItem.toLowerCase());

//   // for date 
//   const matchesDate=filterdate?item.date===filterdate:true
// // 3. Filter by Status
//     const matchesStatus = firstStatus === "all" || item.status === firstStatus;

//     return matchesSearch && matchesDate && matchesStatus;
// })


//   const today = new Date().toISOString().split("T")[0];
//   const alreadyMarked = attendance.some((a) => a.date === today);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6">My Attendance</h1>

//       {/* Mark Attendance */}
//       <div className="flex justify-center mb-6">
//         <button
//           onClick={handleMarkAttendance}
//           disabled={alreadyMarked}
//           className={`px-6 py-2 rounded-lg text-white transition ${alreadyMarked
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//             }`}
//         >
//           {alreadyMarked ? "Attendance Already Marked" : "Mark Attendance (Now)"}
//         </button>
//       </div>
//       {/* filteration  */}
//       <div className="flex flex-wrap items-center  gap-5 p-4 bg-white border-b">
//         {/* Search Input */}
//         <div className="w-48 mx-8 my-8">
//           <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
//           <input
//             type="text"
//             id="search"
//             value={searchItem}
//             onChange={(e) => setSearchIem(e.target.value)}
//             placeholder="Name or ID..."
//             className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Date Picker */}
//         <div className="w-48 mx-8 my-8">
//           <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
//           <input
//             type="date"
//             id="date"
//             value={filterdate}
//             onChange={(e) => setFilterdate(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Status Select */}
//         <div className="w-48 mx-8 my-8">
//           <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//           <select
//             id="status"
//             value={firstStatus}
//             onChange={(e) => setFiterstatus(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>
//       </div>

//       {/* Message */}
//       {message && <p className="text-center mb-4 text-green-600">{message}</p>}

//       {/* Attendance Table */}
//       {attendance.length === 0 ? (
//         <p className="text-center text-gray-500">No attendance records found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-2 text-left font-semibold">Date</th>
//                 <th className="px-4 py-2 text-left font-semibold">mark at</th>

//                 <th className="px-4 py-2 text-left font-semibold">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {attendance.map((att) => (
//                 <tr key={att.attendance_id} className="hover:bg-gray-50 transition">
//                   <td className="px-4 py-2">{att.date}</td>
//                   <td className="px-4 py-2">{att.check_in}</td>

//                   <td
//                     className={`px-4 py-2 font-medium ${att.status === "approved"
//                       ? "text-green-700"
//                       : att.status === "rejected"
//                         ? "text-red-600"
//                         : "text-yellow-600"
//                       }`}
//                   >
//                     {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendance;
// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import { AttendanceContext } from "../../attanceContext/AttadanceContext";

// const EmployeeAttendance = () => {
//   const { user } = useContext(AuthContext);
//   const { attendance = [], loading, error, message, fetchAttendance, markAttendance } =
//     useContext(AttendanceContext);

//   const [searchItem, setSearchIem] = useState("");
//   const [filterdate, setFilterdate] = useState("");
//   const [firstStatus, setFiterstatus] = useState("all");

//   useEffect(() => {
//     if (user) fetchAttendance();
//   }, [user]);

//   const handleMarkAttendance = () => {
//     if (user) markAttendance(user.id);
//   };

//   // 1. FILTER LOGIC
//   const filteredAttendance = attendance.filter((item) => {
//     const matchesSearch =
//       item.attendance_id?.toString().includes(searchItem) ||
//       item.employee_name?.toLowerCase().includes(searchItem.toLowerCase());

//     const matchesDate = filterdate ? item.date === filterdate : true;
//     const matchesStatus = firstStatus === "all" || item.status === firstStatus;

//     return matchesSearch && matchesDate && matchesStatus;
//   });

//   const today = new Date().toISOString().split("T")[0];
//   const alreadyMarked = attendance.some((a) => a.date === today);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6">My Attendance</h1>

//       {/* Mark Attendance Button */}
//       <div className="flex justify-center mb-6">
//         <button
//           onClick={handleMarkAttendance}
//           disabled={alreadyMarked}
//           className={`px-6 py-2 rounded-lg text-white transition ${
//             alreadyMarked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {alreadyMarked ? "Attendance Already Marked" : "Mark Attendance (Now)"}
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-5 p-4 bg-white border rounded-lg shadow-sm mb-6">
//         <div className="flex-1 min-w-[200px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
//           <input
//             type="text"
//             value={searchItem}
//             onChange={(e) => setSearchIem(e.target.value)}
//             placeholder="Name or ID..."
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         <div className="flex-1 min-w-[200px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
//           <input
//             type="date"
//             value={filterdate}
//             onChange={(e) => setFilterdate(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         <div className="flex-1 min-w-[200px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//           <select
//             value={firstStatus}
//             onChange={(e) => setFiterstatus(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//           >
//             <option value="all">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>
//       </div>

//       {message && <p className="text-center mb-4 text-green-600 font-medium">{message}</p>}

//       {/* Attendance Table */}
//       {filteredAttendance.length === 0 ? (
//         <p className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">No records match your filters.</p>
//       ) : (
//         <div className="overflow-x-auto shadow-lg rounded-xl">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Check In</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {/* 2. MAPPING OVER FILTERED ARRAY */}
//               {filteredAttendance.map((att) => (
//                 <tr key={att.attendance_id} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 whitespace-nowrap">{att.date}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{att.check_in || "N/A"}</td>
//                   <td className="px-6 py-4 whitespace-nowrap font-medium">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs ${
//                         att.status === "approved"
//                           ? "bg-green-100 text-green-700"
//                           : att.status === "rejected"
//                           ? "bg-red-100 text-red-600"
//                           : "bg-yellow-100 text-yellow-600"
//                       }`}
//                     >
//                       {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendance;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { AttendanceContext } from "../../attanceContext/AttadanceContext";

const EmployeeAttendance = () => {
  const { user } = useContext(AuthContext);
  const { attendance, loading, error, message, fetchAttendance, markAttendance } =
    useContext(AttendanceContext);

  const [searchItem, setSearchIem] = useState("");
  const [filterdate, setFilterdate] = useState("");
  const [firstStatus, setFiterstatus] = useState("all");

  useEffect(() => {
    if (user) fetchAttendance();
  }, [user]);

  const handleMarkAttendance = () => {
    if (user) markAttendance(user.id);
  };

  // Filter logic (Safety check added: attendance || [])
  const filterAttance = (attendance || []).filter((item) => {
    const matchesSearch =
      item.attendance_id?.toString().includes(searchItem) ||
      item.employee_name?.toLowerCase().includes(searchItem.toLowerCase());

    const matchesDate = filterdate ? item.date === filterdate : true;

    const matchesStatus = firstStatus === "all" || item.status === firstStatus;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const today = new Date().toISOString().split("T")[0];
  const alreadyMarked = attendance?.some((a) => a.date === today);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">My Attendance</h1>

      {/* Mark Attendance */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleMarkAttendance}
          disabled={alreadyMarked}
          className={`px-6 py-2 rounded-lg text-white transition ${
            alreadyMarked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {alreadyMarked ? "Attendance Already Marked" : "Mark Attendance (Now)"}
        </button>
      </div>

      {/* Filteration UI - Kept exactly as requested */}
     <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 p-6 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
  
  {/* Filter by Date Container */}
  <div className="relative group min-w-[240px]">
    <label 
      htmlFor="date" 
      className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-2 ml-1"
    >
      <svg xmlns="www.w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Filter by Date
    </label>
    <div className="relative">
      <input
        type="date"
        id="date"
        value={filterdate}
        onChange={(e) => setFilterdate(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:bg-white shadow-sm"
      />
    </div>
  </div>

  {/* Status Container */}
  <div className="relative group min-w-[240px]">
    <label 
      htmlFor="status" 
      className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-2 ml-1"
    >
      <svg xmlns="www.w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Status
    </label>
    <div className="relative">
      <select
        id="status"
        value={firstStatus}
        onChange={(e) => setFiterstatus(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:bg-white shadow-sm"
      >
        <option value="all">All Statuses</option>
        <option value="pending"> Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected"> Rejected</option>
      </select>
      {/* Custom Chevron for the Select */}
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>

  {/* Optional Clear Button (Great for UX) */}
  {filterdate && (
    <button 
      onClick={() => setFilterdate('')}
      className="mt-6 text-sm text-gray-400 hover:text-red-500 transition-colors font-medium underline-offset-4 hover:underline"
    >
      Reset Filters
    </button>
  )}
</div>


      {message && <p className="text-center mb-4 text-green-600">{message}</p>}

      {/* Updated Table Source to filterAttance */}
      {filterAttance.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Mark At</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filterAttance.map((att) => (
                <tr key={att.attendance_id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{att.date}</td>
                  <td className="px-4 py-2">{att.check_in}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      att.status === "approved"
                        ? "text-green-700"
                        : att.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
