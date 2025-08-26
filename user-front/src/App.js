import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// The base URL for your Spring Boot API
const API_URL = 'http://13.221.183.129:8080/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  // 1. Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // 2. Handle input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  // 3. Handle form submission (Create and Update)
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Your Spring Boot POST endpoint handles both create and update
      await axios.post(API_URL, user);
      fetchUsers(); // Refresh the list
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // 4. Set form for editing a user
  const handleEdit = (userToEdit) => {
    setIsEditing(true);
    setUser(userToEdit);
  };

  // 5. Delete a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  // 6. Reset the form
  const resetForm = () => {
      setIsEditing(false);
      setUser({ name: '', email: '' });
  };

  return (
    <div className="container">
      <h1>User Management</h1>

      {/* User Form */}
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleInputChange}
          required
        />
        <div className="form-buttons">
            <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
            {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td className="actions">
                <button className="edit-btn" onClick={() => handleEdit(u)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
