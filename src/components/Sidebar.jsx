import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import { ROLES, hasRole } from '../utils/roleHelpers';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (!user) return [];
    
    if (hasRole(user, ROLES.ADMIN)) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Manage Doctors', icon: <LocalHospitalIcon />, path: '/admin/doctors' },
        { text: 'Manage Patients', icon: <PeopleIcon />, path: '/admin/patients' },
        { text: 'Manage Departments', icon: <MedicalServicesIcon />, path: '/admin/departments' },
        { text: 'All Appointments', icon: <EventIcon />, path: '/admin/appointments' }
      ];
    }
    
    if (hasRole(user, ROLES.DOCTOR)) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor/dashboard' },
        { text: 'Appointments', icon: <EventIcon />, path: '/doctor/appointments' },
        { text: 'Schedule', icon: <EventIcon />, path: '/doctor/schedule' },
        { text: 'Profile', icon: <PersonIcon />, path: '/doctor/profile' }
      ];
    }

    if (hasRole(user, ROLES.PATIENT)) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient/dashboard' },
        { text: 'Book Appointment', icon: <LocalHospitalIcon />, path: '/patient/book' },
        { text: 'My Appointments', icon: <EventIcon />, path: '/patient/appointments' },
        { text: 'My Prescriptions', icon: <MedicalServicesIcon />, path: '/patient/prescriptions' },
        { text: 'Profile', icon: <PersonIcon />, path: '/patient/profile' }
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <LocalHospitalIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'primary.main' }}>
            Smart Hospital
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(21, 101, 192, 0.08)',
                borderRight: '4px solid #1565C0',
                '& .MuiListItemIcon-root': {
                  color: '#1565C0',
                },
                '& .MuiListItemText-primary': {
                  color: '#1565C0',
                  fontWeight: 600,
                }
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
export default Sidebar;
