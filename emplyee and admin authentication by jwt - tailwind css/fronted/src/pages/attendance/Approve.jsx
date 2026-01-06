
// import React, { useContext, useEffect, useState } from 'react';
// import { AttendanceContext } from '../../attanceContext/AttadanceContext';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { 
//   CheckCircle, 
//   XCircle, 
//   Calendar as CalendarIcon, 
//   UserCheck, 
//   Clock, 
//   Fingerprint,
//   ShieldCheck
// } from 'lucide-react';

// const Approve = () => {
//   const { attendance, loading, error, fetchAttendances, updateAttendanceStatuses } = useContext(AttendanceContext);
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

//   useEffect(() => {
//     fetchAttendances(date);
//   }, [date]);

//   const handleStatusChange = async (attendance_id, status) => {
//     try {
//       await updateAttendanceStatuses(attendance_id, status);
//       toast.success(`Attendance ${status.toUpperCase()} successfully!`);
//     } catch (err) {
//       toast.error('Failed to update status.');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const s = status?.toLowerCase();
//     if (s === 'approved') return (
//       <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-100">
//         <CheckCircle size={12} /> {status}
//       </span>
//     );
//     if (s === 'rejected') return (
//       <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-rose-100">
//         <XCircle size={12} /> {status}
//       </span>
//     );
//     return (
//       <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-amber-100">
//         <Clock size={12} className="animate-pulse" /> {status}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-800">
//       <div className="max-w-6xl mx-auto">
        
        
     
//         {/* --- Date Filter Bar --- */}
//         <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
//           <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 group focus-within:ring-2 focus-within:ring-sky-500 transition-all">
//             <CalendarIcon className="text-sky-600" size={20} />
//             <div className="flex flex-col">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Log Date</span>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={e => setDate(e.target.value)}
//                 className="bg-transparent border-none p-0 focus:ring-0 font-bold text-slate-700 outline-none cursor-pointer"
//               />
//             </div>
//           </div>
//           <div className="hidden md:flex gap-2 bg-sky-50 px-4 py-2 rounded-xl text-sky-700 font-bold text-sm items-center">
//             <UserCheck size={18} />
//             {attendance.length} Records Found
//           </div>
//         </div>

//         {/* --- Table Section --- */}
//         <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
//           {loading ? (
//             <div className="py-24 text-center">
//               <div className="inline-block w-8 h-8 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin mb-4"></div>
//               <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Accessing Logs...</p>
//             </div>
//           ) : attendance.length === 0 ? (
//             <div className="py-24 text-center">
//                <Clock className="mx-auto text-slate-200 mb-4" size={48} />
//                <p className="text-slate-500 font-black text-xl">No attendance records for this period.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-sky-900 to-sky-800">
//                     <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em]">Employee Profile</th>
//                     <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em]">Check-In Time</th>
//                     <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em]">Current Status</th>
//                     <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em] text-center">Decision Panel</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {attendance.map(att => (
//                     <tr key={att.attendance_id} className="hover:bg-slate-50 transition-colors group">
//                       {/* Employee Details */}
//                       <td className="px-8 py-6">
//                         <div className="flex items-center gap-4">
//                           <div className="w-11 h-11 rounded-2xl bg-blue-300 flex items-center justify-center text-sky-800 font-black text-lg shadow-inner border border-white">
//                             {att.employee_name?.charAt(0).toUpperCase() || 'U'}
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="font-black text-slate-800 text-base">{att.employee_name}</span>
//                             <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
//                               <Fingerprint size={12} className="text-sky-300" /> ID: {att.employee_id}
//                             </span>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Time */}
//                       <td className="px-8 py-3">
//                         <div className="flex items-center gap-2 text-slate-600 font-bold">
//                           <Clock size={16} className="text-sky-400" />
//                           {att.check_in || '--:--'}
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-8 py-3">
//                         {getStatusBadge(att.status)}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-8 py-3">
//                         <div className="flex gap-3 justify-center">
//                           {att.status === 'pending' ? (
//                             <>
//                               <button
//                                 className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
//                                 onClick={() => handleStatusChange(att.attendance_id, 'approved')}
//                               >
//                                 <CheckCircle size={14} /> Approve
//                               </button>
//                               <button
//                                 className="text-white bg-rose-600 border border-rose-100 px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-rose-600 hover:text-white transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
//                                 onClick={() => handleStatusChange(att.attendance_id, 'rejected')}
//                               >
//                                 <XCircle size={14} /> Reject
//                               </button>
//                             </>
//                           ) : (
//                             <span className="text-slate-300 text-[10px] font-black uppercase italic tracking-widest">Decision Finalized</span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//       <ToastContainer position="bottom-right" autoClose={3000} />
//     </div>
//   );
// };

