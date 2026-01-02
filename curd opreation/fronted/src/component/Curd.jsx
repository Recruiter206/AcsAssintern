import React, { useState } from 'react';
import '../stylesheet/curds.css';

const Curd = () => {
    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [isEdited, setEditId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) return; // prevent empty name

        if (isEdited ) {
            // Update existing user
            const updatedUsers = users.map(user =>
                user.id === isEdited ? { ...user, name } : user
            );
            setUsers(updatedUsers);
            setEditId(null);
        } else {
            // Add new user
            const newUser = {
                id: Date.now(), // unique id
                name
            };
            setUsers([...users, newUser]);
        }

        setName(""); // clear input
    };

    const handleEdit = (user) => {
        setName(user.name);
        setEditId(user.id);
    };

    const handleDelete = (id) => {
        const filteredUsers = users.filter(user => user.id !== id);
        setUsers(filteredUsers);
    };

    return (
        <div className='formCantainer'>
            <h1>CRUD without API</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='Enter Your Name' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <button type='submit'>{isEdited !== null ? "Update" : "Add"}</button>
            </form>

            <ul className="user-list">
                {users.map(user => (
                    <li key={user.id}>
                        {user.name}
                        <div>
                            <button className='update_button' onClick={() => handleEdit(user)}>Update</button>
                            <button className='delete_button' onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Curd;
