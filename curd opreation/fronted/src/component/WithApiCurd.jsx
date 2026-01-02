import React, { useState, useEffect } from 'react';
import { getUser, createUser, updateUser, deleteUser } from '../api/userApi';
import '../stylesheet/curds.css';

const WithApiCurd = () => {
    const [name, setName] = useState("");
    const [user, setUser] = useState([]);
    const [isEdited, setEditId] = useState(null);

    const fetchUser = async () => {
        try {
            const { data } = await getUser();
            setUser(data);
        } catch (error) {
            console.error("Error in fetching", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdited) {
                await updateUser(isEdited, { name });
                setEditId(null);
            } else {
                await createUser({ name });
            }
            setName('');
            fetchUser();
        } catch (error) {
            console.error("Error in submit", error);
        }
    };

    const handleEdit = (user) => {
        setName(user.name);
        setEditId(user.id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            fetchUser();
        } catch (error) {
            console.error("Error in delete", error);
        }
    };

    return (
        <div className='formCantainer'>
            <h1>CRUD Operation with API</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='Enter Your Name' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <button type='submit'>{isEdited ? "Update" : "Add"}</button>
            </form>
            <ul className="user-list">
                {user.map((user) => (
                    <li key={user.id}>
                        {user.name}
                        <button className='update_button' onClick={() => handleEdit(user)}>Update</button>
                        <button className='delete_button' onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WithApiCurd;
