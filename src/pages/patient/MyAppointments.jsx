import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Alert } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import CancelIcon from '@mui/icons-material/Cancel';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get('/patient/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await axiosInstance.put(`/appointments/${id}/cancel`);
      setMessage('Appointment cancelled successfully');
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setMessage('Failed to cancel appointment');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED': return 'primary';
      case 'CONFIRMED': return 'success';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>My Appointments</Typography>
      
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.doctorName}</TableCell>
                <TableCell>{row.departmentName}</TableCell>
                <TableCell>{row.appointmentDate}</TableCell>
                <TableCell>{row.timeSlot}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {row.status !== 'CANCELLED' && row.status !== 'COMPLETED' && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => handleCancel(row.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No appointments found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyAppointments;