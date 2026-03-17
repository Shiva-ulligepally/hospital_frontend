import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Button, CircularProgress, Alert } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/departments').then(res => {
      setDepartments(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (selectedDept) {
      axiosInstance.get(`/doctors/department/${selectedDept}`).then(res => {
        setDoctors(res.data.data || []);
      });
      setSelectedDoctor('');
      setSlots([]);
      setSelectedTime('');
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      axiosInstance.get(`/appointments/slots/${selectedDoctor}/${selectedDate}`).then(res => {
        setSlots(res.data.data || []);
      }).catch(err => {
         console.error(err);
         setSlots([]);
      });
    }
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime) { setError('Please select a time slot'); return; }
    
    setLoading(true);
    try {
      await axiosInstance.post('/appointments/book', {
        doctorId: selectedDoctor,
        appointmentDate: selectedDate,
        timeSlot: selectedTime + ":00",
        symptoms: symptoms,
        notes: ''
      });
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Book Appointment</Typography>
      <Paper sx={{ p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Select Department" value={selectedDept} onChange={e => setSelectedDept(e.target.value)} required>
                {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Select Doctor" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} disabled={!selectedDept} required>
                {doctors.map(d => <MenuItem key={d.id} value={d.id}>{d.user.fullName} - {d.specialization}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                type="date" 
                fullWidth 
                label="Appointment Date" 
                InputLabelProps={{ shrink: true }} 
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
                disabled={!selectedDoctor}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Select Time Slot" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} disabled={slots.length === 0} required>
                {slots.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Symptoms (Optional)" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
export default BookAppointment;
