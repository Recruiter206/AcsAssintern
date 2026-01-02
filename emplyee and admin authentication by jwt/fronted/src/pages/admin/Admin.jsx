
// // // import React, { useContext, useEffect, useState } from "react";
// // // import "../../pages/Dashboard.css";
// // // import { AuthContext } from "../../auth/AuthContext";

// // // const Admin = () => {
// // //   const { user, fetchEmployees, employees, updateEmployee,setEmployees ,loading, setLoading} = useContext(AuthContext);
// // //   // const [loading, setLoading] = useState(true);
// // //   const [editData, setEditData] = useState({});

// // //   // Load employees only if user is admin
// // //   useEffect(() => {
// // //     if (!user || user.role !== "admin") return;

// // //     const loadEmployees = async () => {
// // //       setLoading(true);
// // //       await fetchEmployees();
// // //       setLoading(false);
// // //     };
// // //     loadEmployees();
// // //   }, []);

// // //   // Track input changes
// // //   const handleChange = (id, field, value) => {
// // //     setEditData(prev => ({
// // //       ...prev,
// // //       [id]: {
// // //         ...prev[id],
// // //         [field]: value,
// // //       },
// // //     }));
// // //   };

// // //   // Update employee
// // //   const handleUpdate = async (id) => {
// // //   const edits = editData[id] || {};
// // //   const employee = employees.find(emp => emp.id === id);
// // //   if (!employee) return;

// // //   const payload = {
// // //     id: employee.id,
// // //     name: edits.name ?? employee.name,
// // //     role: edits.role ?? employee.role
// // //   };

// // //   console.log("Updating employee payload:", payload); // DEBUG LINE

// // //   await updateEmployee(id, payload);

// // //   setEmployees(prev =>
// // //     prev.map(emp => (emp.id === id ? { ...emp, ...payload } : emp))
// // //   );

// // //   setEditData(prev => ({ ...prev, [id]: {} }));
// // // };


// // //   return (
// // //     <div className="dashboard-container">
// // //       <h1 className="dashboard-title">Admin Dashboard</h1>
// // //       <p className="dashboard-message">Welcome to the Admin page! You have full access.</p>

// // //       {loading ? (
// // //         <p>Loading employees...</p>
// // //       ) : employees.length === 0 ? (
// // //         <p>No employees found.</p>
// // //       ) : (
// // //         <div className="employee-list">
// // //           <h2>Employee List:</h2>
// // //           <table className="employee-table">
// // //             <thead>
// // //               <tr>
// // //                 <th>Name</th>
// // //                 <th>Email</th>
// // //                 <th>Role</th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {employees.map(emp => {
// // //                 const empEdit = editData[emp.id] || {};
// // //                 return (
// // //                   <tr key={emp.id}>
// // //                     <td>
// // //                       <input
// // //                         type="text"
// // //                         value={empEdit.name ?? emp.name}
// // //                         onChange={(e) => handleChange(emp.id, "name", e.target.value)}
// // //                       />
// // //                     </td>
// // //                     <td>
// // //                       <input type="email" value={emp.email} disabled />
// // //                     </td>
// // //                     <td>
// // //                       <select
// // //                         value={empEdit.role ?? emp.role}
// // //                         onChange={(e) => handleChange(emp.id, "role", e.target.value)}
// // //                       >
// // //                         <option value="employee">Employee</option>
// // //                         <option value="admin">Admin</option>
// // //                       </select>
// // //                     </td>
// // //                     <td>
// // //                       <button className="update-btn" onClick={() => handleUpdate(emp.id)}>
// // //                         Update
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               })}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Admin;
// // import React, { useContext, useEffect, useState } from "react";
// // import "../../pages/Dashboards.css";
// // import { AuthContext } from "../../auth/AuthContext";

// // const Admin = () => {
// //   const { user, fetchEmployees, employees, updateEmployee, setEmployees, loading, setLoading } =
// //     useContext(AuthContext);

// //   const [editData, setEditData] = useState({});

// //   useEffect(() => {
// //     if (!user || user.role !== "admin") return;

// //     const loadEmployees = async () => {
// //       setLoading(true);
// //       await fetchEmployees();
// //       setLoading(false);
// //     };

// //     loadEmployees();
// //   }, []);

// //   const handleChange = (id, field, value) => {
// //     setEditData(prev => ({
// //       ...prev,
// //       [id]: {
// //         ...prev[id],
// //         [field]: value,
// //       },
// //     }));
// //   };

// //   const handleUpdate = async (id) => {
// //     const edits = editData[id] || {};
// //     const employee = employees.find(emp => emp.id === id);
// //     if (!employee) return;

// //     const payload = {
// //       id: employee.id,
// //       name: edits.name ?? employee.name,
// //       role: edits.role ?? employee.role,
// //     };

// //     await updateEmployee(id, payload);

// //     setEmployees(prev =>
// //       prev.map(emp => (emp.id === id ? { ...emp, ...payload } : emp))
// //     );

// //     setEditData(prev => ({ ...prev, [id]: {} }));
// //   };

// //   return (
// //     <div className="dashboard-container">
// //       <h1 className="dashboard-title">Admin Dashboard</h1>
// //       <p className="dashboard-message">Welcome to the Admin page! You have full access.</p>

