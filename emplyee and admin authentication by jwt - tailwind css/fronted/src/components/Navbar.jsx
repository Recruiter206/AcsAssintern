

// // import React, { useContext, useState, useEffect, useRef } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { AuthContext } from "../auth/AuthContext";
// // import { IoReorderThreeSharp } from "react-icons/io5";

// // const Navbar = () => {
// //   const { user, logout, loading } = useContext(AuthContext);
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const navigate = useNavigate();
// //   const menuRef = useRef();

// //   const handleLogout = () => {
// //     logout();
// //     navigate("/");
// //   };

// //   // Close dropdown if clicked outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (menuRef.current && !menuRef.current.contains(event.target)) {
// //         setMenuOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   if (loading) return null;

// //   return (
// //     <nav className="bg-black text-white px-6 py-4 flex justify-between items-center font-sans shadow-md relative">
// //       {/* Logo */}


// //       <h1
// //         className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition"
// //         onClick={() =>
// //           navigate(user ? (user.role === "admin" ? "/admin" : "/employee") : "/")
// //         }
// //       >
// //         Company Portal
// //       </h1>

// //       {user ? (
// //         <div className="flex items-center gap-4 relative">
// //           <span className="font-medium">Welcome, {user.name}!</span>
// //           <button
// //             onClick={handleLogout}
// //             className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition font-medium"
// //           >
// //             Logout
// //           </button>

// //           <IoReorderThreeSharp
// //             size={52}
// //             onClick={() => setMenuOpen((prev) => !prev)}
// //             className="text-white cursor-pointer hover:text-gray-100 transition"
// //           />

// //           {/* Dropdown Menu */}
// //         {/* Dropdown Menu */}
// // {menuOpen && (
// //   <div
// //     ref={menuRef}
// //     className="absolute top-full -mt-10 right-0  w-48 bg-white text-black shadow-lg rounded-lg flex flex-col gap-1 p-2 z-50"
// //   >
// //     {user.role === "admin" ? (
// //       <>
// //         <Link
// //           to="/admin"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           Dashboard
// //         </Link>
// //         <Link
// //           to="/assign"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           Assign Task
// //         </Link>
// //         <Link
// //           to="/tasklist"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           View All Tasks
// //         </Link>
// //         <Link
// //           to="/update"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           Check Attendance
// //         </Link>
// //         <Link
// //           to="/adminchat"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           Chat Box
// //         </Link>
// //       </>
// //     ) : (
// //       <>
// //         <Link
// //           to="/employeetask"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           My Task
// //         </Link>
// //         <Link
// //           to="/mark"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           Attendance
// //         </Link>
// //         <Link
// //           to="/employeechat"
// //           className="hover:bg-gray-200 px-3 py-1 rounded transition"
// //           onClick={() => setMenuOpen(false)}
// //         >
// //           Chat Box
// //         </Link>
// //       </>
// //     )}
// //   </div>
// // )}

// //         </div>
// //       ) : (
// //         <div>
// //           <Link
// //             to="/login"
// //             className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-100 transition"
// //           >
// //             Login
// //           </Link>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // };

// // export default Navbar;
// import React, { useContext, useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../auth/AuthContext";
// import { IoCloseOutline, IoLogOutOutline, IoPersonCircleOutline, IoMenuOutline } from "react-icons/io5";
// import { MdOutlineDashboard, MdAddTask, MdFormatListBulleted, MdOutlineChat, MdFingerprint } from "react-icons/md";

// const Navbar = () => {
//   const { user, logout, loading } = useContext(AuthContext);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const sidebarRef = useRef();

//   const handleLogout = () => {
//     logout();
//     setSidebarOpen(false);
//     navigate("/");
//   };

//   // Sidebar ke bahar click karne par band ho jaye
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setSidebarOpen(false);
//       }
//     };
//     if (sidebarOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [sidebarOpen]);

