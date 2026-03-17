import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    axiosInstance.get('/patient/profile').then(res => {
      setProfile(res.data.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await axiosInstance.put('/patient/profile', profile);
      setMessage('Profile updated successfully');
    } catch(err) {
      setMessage('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>My Profile</Typography>
      <Paper sx={{ p: 4 }}>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={profile.user?.fullName || ''} onChange={e => setProfile({...profile, user: {...profile.user, fullName: e.target.value}})} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={profile.user?.phone || ''} onChange={e => setProfile({...profile, user: {...profile.user, phone: e.target.value}})} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField type="date" fullWidth label="Date of Birth" InputLabelProps={{ shrink: true }} value={profile.dateOfBirth || ''} onChange={e => setProfile({...profile, dateOfBirth: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Blood Group" value={profile.bloodGroup || ''} onChange={e => setProfile({...profile, bloodGroup: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Address" value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Medical History" value={profile.medicalHistory || ''} onChange={e => setProfile({...profile, medicalHistory: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
export default PatientProfile;
