import React, { useEffect, useState } from 'react';
import { Typography, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from the API (this is a placeholder, replace with actual API call)
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // Adjust the API endpoint as needed
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/admin/users/add'); // Navigate to the add user page
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddUser}>
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/admin/users/edit/${user.id}`)}>Edit</Button>
                  <Button onClick={() => {/* Add delete functionality here */}}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserManagement;
