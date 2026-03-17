import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../api/axiosInstance';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Total Patients</Typography>
                <Typography variant="h4">{stats.totalPatients}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Total Doctors</Typography>
                <Typography variant="h4">{stats.totalDoctors}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#9c27b0', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ed6c02', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Appointments</Typography>
                <Typography variant="h4">{stats.totalAppointments}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>Appointments per Department</Typography>
      <Box sx={{ width: '100%', height: 400, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats.appointmentsPerDepartment}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="appointmentCount" fill="#1565C0" name="Appointments" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
export default AdminDashboard;
