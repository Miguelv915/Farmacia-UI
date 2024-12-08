
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from './ProTip';
import Copyright from './Copyright';
import Dashboard from './Extras/dashboard/Dashboard.jsx';

const { ipcRenderer } = window.require('electron');

// Insertar usuario
async function agregarUsuario() {
  const response = await ipcRenderer.invoke('insertar-usuario', {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
  });
  console.log(response);
}

// Obtener usuarios
async function listarUsuarios() {
  const response = await ipcRenderer.invoke('obtener-usuarios');
  console.log(response.usuarios);
}
export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
    // <Dashboard/>

  );
}
