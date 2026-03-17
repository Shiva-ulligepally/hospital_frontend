import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Chip, Avatar } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/doctors/public?page=0&size=50')
            .then(res => setDoctors(res.data.data.content))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Our Doctors</Typography>
            <Grid container spacing={3}>
                {doctors.map(doc => (
                    <Grid item xs={12} sm={6} md={4} key={doc.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                                  <LocalHospitalIcon fontSize="large" />
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold">{doc.user.fullName}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{doc.specialization}</Typography>
                                <Chip label={doc.department.name} color="primary" variant="outlined" size="small" sx={{ mb: 1 }} />
                                <Typography variant="body2" sx={{ mt: 1 }}>Experience: {doc.experience} years</Typography>
                                <Typography variant="body2">Fee: ${doc.consultationFee}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default DoctorList;
