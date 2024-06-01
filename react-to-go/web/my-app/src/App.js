import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (name.trim() === '' || age.trim() === '' || isNaN(age) || age < 20 || age > 80) {
      setError('Invalid input data');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/user', { name, age: parseInt(age) });
      setName('');
      setAge('');
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err.response ? err.response.data : 'Failed to save user');
    }
  };
  

  return (
    <div>
      <h1>User Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Age:</label>
          <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <button type="submit">送信</button>
      </form>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}, {user.age} years old</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
