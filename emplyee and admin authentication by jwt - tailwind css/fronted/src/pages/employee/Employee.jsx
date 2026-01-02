
// // import React, { useContext, useEffect } from "react";
// // import { AuthContext } from "../../auth/AuthContext";

// // const Employee = () => {
// //   const { user, fetchOwnData, ownData, setOwnData, loading, setLoading } =
// //     useContext(AuthContext);

// //   useEffect(() => {
// //     const loadData = async () => {
// //       const data = await fetchOwnData();
// //       setOwnData(data);
// //       setLoading(false);
// //     };
// //     loadData();
// //   }, []);

// //   if (loading)
// //     return <p className="text-center text-gray-500 mt-10 font-sans">Loading...</p>;
// //   if (!ownData)
// //     return (
// //       <p className="text-center text-red-500 mt-10 font-sans">
// //         Failed to load employee data
// //       </p>
// //     );

// //   return (
// //     <div className="flex justify-center mt-10 font-sans">
// //       <div className="flex"><div className="mx-3 my-2 py-2 px-2 bg-blue-50">Check Task
// //         </div>
// //         <div className="bg-white rounded-2xl shadow-xl p-8 w-[400px] max-w-md text-center">
// //           <img
// //             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwTfu610P6eUMiQTsmAB_M2k9sg06HWkIkA&s"
// //             alt="Profile"
// //             className="w-32 h-42 rounded-full mx-auto  ounded-full object-cover border-4 border-indigo-500 mb-4"
// //           />
// //           <h2 className="text-2xl mb-[2.5rem] font-bold text-gray-800">{user.role}</h2>
// //           <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-left">
// //             <span className="font-medium text-gray-900">ID:</span>
// //             <p className="text-gray-600 text-[15px]">{ownData.id}</p>

// //             <span className="font-medium text-gray-900">Name:</span>
// //             <p className="text-gray-600 text-[18px]">{ownData.name}</p>

// //             <span className="font-medium text-gray-900">Email:</span>
// //             <p className="text-gray-600 text-[18px]">{ownData.email}</p>

// //             <span className="font-medium text-gray-900">Role:</span>
// //             <p className="text-gray-600 text-[18px]">{ownData.role}</p>
// //           </div>

// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default Employee;
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
//     return <p className="text-center text-gray-500 mt-10 font-sans">Loading...</p>;

//   if (!ownData)
//     return (
//       <p className="text-center text-red-500 mt-10 font-sans">
//         Failed to load employee data
//       </p>
//     );

//   return (
//     <div className="flex justify-center mt-12 px-4">
//       {/* Check All Present */}
//       <div className="mb-6 flex flex-wrap gap-4 justify-center">
//         <Link
//           to="/mark"
//           className="bg-teal-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
//         >
//           <h3 className="text-lg font-semibold">Mark Ur attance</h3>
//           <p className="text-sm opacity-90 mt-1">check status of attance</p>
//         </Link>
//       </div>
//       <div className="flex flex-col md:flex-row items-center gap-6">
      

//         {/* Profile Card */}
//         <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center transition-transform hover:scale-105 duration-300">
//           <div className="relative w-32 h-32 mx-auto mb-6">
//             <img
//               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwTfu610P6eUMiQTsmAB_M2k9sg06HWkIkA&s"
//               alt="Profile"
//               className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md"
//             />
//           </div>

//           <h2 className="text-2xl font-bold text-gray-800 mb-6">{user.role}</h2>

//           <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-left px-4">
//             <span className="font-medium text-gray-900">ID:</span>
//             <p className="text-gray-600">{ownData.id}</p>

//             <span className="font-medium text-gray-900">Name:</span>
//             <p className="text-gray-700">{ownData.name}</p>

//             <span className="font-medium text-gray-900">Email:</span>
//             <p className="text-gray-700 break-all">{ownData.email}</p>

//             <span className="font-medium text-gray-900">Role:</span>
//             <p className="text-gray-700">{ownData.role}</p>
//           </div>

//           {/* Optional: Add a button */}
//           <div className="mt-8">
//             <Link to={"/employeetask"} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300">
//               View My Tasks
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Employee;
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { Link } from "react-router-dom";

const Employee = () => {
  const { user, fetchOwnData, ownData, setOwnData, loading, setLoading } =
    useContext(AuthContext);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchOwnData();
      setOwnData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 font-sans">Loading...</p>
    );

  if (!ownData)
    return (
      <p className="text-center text-red-500 mt-10 font-sans">
        Failed to load employee data
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      
      {/* Attendance Action */}
    
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center transition-transform hover:scale-105 duration-300">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwTfu610P6eUMiQTsmAB_M2k9sg06HWkIkA&s"
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">{user.role}</h2>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-left px-4">
          <span className="font-medium text-gray-900">ID:</span>
          <p className="text-gray-600">{ownData.id}</p>

          <span className="font-medium text-gray-900">Name:</span>
          <p className="text-gray-700">{ownData.name}</p>

          <span className="font-medium text-gray-900">Email:</span>
          <p className="text-gray-700 break-all">{ownData.email}</p>

          <span className="font-medium text-gray-900">Role:</span>
          <p className="text-gray-700">{ownData.role}</p>
        </div>

        {/* View Tasks Button */}
        <div className="mt-8 gap-2">
          <Link
            to="/employeetask"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 inline-block"
          >
            View My Tasks
          </Link>
           <Link
            to="/mark"
            className="bg-green-500 mx-2 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 inline-block"
          >
            Attendance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Employee;
