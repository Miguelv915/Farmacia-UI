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

// Funciones de BD para proveedores (adaptar según tu API)
const funBD_insertarProveedor = async (data) => {
    try {
        const proveedor = {
            nombre: data.nombre,
            empresa: data.empresa,
            telefono: data.telefono,
            email: data.email,
            direccion: data.direccion,
            contacto: data.contacto
        };
        const res = await window.api.proveedor.insertar(proveedor);
        console.log("Respuesta del proveedor  insercion::", res);

        return res;
        // Aquí adaptarías para usar tu API de proveedores
        // const res = await window.api.proveedor.insertar(proveedor);
        console.log("Insertando proveedor:", proveedor);

        // Simulación de respuesta exitosa
        return { success: true, id: Math.random() };

    } catch (error) {
        return {
            "success": false
        }

    }
}

const funBD_editarProveedor = async (data) => {
    const proveedor = {
        id: data.id,
        nombre: data.nombre,
        empresa: data.empresa,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
        contacto: data.contacto
    };

    const res = await window.api.proveedor.actualizar(proveedor);
    console.log("Editando proveedor:", proveedor);

    return { success: true };
}

const funBD_listarProveedores = async () => {
    try {
        const res = await window.api.proveedor.listar();
        return res;
    } catch (error) {
        return {
            "success": false
        }

    }



    console.log("Listando proveedores:", res.proveedores.data);

    let a = {
        "success": true,
        "proveedores": {
            "success": true,
            "data": [
                {
                    "idProveedor": 1,
                    "nombre": "IDUCTRIAS",
                    "direccion": "direcion de piura peru",
                    "telefono": "987456321"
                },
                {
                    "idProveedor": 2,
                    "nombre": "IDUCTRIAS",
                    "direccion": "direcion de piura peru",
                    "telefono": "987456321"
                }
            ]
        }
    }

    // Datos simulados para prueba
    const proveedoresSimulados = [
        { id: 1, nombre: 'Juan Pérez', empresa: 'Farmacéutica ABC', telefono: '123456789', email: 'juan@abc.com', direccion: 'Calle 123', contacto: 'Juan' },
        { id: 2, nombre: 'María García', empresa: 'Suministros Med', telefono: '987654321', email: 'maria@med.com', direccion: 'Av. Principal', contacto: 'María' },
    ];

    return proveedoresSimulados;
}

const funBD_eliminarProveedor = async (id) => {

    try {
        // const res = await window.api.proveedor.eliminar(id);
        console.log("Eliminando proveedor ID:", id);
        const res = await window.api.proveedor.eliminar(id);
        console.log(res);
        return { success: true };
    } catch (error) {
        console.log("Ocurrio un error");
        console.log(error);
        return {
            "success": false
        }
    }
}

export function ComponenteProveedores() {
    const [seleccionados, setSeleccionados] = useState([]);
    const [dataList, setDataList] = useState([]);

    function renderStatus(status) {
        const colors = {
            Activo: 'success',
            Inactivo: 'default',
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }

    async function listarProveedores() {
        const rest = await funBD_listarProveedores();

        if (!rest.success) {

        }

        const proveedores = rest['proveedores']['data']
        //     {
        // "success": true,
        // "proveedores": {
        //     "success": true,
        //     "data": [
        //         {
        console.log("PROVEEDORES::", proveedores);
        const newProveedores = proveedores.map(item => {
            return { ...item, "status": 'Activo' }
        });

        console.log("newProveedores::", newProveedores);
        setDataList(newProveedores);
    }


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const [editarProv, setEditarProv] = useState(false);

    const editarProveedor = (proveedor) => {
        setEditarProv(true);
        console.log("Editando proveedor:", proveedor);

        setFormData({
            id: proveedor.id,
            nombre: proveedor.nombre,
            empresa: proveedor.empresa,
            telefono: proveedor.telefono,
            email: proveedor.email,
            direccion: proveedor.direccion,
            contacto: proveedor.contacto,
        });
        handleOpen();
    };

    const handleSave = (data) => {
        console.log("Guardando", data);
        console.log("editarProv::", editarProv);

        if (editarProv) {
            handleEditar();
        } else {
            handleGuardar();
        }
        listarProveedores();
        setOpen(false);
    };

    const [formData, setFormData] = useState({
        nombre: '',
        empresa: '',
        telefono: '',
        email: '',
        direccion: '',
        contacto: '',
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
        funBD_insertarProveedor(formData);
    }

    const handleEditar = () => {
        console.log("Data de ::", formData);
        funBD_editarProveedor(formData);
    }

    const handleNuevo = () => {
        setFormData({
            nombre: '',
            empresa: '',
            telefono: '',
            email: '',
            direccion: '',
            contacto: '',
        });
        setEditarProv(false);
        handleOpen();
    }

    const eliminarProveedor = (id) => {
        console.log("Eliminando proveedor ID:", id);
        funBD_eliminarProveedor(id);
        listarProveedores();
    };

    const columnsProveedores = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => renderStatus(params.value),
        },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'empresa', headerName: 'Empresa', width: 180 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'direccion', headerName: 'Dirección', width: 200 },
        { field: 'contacto', headerName: 'Contacto', width: 130 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <IconButton
                        size="small"
                        onClick={() => editarProveedor(params.row)}
                        sx={{
                            color: '#6b7280',
                            '&:hover': { backgroundColor: '#f9fafb', color: '#4b5563' }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => eliminarProveedor(params.row.id)}
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
                Gestión Proveedores
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
                    Agregar Proveedor
                </Button>

                <Button
                    variant="contained"
                    onClick={listarProveedores}
                    sx={{
                        backgroundColor: '#6b7280',
                        '&:hover': { backgroundColor: '#4b5563' }
                    }}
                >
                    Listar Proveedores
                </Button>
            </Box>

            <ModalFormularioProveedor
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                formData={formData}
                onChange={handleChange}
                proveedorEditado={editarProv}
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
                    columns={columnsProveedores}
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
    maxWidth: '1000px',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

function ModalFormularioProveedor({ open, onClose, onSave, formData, onChange, proveedorEditado }) {
    React.useEffect(() => {
        // Efectos si son necesarios
    }, []);

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>
                        {proveedorEditado ? 'Editar Proveedor' : 'Agregar Proveedor'}
                    </Typography>
                    <Grid container spacing={2}>
                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="nombre" required>Nombre</FormLabel>
                            <OutlinedInput
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre del proveedor"
                                required
                                size="small"
                                value={formData.nombre}
                                onChange={onChange}
                            />
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="empresa" required>Empresa</FormLabel>
                            <OutlinedInput
                                id="empresa"
                                name="empresa"
                                placeholder="Nombre de la empresa"
                                required
                                size="small"
                                value={formData.empresa}
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

                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <OutlinedInput
                                id="email"
                                name="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                size="small"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 8 }}>
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

                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="contacto">Persona de Contacto</FormLabel>
                            <OutlinedInput
                                id="contacto"
                                name="contacto"
                                placeholder="Nombre del contacto"
                                size="small"
                                value={formData.contacto}
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
                            {proveedorEditado ? 'Actualizar' : 'Guardar'}
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