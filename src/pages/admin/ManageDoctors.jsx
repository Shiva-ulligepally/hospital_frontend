import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        axiosInstance.get('/doctors/public?page=0&size=100').then(res => {
            setDoctors(res.data.data.content);
        });
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/doctors/${id}`);
            setDoctors(doctors.filter(d => d.id !== id));
        } catch(err) {
            console.error("Failed to delete", err);
        }
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Manage Doctors</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Specialization</TableCell>
                            <TableCell>Fee</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.user.fullName}</TableCell>
                                <TableCell><Chip label={row.department.name} size="small" /></TableCell>
                                <TableCell>{row.specialization}</TableCell>
                                <TableCell>${row.consultationFee}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
export default ManageDoctors;
