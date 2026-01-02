
// // import React, { useContext } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "./Navbar.css";
// // import { AuthContext } from "../auth/AuthContext";

// // const Navbar = () => {
// //   const { user, loading, logout } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   // Wait until user state is loaded from localStorage
// //   if (loading) return null; // or show a small loader instead of null

// //   return (
// //     <nav className="navbar">
// //       <h1 className="title">Company Portal</h1>

// //       {user ? (
// //         <div className="user-section">
// //           <span className="welcome">Welcome, {user.name}!</span>
// //           <button className="btn logout" onClick={logout}>
// //             Logout
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="auth-section">
// //           <button className="btn login" onClick={() => navigate("/login")}>
// //             Login
// //           </button>
// //           <button className="btn register" onClick={() => navigate("/register")}>
// //             Register
// //           </button>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // };

// // export default Navbar;
// import React, { useContext, useState } from "react";
// import "./Navbar.css";
// import { AuthContext } from "../auth/AuthContext";
// import Login from "../pages/Login";
// import Register from "../pages/Register";

// const Navbar = () => {
//   const { user, logout, loading } = useContext(AuthContext);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   if (loading) return null;

//   return (
//     <nav className="navbar">
//       <h1 className="title">Company Portal</h1>

//       {user ? (
//         <div className="user-section">
//           <span className="welcome">Welcome, {user.name}!</span>
//           <button className="btn logout" onClick={logout}>Logout</button>
//         </div>
//       ) : (
//         <div className="auth-section">
//           <button className="btn login" onClick={() => setShowLogin(true)}>Login</button>
//           <button className="btn register" onClick={() => setShowRegister(true)}>Register</button>
//         </div>
//       )}

//       {showLogin && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-btn" onClick={() => setShowLogin(false)}>X</button>
//             <Login closeModal={() => setShowLogin(false)} />
//           </div>
//         </div>
//       )}

//       {showRegister && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-btn" onClick={() => setShowRegister(false)}>X</button>
//             <Register closeModal={() => setShowRegister(false)} />
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useContext, useState } from "react";
import "./Navbar.css";
import { AuthContext } from "../auth/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) return null;

  return (
    <nav className="navbar">
      <h1 className="title">Company Portal</h1>

      {user ? (
        <div className="user-section">
          <span className="welcome">Welcome, {user.name}!</span>
          <button className="btn logout" onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="auth-section">
          <button className="btn login" onClick={() => setShowLogin(true)}>Login</button>
          
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowLogin(false)}>X</button>
            <Login closeModal={() => setShowLogin(false)} />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowRegister(false)}>X</button>
            <Register
              closeModal={() => {
                setShowRegister(false); // close register modal
                setShowLogin(true);     // open login modal
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