//   if (loading) return null;

//   const isActive = (path) => 
//     location.pathname === path 
//     ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
//     : "text-gray-700 hover:bg-gray-100";

//   return (
//     <>
//       {/* --- Main Top Navbar --- */}
//       <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
//         <h1
//           className="text-2xl font-black tracking-tighter cursor-pointer hover:text-blue-400 transition-all uppercase italic"
//           onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/employee") : "/")}
//         >
//           Company<span className="text-blue-500">Portal</span>
//         </h1>

//         {user ? (
//           <div className="flex items-center gap-4">
//             <div className="hidden sm:block text-right">
//               <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Logged in</p>
//               <p className="text-sm font-semibold text-blue-400">{user.name}</p>
//             </div>

//             {/* Sidebar Toggle Button */}
//             <button 
//               onClick={() => setSidebarOpen(true)}
//               className="p-1 hover:bg-white/10 rounded-full transition-colors"
//             >
//               <IoMenuOutline size={40} className="text-white" />
//             </button>
//           </div>
//         ) : (
//           <Link to="/login" className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
//             Login
//           </Link>
//         )}
//       </nav>

//       {/* --- Right Side Sidebar (Drawer) --- */}
//       {/* Overlay Background */}
//       <div 
//         className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
//       />

//       <aside
//         ref={sidebarRef}
//         className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* Sidebar Header */}
//         <div className="p-6 border-b flex justify-between items-center bg-gray-50">
//           <div className="flex items-center gap-2">
//             <IoPersonCircleOutline size={35} className="text-blue-600" />
//             <div>
//               <p className="font-bold text-gray-900 leading-none">{user?.name}</p>
//               <p className="text-[10px] text-gray-500 uppercase mt-1 font-bold tracking-wider">{user?.role}</p>
//             </div>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-black">
//             <IoCloseOutline size={30} />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <div className="p-4 flex flex-col gap-2 h-[calc(100%-180px)] overflow-y-auto">
//           {user?.role === "admin" ? (
//             <>
//               <SidebarLink to="/admin" icon={<MdOutlineDashboard />} text="Admin Dashboard" activeClass={isActive("/admin")} onClick={() => setSidebarOpen(false)} />
//               <SidebarLink to="/assign" icon={<MdAddTask />} text="Assign New Task" activeClass={isActive("/assign")} onClick={() => setSidebarOpen(false)} />
//               <SidebarLink to="/tasklist" icon={<MdFormatListBulleted />} text="Task Overview" activeClass={isActive("/tasklist")} onClick={() => setSidebarOpen(false)} />
//               <SidebarLink to="/update" icon={<MdFingerprint />} text="Employee Attendance" activeClass={isActive("/update")} onClick={() => setSidebarOpen(false)} />
//               <SidebarLink to="/adminchat" icon={<MdOutlineChat />} text="Admin Chatbox" activeClass={isActive("/adminchat")} onClick={() => setSidebarOpen(false)} />
//             </>
//           ) : (
//             <>
//               <SidebarLink to="/employeetask" icon={<MdFormatListBulleted />} text="My Tasks" activeClass={isActive("/employeetask")} onClick={() => setSidebarOpen(false)} />
//               <SidebarLink to="/mark" icon={<MdFingerprint />} text="Mark Attendance" activeClass={isActive("/mark")} onClick={() => setSidebarOpen(false)} />
//               <SidebarLink to="/employeechat" icon={<MdOutlineChat />} text="Employee Chat" activeClass={isActive("/employeechat")} onClick={() => setSidebarOpen(false)} />
//             </>
//           )}
//         </div>