// //       {loading ? (
// //         <p className="loading-text">Loading employees...</p>
// //       ) : employees.length === 0 ? (
// //         <p className="no-data-text">No employees found.</p>
// //       ) : (
// //         <div className="employee-list">
// //           <h2>Employee List</h2>
// //           <table className="employee-table">
// //             <thead>
// //               <tr>
// //                 <th>Name</th>
// //                 <th>Email</th>
// //                 <th>Role</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {employees.map(emp => {
// //                 const empEdit = editData[emp.id] || {};
// //                 return (
// //                   <tr key={emp.id}>
// //                     <td>
// //                       <input
// //                         type="text"
// //                         value={empEdit.name ?? emp.name}
// //                         onChange={(e) => handleChange(emp.id, "name", e.target.value)}
// //                         className="table-input"
// //                       />
// //                     </td>
// //                     <td>
// //                       <input type="email" value={emp.email} disabled className="table-input" />
// //                     </td>
// //                     <td>
// //                       <select
// //                         value={empEdit.role ?? emp.role}
// //                         onChange={(e) => handleChange(emp.id, "role", e.target.value)}
// //                         className="table-select"
// //                       >
// //                         <option value="employee">Employee</option>
// //                         <option value="admin">Admin</option>
// //                       </select>
// //                     </td>
// //                     <td>
// //                       <button className="update-btn" onClick={() => handleUpdate(emp.id)}>
// //                         Update
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Admin;

// import React, { useContext, useEffect, useState } from "react";
// import "../../pages/Dashboards.css";
// import { AuthContext } from "../../auth/AuthContext";

// const Admin = () => {
//   const { user, fetchEmployees, employees, updateEmployee, setEmployees, loading, setLoading } =
//     useContext(AuthContext);

//   const [editData, setEditData] = useState({});

//   useEffect(() => {
//     if (!user || user.role !== "admin") return;

//     const loadEmployees = async () => {
//       setLoading(true);
//       await fetchEmployees();
//       setLoading(false);
//     };

//     loadEmployees();
//   }, []);

//   const handleChange = (id, field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value,
//       },
//     }));
//   };

//   const handleUpdate = async (id) => {
//     const edits = editData[id] || {};
//     const employee = employees.find(emp => emp.id === id);
//     if (!employee) return;

//     const payload = {
//       id: employee.id,
//       name: edits.name ?? employee.name,
//       role: edits.role ?? employee.role,
//     };

//     await updateEmployee(id, payload);

//     setEmployees(prev =>
//       prev.map(emp => (emp.id === id ? { ...emp, ...payload } : emp))
//     );

//     setEditData(prev => ({ ...prev, [id]: {} }));
//   };

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-title">Admin Dashboard</h1>
//       <p className="dashboard-message">Welcome to the Admin page! You have full access.</p>

//       {loading ? (
//         <p className="loading-text">Loading employees...</p>
//       ) : employees.length === 0 ? (
//         <p className="no-data-text">No employees found.</p>
//       ) : (
//         <div className="cards-container">
//           {employees.map(emp => {
//             const empEdit = editData[emp.id] || {};
//             return (
//               <div className="employee-card" key={emp.id}>
//                 <div className="card-field">
//                   <label>Name:</label>
//                   <input
//                     type="text"
//                     value={empEdit.name ?? emp.name}
//                     onChange={(e) => handleChange(emp.id, "name", e.target.value)}
//                     className="card-input"
//                   />
//                 </div>
//                 <div className="card-field">
//                   <label>Email:</label>
//                   <input type="email" value={emp.email} disabled className="card-input" />
//                 </div>
//                 <div className="card-field">
//                   <label>Role:</label>
//                   <select
//                     value={empEdit.role ?? emp.role}
//                     onChange={(e) => handleChange(emp.id, "role", e.target.value)}
//                     className="card-select"
//                   >
//                     <option value="employee">Employee</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 <button className="update-btn" onClick={() => handleUpdate(emp.id)}>
//                   Update
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Admin;
import React, { useContext, useEffect, useState } from "react";
import "../../pages/Dashboards.css";
import { AuthContext } from "../../auth/AuthContext";

const Admin = () => {
  const { user, fetchEmployees, employees, updateEmployee, setEmployees } =
    useContext(AuthContext);
const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadEmployees = async () => {
      setLoading(true);
      await fetchEmployees();
      setLoading(false);
    };

    loadEmployees();
  }, []);

  const handleChange = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    const edits = editData[id] || {};
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    const payload = {
      id: employee.id,
      name: edits.name ?? employee.name,
      role: edits.role ?? employee.role,
    };

    await updateEmployee(id, payload);

    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...payload } : emp))
    );

    setEditData(prev => ({ ...prev, [id]: {} }));
  };

  return (
    <div className="dashboard-container">
      <h1 style={{textAlign:"center",justifyContent:"center", margin:"20px"}} className="dashboard-title">Admin Dashboard</h1>
      <p style={{textAlign:"center",justifyContent:"center", margin:"20px"}} className="dashboard-message">Welcome to the Admin page! You have full access.</p>

      {loading ? (
        <p className="loading-text">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="no-data-text">No employees found.</p>
      ) : (
        <div className="cards-container" style={{marginTop:"10px"}}>
          {employees.map(emp => {
            const empEdit = editData[emp.id] || {};
            return (
              <div className="employee-card" key={emp.id}>
                <div style={{border: "none"}} className="card-field">
                  <label>EmployeeId:</label>
                  <input
                    type="text"
                    value={empEdit.name ?? emp.id}
                    disabled 
                    className="card-input"
                  />
                </div>
                <div className="card-field">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={empEdit.name ?? emp.name}
                    onChange={(e) => handleChange(emp.id, "name", e.target.value)}
                    className="card-input"
                  />
                </div>
                <div className="card-field">
                  <label>Email:</label>
                  <input type="email" value={emp.email} disabled className="card-input" />
                </div>
                <div className="card-field">
                  <label>Role:</label>
                  <select
                    value={empEdit.role ?? emp.role}
                    onChange={(e) => handleChange(emp.id, "role", e.target.value)}
                    className="card-select"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button className="update-btn" onClick={() => handleUpdate(emp.id)}>
                  Update
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Admin;
