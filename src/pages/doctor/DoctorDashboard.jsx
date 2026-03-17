import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await axiosInstance.get('/doctor/appointments');
        if (apptRes.data.success) {
          setAppointments(apptRes.data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const confirmAppointment = async (id) => {
    try {
      const res = await axiosInstance.put(`/doctor/appointments/${id}/confirm`);
      if (res.data.success) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CONFIRMED' } : a));
      }
    } catch(err) {
       console.error("Failed to confirm");
    }
  }

  if (loading) return <CircularProgress />;

  const todaysDate = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.appointmentDate === todaysDate);
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING').length;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Doctor Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Today's Appointments</Typography>
                <Typography variant="h4">{todaysAppointments.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#ed6c02', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Pending Confirmations</Typography>
                <Typography variant="h4">{pendingAppointments}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>Today's Schedule</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Symptoms</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todaysAppointments.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.patientName}</TableCell>
                <TableCell>{row.timeSlot}</TableCell>
                <TableCell>{row.symptoms}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={row.status === 'CONFIRMED' ? 'success' : row.status === 'PENDING' ? 'warning' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  {row.status === 'PENDING' && (
                    <IconButton color="success" onClick={() => confirmAppointment(row.id)}>
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {todaysAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No appointments for today</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default DoctorDashboard;
