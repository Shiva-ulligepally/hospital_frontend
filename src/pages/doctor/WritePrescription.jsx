import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';

const WritePrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = new URLSearchParams(location.search).get('appointmentId');
  
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId) { setError("No appointment specified"); return; }
    
    setSaving(true);
    try {
      await axiosInstance.post('/prescriptions', {
        appointmentId, diagnosis, medicines, instructions
      });
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Write Prescription</Typography>
      <Paper sx={{ p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
             <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Medicines" value={medicines} onChange={e => setMedicines(e.target.value)} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Submit Prescription'}
              </Button>
               <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate('/doctor/dashboard')}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
export default WritePrescription;
