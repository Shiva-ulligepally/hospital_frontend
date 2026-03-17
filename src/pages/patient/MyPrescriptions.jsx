import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import DownloadIcon from '@mui/icons-material/Download';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axiosInstance.get('/patient/prescriptions');
      if (res.data.success) {
        setPrescriptions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch prescriptions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (prescription) => {
    const content = `
Prescription Details
===================
Doctor: ${prescription.doctorName}
Patient: ${prescription.patientName}
Date: ${prescription.issuedAt}
Diagnosis: ${prescription.diagnosis}
Medicines: ${prescription.medicines}
Instructions: ${prescription.instructions}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${prescription.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>My Prescriptions</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Medicines</TableCell>
              <TableCell>Instructions</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.doctorName}</TableCell>
                <TableCell>{row.diagnosis}</TableCell>
                <TableCell>{row.medicines}</TableCell>
                <TableCell>{row.instructions}</TableCell>
                <TableCell>{new Date(row.issuedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(row)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {prescriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No prescriptions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyPrescriptions;