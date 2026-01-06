
// import React, { useContext, useEffect } from "react";
// import { AuthContext } from "../../auth/AuthContext";
// import { Link } from "react-router-dom";

// const Employee = () => {
//   const { user, fetchOwnData, ownData, setOwnData, loading, setLoading } =
//     useContext(AuthContext);

//   useEffect(() => {
//     const loadData = async () => {
//       const data = await fetchOwnData();
//       setOwnData(data);
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   if (loading)
//     return (
//       <p className="text-center text-gray-500 mt-10 font-sans">Loading...</p>
//     );

//   if (!ownData)
//     return (
//       <p className="text-center text-red-500 mt-10 font-sans">
//         Failed to load employee data
//       </p>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">

//       {/* Attendance Action */}

//       {/* Profile Card */}
//       <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center transition-transform hover:scale-105 duration-300">
//         <div className="relative w-32 h-32 mx-auto mb-6">
//           <img
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwTfu610P6eUMiQTsmAB_M2k9sg06HWkIkA&s"
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md"
//           />
//         </div>

//         <h2 className="text-2xl font-bold text-gray-800 mb-6">{user.role}</h2>

//         <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-left px-4">
//           <span className="font-medium text-gray-900">ID:</span>
//           <p className="text-gray-600">{ownData.id}</p>

//           <span className="font-medium text-gray-900">Name:</span>
//           <p className="text-gray-700">{ownData.name}</p>

//           <span className="font-medium text-gray-900">Email:</span>
//           <p className="text-gray-700 break-all">{ownData.email}</p>

//           <span className="font-medium text-gray-900">Role:</span>
//           <p className="text-gray-700">{ownData.role}</p>
//         </div>

//         {/* View Tasks Button */}
//         <div className="mt-8 gap-2">
//           <Link
//             to="/employeetask"
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 inline-block"
//           >
//             View My Tasks
//           </Link>
//            <Link
//             to="/mark"
//             className="bg-green-500 mx-2 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 inline-block"
//           >
//             Attendance
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Employee;
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { User, Mail, BadgeCheck, Fingerprint, Briefcase } from "lucide-react"; // Optional: npm i lucide-react

const Employee = () => {
  const { user, fetchOwnData, ownData, setOwnData, loading, setLoading } =
    useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const data = await fetchOwnData();
      if (isMounted) {
        setOwnData(data);
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [fetchOwnData, setOwnData, setLoading]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!ownData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load employee data</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center px-4 py-12">

      {/* Decorative Header Background */}
      <div className="absolute top-0 w-full h-64 bg-indigo-600 clip-path-slant -z-10 shadow-lg"></div>

      <div className="relative w-full max-w-md">
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white">

          {/* Top Banner Color */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-900"></div>

          <div className="px-8 pb-10">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-4 flex justify-center">
              <div className="p-1 bg-white rounded-full shadow-xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwTfu610P6eUMiQTsmAB_M2k9sg06HWkIkA&s"
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-white"
                />
              </div>
              <div className="absolute bottom-2 right-1/3 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>

            {/* Name & Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {ownData.name}
              </h1>
              
            </div>

            {/* Info Grid */}
            <div className="space-y-2">
              
         <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-left px-4">
         <span className="font-medium text-gray-900">ID:</span>
          <p className="text-gray-600">{ownData.id}</p>

          <span className="font-medium text-gray-900">Name:</span>
         <p className="text-gray-700">{ownData.name}</p>

         <span className="font-medium text-gray-900">Email:</span>
       <p className="text-gray-700 break-all">{ownData.email}</p>

        <span className="font-medium text-gray-900">Role:</span>         <p className="text-gray-700">{ownData.role}</p>
        </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <Link
                to="/employeetask"
                className="flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                <span className="font-bold">My Tasks</span>
              </Link>

              <Link
                to="/mark"
                className="flex flex-col items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
              >
                <span className="font-bold">Attendance</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
