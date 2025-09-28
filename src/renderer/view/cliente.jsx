import * as React from 'react';
import { Alert, Chip, Snackbar, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Modal,
    IconButton,
} from '@mui/material';
import NotificarUsuario from './alerta';

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

// Funciones de BD para clientes (adaptar según tu API)
const funBD_insertarCliente = async (data) => {
    try {
        const cliente = {
            nombre: data.nombre,
            telefono: data.telefono,
            direccion: data.direccion
        };
        console.log("Insertando cliente:", cliente);

        // Aquí adaptarías para usar tu API de clientes
        const res = await window.api.cliente.insertar(cliente);

        console.log("Insertando cliente:", res);

        // Simulación de respuesta exitosa
        return { success: true, id: Math.random() };
    } catch (error) {
        console.log("error", error);
        
    }

}

const funBD_editarCliente = async (data) => {
    const cliente = {
        id: data.id,
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion
    };

    const res = await window.api.cliente.actualizar(cliente)
    console.log("Editando cliente:", cliente);
    console.log("Editando cliente:", res);

    return { success: true };
}

const funBD_listarClientes = async () => {
    const res = await window.api.cliente.listar();
    console.log("Listando clientes", res);
    if(res.success){
        return res.data
    }
    // Datos simulados para prueba
    const clientesSimulados = [
        { id: 1, nombre: 'Ana García', telefono: '123456789', direccion: 'Av. Principal 123' },
        { id: 2, nombre: 'Carlos López', telefono: '987654321', direccion: 'Calle Secundaria 456' },
        { id: 3, nombre: 'María Rodríguez', telefono: '555666777', direccion: 'Plaza Central 789' },
    ];

    return clientesSimulados;
}

const funBD_eliminarCliente = async (id) => {
    // const res = await window.api.cliente.eliminar(id);
    console.log("Eliminando cliente ID:", id);

    return { success: true };
}

export function ComponenteClientes() {
    const [seleccionados, setSeleccionados] = useState([]);
    const [dataList, setDataList] = useState([]);

    function renderStatus(status) {
        const colors = {
            Activo: 'success',
            Inactivo: 'default',
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }

    async function listarClientes() {
        const clientes = await funBD_listarClientes();
        console.log("CLIENTES::", clientes);
        const newClientes = clientes.map(item => {
            return { ...item, "status": 'Activo' }
        });

        console.log("newClientes::", newClientes);
        setDataList(newClientes);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const [editarCli, setEditarCli] = useState(false);

    const editarCliente = (cliente) => {
        setEditarCli(true);
        console.log("Editando cliente:", cliente);

        setFormData({
            id: cliente.id,
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            direccion: cliente.direccion,
        });
        handleOpen();
    };

    const handleSave = (data) => {
        console.log("Guardando", data);
        console.log("editarCli::", editarCli);

        if (editarCli) {
            handleEditar();
        } else {
            handleGuardar();
        }
        listarClientes();
        setOpen(false);
    };

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGuardar = () => {
        console.log("Data de ::", formData);
        funBD_insertarCliente(formData);
    }

    const handleEditar = () => {
        console.log("Data de ::", formData);
        funBD_editarCliente(formData);
    }

    const handleNuevo = () => {
        setFormData({
            nombre: '',
            telefono: '',
            direccion: '',
        });
        setEditarCli(false);
        handleOpen();
    }

    const eliminarCliente = (id) => {
        console.log("Eliminando cliente ID:", id);
        funBD_eliminarCliente(id);
        listarClientes();
    };

    const columnsClientes = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => renderStatus(params.value),
        },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'telefono', headerName: 'Teléfono', width: 150 },
        { field: 'direccion', headerName: 'Dirección', width: 250 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <IconButton
                        size="small"
                        onClick={() => editarCliente(params.row)}
                        sx={{
                            color: '#6b7280',
                            '&:hover': { backgroundColor: '#f9fafb', color: '#4b5563' }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => eliminarCliente(params.row.id)}
                        sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#fef2f2', color: '#dc2626' }
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Gestión Clientes
            </Typography>

            <Box mb={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button
                    variant="contained"
                    onClick={handleNuevo}
                    sx={{
                        backgroundColor: '#6b7280',
                        '&:hover': { backgroundColor: '#4b5563' }
                    }}
                >
                    Agregar Cliente
                </Button>

                <Button
                    variant="contained"
                    onClick={listarClientes}
                    sx={{
                        backgroundColor: '#6b7280',
                        '&:hover': { backgroundColor: '#4b5563' }
                    }}
                >
                    Listar Clientes
                </Button>
            </Box>

            <ModalFormularioCliente
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                formData={formData}
                onChange={handleChange}
                clienteEditado={editarCli}
            />

            <Box
                sx={{
                    height: 400,
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#f9fafb',
                    },
                }}
            >
                <DataGrid
                    checkboxSelection
                    rows={dataList}
                    columns={columnsClientes}
                    getRowId={(row) => row.id}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    localeText={esES.components.MuiDataGrid.defaultProps?.MuiDataGrid?.localeText || esES.localeText}
                    onRowSelectionModelChange={(newSelection) => {
                        setSeleccionados(newSelection);
                    }}
                    rowSelectionModel={seleccionados}
                />
            </Box>
        </Box>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxWidth: '800px',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

function ModalFormularioCliente({ open, onClose, onSave, formData, onChange, clienteEditado }) {
    React.useEffect(() => {
        // Efectos si son necesarios
    }, []);

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>
                        {clienteEditado ? 'Editar Cliente' : 'Agregar Cliente'}
                    </Typography>
                    <Grid container spacing={2}>
                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="nombre" required>Nombre</FormLabel>
                            <OutlinedInput
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre completo del cliente"
                                required
                                size="small"
                                value={formData.nombre}
                                onChange={onChange}
                            />
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="telefono" required>Teléfono</FormLabel>
                            <OutlinedInput
                                id="telefono"
                                name="telefono"
                                placeholder="Número de teléfono"
                                required
                                size="small"
                                value={formData.telefono}
                                onChange={onChange}
                            />
                        </FormGrid>

                        <FormGrid size={{ xs: 12 }}>
                            <FormLabel htmlFor="direccion">Dirección</FormLabel>
                            <OutlinedInput
                                id="direccion"
                                name="direccion"
                                placeholder="Dirección completa"
                                size="small"
                                value={formData.direccion}
                                onChange={onChange}
                            />
                        </FormGrid>
                    </Grid>

                    <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                        <Button
                            variant="contained"
                            onClick={() => onSave(formData)}
                            sx={{
                                backgroundColor: '#6b7280',
                                '&:hover': { backgroundColor: '#4b5563' }
                            }}
                        >
                            {clienteEditado ? 'Actualizar' : 'Guardar'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                borderColor: '#9ca3af',
                                color: '#6b7280',
                                '&:hover': { borderColor: '#6b7280', backgroundColor: '#f9fafb' }
                            }}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}