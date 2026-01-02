// const bcrypt = require('bcrypt');
// const db = require('../config/db.js')
// const generateToken = require('../utils/jwt.js')

// const register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body

//         // Check if user already exists
//         db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
//             if (err) return res.status(500).json({ message: err.message });
//             if (existingUser) return res.status(400).json({ message: "Email already exists" });
//             const hashpowrd = await bcrypt.hash(password, 10)
//             db.run('insert into users (name,email,password,role) values (?,?,?,?)', [name, email, hashpowrd, role], function (err) {
//                 if (err) return res.status(400).json({ message: err.message });
//                 const newUser = {
//                     id: this.lastID,  // SQLite gives last inserted ID
//                     name,
//                     email,
//                     role
//                 };
//                 res.status(200).json({
//                     message: "User registered successfully",
//                     user: newUser,

//                 })
//             })
//         })
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }

// }

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         db.get('SELECT * FROM USERS WHERE email=?', [email], async (err, user) => {
//             if (err) return res.status(500).json({ message: err.message });
//             if (!user) return res.status(400).json({ message: "incorrect email" })
//             const ismatch = await bcrypt.compare(password, user.password)
//             if (!ismatch) return res.status(400).json({ message: "incorrect password" })
//             const token = generateToken(user)
//             res.status(200).json({
//                 token,
//                 role: user.role,
//                 id: user.id,
//                 name: user.name,
//             })
//         })

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// // get all employee data for admin
// const getEmployee = (req, res) => {
//  try {
//        db.all('select name ,id,email from users where role="employee" ', (err, row) => {
//         if (err) return res.status(500).json({ message: err.message });
//         res.json(row)
//     }

//     )
//  } catch (error) {
//     res.json({message:error.message})
//  }
// }

// // get own emplyee dashbord
// const getOwndata=(req,res)=>{
//     try {
//         const userId = req.user.id;
//         db.get('SELECT id, name, email FROM users WHERE id = ?',[userId],(err, row) => {
//         if (err) return res.status(500).json({ message: err.message });
//         res.json(row)
//     })
//     } catch (error) {
//          res.json({message:error.message})
//     }
// }

// // Update employee data (Admin only)
// // const updateEmployee = (req, res) => {
// //   const { id } = req.params; // employee ID
// //   const { name, email, role } = req.body;

// //   db.run('UPDATE users SET name=?, email=?, role=? WHERE id=?', [name, email, role, id],  function (err) {
// //     if (err) return res.status(500).json({ message: err.message });
// //     res.status(200).json({ message: 'Employee updated successfully' });
// //   });
// // };

// const updateEmployee = (req, res) => {
//     const { id } = req.params; // employee ID
//     const { name, role } = req.body;

    

//     // Check if employee exists
//     db.get('SELECT * FROM users WHERE id = ?', [id], (err, existingUser) => {
//         if (err) return res.status(500).json({ message: err.message });
//         if (!existingUser) return res.status(404).json({ message: "Employee not found" });

//         // Update employee (without email)
//         db.run(
//             'UPDATE users SET name = ?, role = ? WHERE id = ?',
//             [name, role, id],
//             function (err) {
//                 if (err) return res.status(500).json({ message: err.message });

//                 // Return the updated employee
//                 db.get('SELECT id, name, email, role FROM users WHERE id = ?', [id], (err, updatedUser) => {
//                     if (err) return res.status(500).json({ message: err.message });
//                     res.status(200).json({ message: "Employee updated successfully", employee: updatedUser });
//                 });
//             }
//         );
//     });
// };

// module.exports = { register, login,getEmployee,updateEmployee ,getOwndata}

const bcrypt = require('bcrypt');
const db = require('../config/db.js');
const generateToken = require('../utils/jwt.js');

// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) return res.status(500).json({ message: err.message });
            if (existingUser) return res.status(400).json({ message: "Email already exists" });

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role],
                function (err) {
                    if (err) return res.status(500).json({ message: err.message });

                    const newUser = {
                        id: this.lastID,
                        name,
                        email,
                        role
                    };

                    res.status(200).json({
                        message: "User registered successfully",
                        user: newUser
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!user) return res.status(400).json({ message: "Incorrect email" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

            const token = generateToken(user);

            res.status(200).json({
                token,
                role: user.role,
                id: user.id,
                name: user.name
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all employees (Admin only)
const getEmployee = (req, res) => {
    try {
        db.all('SELECT id, name, email, role FROM users WHERE role="employee"', (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get own data (Employee)
const getOwndata = (req, res) => {
    try {
        const userId = req.user.id;

        db.get('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(row);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update employee (Admin only, id in body)
const updateEmployee = (req, res) => {
    try {
        const { id, name, role } = req.body;

        if (!id) return res.status(400).json({ message: "Employee ID is required" });

        // Get existing employee
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, existingUser) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!existingUser) return res.status(404).json({ message: "Employee not found" });

            // Use existing values if fields not provided (partial update)
            const updatedName = name ?? existingUser.name;
            const updatedRole = role ?? existingUser.role;

            db.run('UPDATE users SET name = ?, role = ? WHERE id = ?', [updatedName, updatedRole, id], function (err) {
                if (err) return res.status(500).json({ message: err.message });

                // Return updated employee
                db.get('SELECT id, name, email, role FROM users WHERE id = ?', [id], (err, updatedUser) => {
                    if (err) return res.status(500).json({ message: err.message });
                    res.status(200).json({
                        message: "Employee updated successfully",
                        employee: updatedUser
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete employee (Admin only)
const deleteEmployee = (req, res) => {
    try {
        const { id } = req.body; // 👈 ID from body

        if (!id) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        // Check if employee exists
        db.get(
            'SELECT * FROM users WHERE id = ? AND role = "employee"',
            [id],
            (err, user) => {
                if (err) return res.status(500).json({ message: err.message });
                if (!user) return res.status(404).json({ message: "Employee not found" });

                // Delete employee
                db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
                    if (err) return res.status(500).json({ message: err.message });

                    res.status(200).json({
                        message: "Employee deleted successfully",
                        deletedEmployeeId: id
                    });
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { register, login, getEmployee, updateEmployee, getOwndata ,deleteEmployee};
