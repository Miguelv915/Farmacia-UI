import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { Link } from 'react-router-dom';

// src/components/views/AnalyticsView.jsx
 function AnalyticsView() {
  return <div>Analytics Content</div>;
}

// src/components/views/ClientsView.jsx
function ClientsView() {
  return <div>Clients Content</div>;
}

// src/components/views/TasksView.jsx
 function TasksView() {
  return <div>Tasks Content</div>;
}

// const mainListItems = [
//   // { text: 'Home_2', icon: <HomeRoundedIcon /> },
//   { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
//   { text: 'Clients', icon: <PeopleRoundedIcon /> },
//   { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
// ];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

// agregacion de rutas
const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, to: '/' },
  { text: 'Artículos', icon: <AssignmentRoundedIcon />, to: '/articulo' },
  { text: 'Proveedores', icon: <BusinessRoundedIcon />, to: '/proveedor' },
  { text: 'Alertas', icon: <InfoRoundedIcon />, to: '/alerta' },
  { text: 'Clientes', icon: <InfoRoundedIcon />, to: '/clientes' },
  { text: 'Compras', icon: <InfoRoundedIcon />, to: '/compras' },
];

export default function MenuContent() {
  // return <></>
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={item.to}
              selected={index === 2}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>


      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