// export default Approve;
import React, { useContext, useEffect, useState } from 'react';
import { AttendanceContext } from '../../attanceContext/AttadanceContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  CheckCircle, 
  XCircle, 
  Calendar as CalendarIcon, 
  UserCheck, 
  Clock, 
  Fingerprint,
  Search,
  Filter
} from 'lucide-react';

const Approve = () => {
  const { attendance, loading, error, fetchAttendances, updateAttendanceStatuses } = useContext(AttendanceContext);
  
  // States for filters
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState(''); // For Name or ID
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAttendances(date);
  }, [date]);

  // --- Filtration Logic ---
  const filteredAttendance = attendance.filter(item => {
    const matchesSearch = 
      item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee_id?.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (attendance_id, status) => {
    try {
      await updateAttendanceStatuses(attendance_id, status);
      toast.success(`Attendance ${status.toUpperCase()} successfully!`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'approved') return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-100">
        <CheckCircle size={12} /> {status}
      </span>
    );
    if (s === 'rejected') return (
      <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-rose-100">
        <XCircle size={12} /> {status}
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-amber-100">
        <Clock size={12} className="animate-pulse" /> {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <ToastContainer />
        
        {/* --- Multi-Filter Bar --- */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-4 items-center justify-between">
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Date Filter */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500 transition-all">
              <CalendarIcon className="text-sky-600" size={18} />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Log Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 font-bold text-slate-700 text-sm outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Search Name/ID */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500 transition-all w-64">
              <Search className="text-sky-600" size={18} />
              <div className="flex flex-col w-full">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Search Employee</span>
                <input
                  type="text"
                  placeholder="Name or ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 font-bold text-slate-700 text-sm outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500 transition-all">
              <Filter className="text-sky-600" size={18} />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 font-bold text-slate-700 text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 bg-sky-50 px-4 py-2 rounded-xl text-sky-700 font-bold text-sm items-center">
            <UserCheck size={18} />
            {filteredAttendance.length} Records Found
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin mb-4"></div>
              <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Accessing Logs...</p>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="py-24 text-center">
               <Clock className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-500 font-black text-xl">No matching records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-sky-900 to-sky-800">
                    <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em]">Employee Profile</th>
                    <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em]">Check-In Time</th>
                    <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em]">Current Status</th>
                    <th className="px-8 py-5 text-white text-[11px] font-black uppercase tracking-[0.2em] text-center">Decision Panel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAttendance.map(att => (
                    <tr key={att.attendance_id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-blue-300 flex items-center justify-center text-sky-800 font-black text-lg shadow-inner border border-white">
                            {att.employee_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-800 text-base">{att.employee_name}</span>
                            <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                              <Fingerprint size={12} className="text-sky-300" /> ID: {att.employee_id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-3">
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                          <Clock size={16} className="text-sky-400" />
                          {att.check_in || '--:--'}
                        </div>
                      </td>
                      <td className="px-8 py-3">{getStatusBadge(att.status)}</td>
                      <td className="px-8 py-3">
                        <div className="flex gap-3 justify-center">
                          {att.status === 'pending' ? (
                            <>
                              <button
                                className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                                onClick={() => handleStatusChange(att.attendance_id, 'approved')}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                className="text-white bg-rose-600 border border-rose-100 px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-rose-600 hover:text-white transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                                onClick={() => handleStatusChange(att.attendance_id, 'rejected')}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-300 text-[10px] font-black uppercase italic tracking-widest">Decision Finalized</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approve;
