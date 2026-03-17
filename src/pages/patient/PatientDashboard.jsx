import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, presRes] = await Promise.all([
          axiosInstance.get('/patient/appointments'),
          axiosInstance.get('/patient/prescriptions')
        ]);
        if (apptRes.data.success) setAppointments(apptRes.data.data);
        if (presRes.data.success) setPrescriptions(presRes.data.data);
      } catch (err) {
        console.error("Dashboard data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;

  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length;
  const totalPrescriptions = prescriptions.length;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Patient Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Total Appointments</Typography>
                <Typography variant="h4">{appointments.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalServicesIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Total Prescriptions</Typography>
                <Typography variant="h4">{totalPrescriptions}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>Recent Appointments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.slice(0, 5).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.doctorName}</TableCell>
                <TableCell>{row.departmentName}</TableCell>
                <TableCell>{row.appointmentDate}</TableCell>
                <TableCell>{row.timeSlot}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={row.status === 'CONFIRMED' ? 'success' : row.status === 'PENDING' ? 'warning' : 'default'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No recent appointments</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientDashboard;
