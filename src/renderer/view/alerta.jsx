import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';

function NotificarUsuario() {
    const [open, setOpen] = useState(false);  // Control de visibilidad de la Snackbar
    const [message, setMessage] = useState('');  // Mensaje de la Snackbar
    const [severity, setSeverity] = useState('info'); // Tipo de mensaje: success, error, info, warning

    const mostrarAlerta = () => {
        setMessage('El producto se ha guardado correctamente.');
        setSeverity('success'); // Puede ser 'success', 'error', 'info', 'warning'
        setOpen(true);  // Abre el Snackbar
    };

    const handleClose = () => {
        setOpen(false);  // Cierra el Snackbar
    };

    return (
        <div>
            {/* Botón para mostrar la alerta */}
            <Button variant="contained" onClick={mostrarAlerta}>
                Mostrar Alerta
            </Button>
            {/* <Alert variant="filled" severity="success">
                This is a filled success Alert.
            </Alert>
            <Alert variant="filled" severity="info">
                This is a filled info Alert.
            </Alert>
            <Alert variant="filled" severity="warning">
                This is a filled warning Alert.
            </Alert>
            <Alert variant="filled" severity="error">
                This is a filled error Alert.
            </Alert> */}
            {/* Snackbar de Material-UI */}
            <Snackbar
                open={open}
                autoHideDuration={6000}  // Duración en milisegundos antes de cerrarse automáticamente
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }} // 🎯 POSICIÓN
            >

                {/* { vertical: 'bottom', horizontal: 'center' }
                    { vertical: 'top', horizontal: 'right' }
                    { vertical: 'bottom', horizontal: 'left' }
                    { vertical: 'top', horizontal: 'center' } */}
                <Alert  onClose={handleClose}

                    severity={severity} sx={{ width: '100%' }}>
                    {message}  {/* Mensaje que se mostrará */}
                </Alert>



            </Snackbar>
{/* 
            <Alert severity="error">Error</Alert>
            <Alert severity="warning">Advertencia</Alert>
            <Alert severity="info">Información</Alert> */}
        </div>
    );
}

export default NotificarUsuario;