//         {/* Sidebar Footer */}
//         <div className="absolute bottom-0 left-0 w-full p-6 border-t bg-gray-50">
//           <button
//             onClick={handleLogout}
//             className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200"
//           >
//             <IoLogOutOutline size={22} />
//             Logout Account
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// // Sidebar Link Component
// const SidebarLink = ({ to, icon, text, onClick, activeClass }) => (
//   <Link
//     to={to}
//     className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${activeClass}`}
//     onClick={onClick}
//   >
//     <span className="text-2xl">{icon}</span>
//     <span className="text-sm font-semibold">{text}</span>
//   </Link>
// );

// export default Navbar;
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { IoCloseOutline, IoLogOutOutline, IoPersonCircleOutline, IoMenuOutline } from "react-icons/io5";
import { MdOutlineDashboard, MdAddTask, MdFormatListBulleted, MdOutlineChat, MdFingerprint } from "react-icons/md";

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/");
  };

  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (loading) return null;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-sky-900 to-sky-800 text-white shadow-lg shadow-blue-500/30"
      : "text-gray-700 hover:bg-gray-100";

  return (
    <>
      {/* --- Main Top Navbar --- */}
      <nav className="bg-gradient-to-r from-sky-900 to-sky-800 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button (Now on the Left) */}
          {user && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <IoMenuOutline size={38} className="text-white" />
            </button>
          )}

          <h1
            className="text-2xl font-black tracking-tighter cursor-pointer hover:text-blue-400 transition-all uppercase italic"
            onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/employee") : "/")}
          >
            Company<span className="text-yellow-500">Portal</span>
          </h1>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end py-2 px-4 border-l border-white/10">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5">
                System Access
              </p>
              <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <p className="text-xs font-black uppercase tracking-wider text-sky-400">
                  {user.role}
                </p>
              </div>
            </div>

            <IoPersonCircleOutline size={45} className="text-white hidden sm:block" />
          </div>
        ) : (
          <Link to="/login" className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Login
          </Link>
        )}
      </nav>

      {/* --- Left Side Sidebar (Drawer) --- */}
      {/* Overlay Background */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b flex flex-col gap-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="bg-gradient-to-r from-sky-900 to-sky-800 p-2 rounded-lg text-white">
              <IoPersonCircleOutline size={45} className="text-white " />
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 mb-10 hover:text-black">
              <IoCloseOutline size={30} />
            </button>
          </div>

          <div className="mt-2 flex text-sm gap-2">
            <p className="font-bold text-xl text-gray-900 leading-tight">Welcome,</p>
            <p className="text-blue-600 font-bold text-lg">{user?.name}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex flex-col gap-2 h-[calc(100%-220px)] overflow-y-auto">
          {user?.role === "admin" ? (
            <>
              <SidebarLink to="/admin" icon={<MdOutlineDashboard />} text="Dashboard" activeClass={isActive("/admin")} onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/assign" icon={<MdAddTask />} text="Assign Task" activeClass={isActive("/assign")} onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/tasklist" icon={<MdFormatListBulleted />} text="All Tasks" activeClass={isActive("/tasklist")} onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/update" icon={<MdFingerprint />} text="Check Attendance" activeClass={isActive("/update")} onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/adminchat" icon={<MdOutlineChat />} text="Admin Chat" activeClass={isActive("/adminchat")} onClick={() => setSidebarOpen(false)} />
            </>
          ) : (
            <>
              <SidebarLink to="/employeetask" icon={<MdFormatListBulleted />} text="My Task List" activeClass={isActive("/employeetask")} onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/mark" icon={<MdFingerprint />} text="Mark Attendance" activeClass={isActive("/mark")} onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/employeechat" icon={<MdOutlineChat />} text="Chat Box" activeClass={isActive("/employeechat")} onClick={() => setSidebarOpen(false)} />
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full border-2 border-red-500 text-red-500 font-bold py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            <IoLogOutOutline size={22} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

// Sidebar Link Component
const SidebarLink = ({ to, icon, text, onClick, activeClass }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${activeClass}`}
    onClick={onClick}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-sm font-bold tracking-wide">{text}</span>
  </Link>
);

export default Navbar;
