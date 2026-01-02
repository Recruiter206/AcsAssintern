
// import React, { useContext ,useState} from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../auth/AuthContext";

// const Navbar = () => {
//   const { user, logout, loading } = useContext(AuthContext);
//     const [menuOpen, setMenuOpen] = useState(false); 
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   if (loading) return null;

//   return (
//     <nav className="bg-black text-white px-8 py-4 flex justify-between items-center font-sans">
//       <h1
//         className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition"
//         onClick={() =>
//           navigate(user ? (user.role === "admin" ? "/admin" : "/employee") : "/")
//         }
//       >
//         Company Portal
//       </h1>

//       {user ? (
//         <div className="flex items-center gap-4">
//           <span className="font-medium">Welcome, {user.name}!</span>
//           <button
//             onClick={handleLogout}
//             className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition-all font-medium"
//           >
//             Logout
//           </button>
//            {/* Toggle Button */}
//           <button
//             onClick={() => setMenuOpen(prev => !prev)}
//             className="bg-white text-black px-3 py-2 rounded hover:bg-gray-100 transition-all font-medium"
//           >
//             Menu
//           </button>

//           {/* Dropdown Menu */}
//           {menuOpen && (
//             <div className="absolute right-0  bg-white mr-3 mt-12 w-48 text-black shadow-lg rounded-lg flex flex-col gap-2 p-2 z-50">
//               {user.role === "admin" ? (
//                <div className="mt-25  "> 
//                   <Link to={'/assign'} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Assign Task</Link>
//                   <Link to={'/tasklist'}className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">View All Tasks</Link>
//                   <Link to={'/update'}className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Check Attendance</Link>
//                 </div>
//               ) : (
//                 <>
//                   <Link to={'/employeetask'} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">My Task</Link>
//                   <Link to={'/mark'} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Attendance</Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//       ) : (
//         <div className="flex items-center gap-4">
//           <Link
//             to="/login"
//             className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-100 transition-all"
//           >
//             Login
//           </Link>

//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
// import React, { useContext, useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../auth/AuthContext";
// import { IoReorderThreeSharp } from "react-icons/io5";
// const Navbar = () => {
//   const { user, logout, loading } = useContext(AuthContext);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const menuRef = useRef();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (loading) return null;

//   return (
//     <nav className="bg-black text-white px-8 py-4 flex justify-between items-center font-sans relative shadow-md">
//       {/* Logo */}
//       <h1
//         className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition"
//         onClick={() =>
//           navigate(user ? (user.role === "admin" ? "/admin" : "/employee") : "/")
//         }
//       >
//         Company Portal
//       </h1>

//       {user ? (
//         <div className="flex items-center gap-4 relative">
//           <span className="font-medium">Welcome, {user.name}!</span>
//           <button
//             onClick={handleLogout}
//             className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition-all font-medium"
//           >
//             Logout
//           </button>

//           <IoReorderThreeSharp
//             size={44} // icon size
//             onClick={() => setMenuOpen(prev => !prev)}
//             className="text-white cursor-pointer hover:text-gray-100 transition-all"
//           />




//           {/* Dropdown Menu */}
//           {menuOpen && (
//             <div
//               ref={menuRef}
//               className="absolute right-0 mt-42 mr-13 w-48 bg-white text-black shadow-lg rounded-lg flex flex-col gap-2 p-2 z-50"
//             >
//               {user.role === "admin" ? (
//                 <>
//                  <Link
//                     to="/admin"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >Dashboard</Link>
//                   <Link
//                     to="/assign"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Assign Task
//                   </Link>
//                   <Link
//                     to="/tasklist"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     View All Tasks
//                   </Link>
//                   <Link
//                     to="/update"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Check Attendance
//                   </Link>
//                    <Link
//                     to="//employeechat"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     chat box
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/employeetask"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     My Task
//                   </Link>
//                   <Link
//                     to="/mark"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Attendance
//                   </Link>
//                    <Link
//                     to="/adminchat"
//                     className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     chatbox
//                   </Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="flex items-center gap-4">
//           <Link
//             to="/login"
//             className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-100 transition-all"
//           >
//             Login
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { IoReorderThreeSharp } from "react-icons/io5";

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center font-sans shadow-md relative">
      {/* Logo */}
      <h1
        className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition"
        onClick={() =>
          navigate(user ? (user.role === "admin" ? "/admin" : "/employee") : "/")
        }
      >
        Company Portal
      </h1>

      {user ? (
        <div className="flex items-center gap-4 relative">
          <span className="font-medium">Welcome, {user.name}!</span>
          <button
            onClick={handleLogout}
            className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition font-medium"
          >
            Logout
          </button>

          <IoReorderThreeSharp
            size={32}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-white cursor-pointer hover:text-gray-100 transition"
          />

          {/* Dropdown Menu */}
        {/* Dropdown Menu */}
{menuOpen && (
  <div
    ref={menuRef}
    className="absolute top-full -mt-10 right-0  w-48 bg-white text-black shadow-lg rounded-lg flex flex-col gap-1 p-2 z-50"
  >
    {user.role === "admin" ? (
      <>
        <Link
          to="/admin"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/assign"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          Assign Task
        </Link>
        <Link
          to="/tasklist"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          View All Tasks
        </Link>
        <Link
          to="/update"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          Check Attendance
        </Link>
        <Link
          to="/adminchat"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          Chat Box
        </Link>
      </>
    ) : (
      <>
        <Link
          to="/employeetask"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          My Task
        </Link>
        <Link
          to="/mark"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          Attendance
        </Link>
        <Link
          to="/employeechat"
          className="hover:bg-gray-200 px-3 py-1 rounded transition"
          onClick={() => setMenuOpen(false)}
        >
          Chat Box
        </Link>
      </>
    )}
  </div>
)}

        </div>
      ) : (
        <div>
          <Link
            to="/login"
            className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
