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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Button,
    Modal,
    IconButton,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import NotificarUsuario from './alerta';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';
import CustomDatePickerFecha from '../src/Extras/dashboard/components/CustomDatePicker';

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

// Funciones de BD para compras
const funBD_insertarCompra = async (data) => {
    try {
        const compra = {
            proveedor_id: data.proveedor_id,
            fecha: data.fecha,
            total: data.total,
            detalles: data.detalles
        };
        console.log("Insertando compra:", compra);

        const res = await window.api.compras.insertar(compra);
        console.log("Respuesta insertar compra:", res);

        return res;
    } catch (error) {
        console.error("Error insertando compra:", error);
        return { success: false, error: error.message };
    }
}

const funBD_editarCompra = async (data) => {
    try {
        const compra = {
            id: data.id,
            proveedor_id: data.proveedor_id,
            fecha: data.fecha,
            total: data.total,
            detalles: data.detalles
        };
        console.log("Editando compra:", compra);

        const res = await window.api.compras.actualizar(compra);
        console.log("Respuesta editar compra:", res);

        return res;
    } catch (error) {
        console.error("Error editando compra:", error);
        return { success: false, error: error.message };
    }
}

const funBD_listarCompras = async () => {
    try {
        const res = await window.api.compras.listar();
        console.log("Listando compras:", res);

        if (res.success) {
            return res;
        }

        return { success: false, data: [] };
    } catch (error) {
        console.error("Error listando compras:", error);
        return { success: false, error: error.message };
    }
}

const funBD_eliminarCompra = async (id) => {
    try {
        const res = await window.api.compras.eliminar(id);
        console.log("Eliminando compra ID:", id, res);

        return res;
    } catch (error) {
        console.error("Error eliminando compra:", error);
        return { success: false, error: error.message };
    }
}

const funBD_obtenerDetallesCompra = async (id) => {
    try {
        const res = await window.api.compras.obtenerDetalles(id);
        console.log("Detalles de compra:", res);

        return res;
    } catch (error) {
        console.error("Error obteniendo detalles:", error);
        return { success: false, error: error.message };
    }
}

const funBD_listarProveedores = async () => {
    try {
        const res = await window.api.compras.listarProveedores();
        console.log("Proveedores:", res);

        if (res.success) {
            return res.data;
        }

        return [];
    } catch (error) {
        console.error("Error listando proveedores:", error);
        return [];
    }
}

const funBD_listarProductos = async () => {
    try {
        const res = await window.api.compras.listarProductos();
        console.log("Productos:", res);

        if (res.success) {
            return res.data;
        }

        return [];
    } catch (error) {
        console.error("Error listando productos:", error);
        return [];
    }
}

export function ComponenteCompras() {
    const [seleccionados, setSeleccionados] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    function renderStatus(status) {
        const colors = {
            Completada: 'success',
            Pendiente: 'warning',
            Cancelada: 'error',
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }

    async function listarCompras() {
        const result = await funBD_listarCompras();

        if (result.success) {
            const newCompras = result.data.map(item => {
                return { ...item, status: item.status || 'Completada' }
            });
            setDataList(newCompras);
        } else {
            setSnackbar({
                open: true,
                message: 'Error al listar compras: ' + (result.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    }

    async function cargarProveedores() {
        const proveedoresList = await funBD_listarProveedores();
        setProveedores(proveedoresList);
    }

    async function cargarProductos() {
        const productosList = await funBD_listarProductos();
        setProductos(productosList);
    }

    React.useEffect(() => {
        cargarProveedores();
        cargarProductos();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const [editarCompra, setEditarCompra] = useState(false);

    const editarCompraFunc = async (compra) => {
        setEditarCompra(true);
        console.log("Editando compra:", compra);

        // Obtener detalles de la compra
        const detallesResult = await funBD_obtenerDetallesCompra(compra.id);

        const detalles = detallesResult.success ? detallesResult.data : [];

        setFormData({
            id: compra.id,
            proveedor_id: compra.proveedor_id,
            fecha: compra.fecha,
            total: compra.total,
            detalles: detalles
        });
        handleOpen();
    };

    const handleSave = async (data) => {
        console.log("Guardando", data);
        console.log("editarCompra::", editarCompra);

        let result;
        if (editarCompra) {
            result = await handleEditar();
        } else {
            result = await handleGuardar();
        }

        if (result && result.success) {
            setSnackbar({
                open: true,
                message: editarCompra ? 'Compra actualizada exitosamente' : 'Compra registrada exitosamente',
                severity: 'success'
            });
            await listarCompras();
            setOpen(false);
        } else {
            setSnackbar({
                open: true,
                message: 'Error al guardar la compra: ' + (result?.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    };

    const [formData, setFormData] = useState({
        proveedor_id: '',
        fecha: new Date().toISOString().split('T')[0],
        total: 0,
        detalles: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGuardar = async () => {
        console.log("Data de compra::", formData);

        // Validaciones
        if (!formData.proveedor_id) {
            setSnackbar({
                open: true,
                message: 'Debe seleccionar un proveedor',
                severity: 'warning'
            });
            return { success: false };
        }

        if (!formData.detalles || formData.detalles.length === 0) {
            setSnackbar({
                open: true,
                message: 'Debe agregar al menos un producto',
                severity: 'warning'
            });
            return { success: false };
        }

        return await funBD_insertarCompra(formData);
    }

    const handleEditar = async () => {
        console.log("Data de compra::", formData);

        // Validaciones
        if (!formData.proveedor_id) {
            setSnackbar({
                open: true,
                message: 'Debe seleccionar un proveedor',
                severity: 'warning'
            });
            return { success: false };
        }

        if (!formData.detalles || formData.detalles.length === 0) {
            setSnackbar({
                open: true,
                message: 'Debe agregar al menos un producto',
                severity: 'warning'
            });
            return { success: false };
        }

        return await funBD_editarCompra(formData);
    }

    const handleNuevo = () => {
        setFormData({
            proveedor_id: '',
            fecha: new Date().toISOString().split('T')[0],
            total: 0,
            detalles: []
        });
        setEditarCompra(false);
        handleOpen();
    }

    const eliminarCompra = async (id) => {
        console.log("Eliminando compra ID:", id);

        const result = await funBD_eliminarCompra(id);

        if (result.success) {
            setSnackbar({
                open: true,
                message: 'Compra eliminada exitosamente',
                severity: 'success'
            });
            await listarCompras();
        } else {
            setSnackbar({
                open: true,
                message: 'Error al eliminar la compra: ' + (result.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const columnsCompras = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => renderStatus(params.value),
        },
        { field: 'proveedor_nombre', headerName: 'Proveedor', width: 200 },
        { field: 'fecha', headerName: 'Fecha', width: 120 },
        {
            field: 'total',
            headerName: 'Total',
            width: 120,
            renderCell: (params) => `S/. ${params.value?.toFixed(2) || '0.00'}`
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <IconButton
                        size="small"
                        onClick={() => editarCompraFunc(params.row)}
                        sx={{
                            color: '#6b7280',
                            '&:hover': { backgroundColor: '#f9fafb', color: '#4b5563' }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => eliminarCompra(params.row.id)}
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
                Gestión de Compras
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
                    Nueva Compra
                </Button>

                <Button
                    variant="contained"
                    onClick={listarCompras}
                    sx={{
                        backgroundColor: '#6b7280',
                        '&:hover': { backgroundColor: '#4b5563' }
                    }}
                >
                    Listar Compras
                </Button>
            </Box>

            <ModalFormularioCompra
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                formData={formData}
                onChange={handleChange}
                setFormData={setFormData}
                compraEditada={editarCompra}
                proveedores={proveedores}
                productos={productos}
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
                    columns={columnsCompras}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    localeText={esES.components.MuiDataGrid.defaultProps?.MuiDataGrid?.localeText || esES.localeText}
                    onRowSelectionModelChange={(newSelection) => {
                        setSeleccionados(newSelection);
                    }}
                    rowSelectionModel={seleccionados}
                />
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '1200px',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflow: 'auto'
};

function ModalFormularioCompra({ open, onClose, onSave, formData, onChange, setFormData, compraEditada, proveedores, productos }) {

    const agregarDetalle = () => {
        const nuevoDetalle = {
            producto_id: '',
            cantidad: 1,
            precio_compra: 0,
            subtotal: 0
        };
        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, nuevoDetalle]
        }));
    };

    const eliminarDetalle = (index) => {
        const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            detalles: nuevosDetalles
        }));
        calcularTotal(nuevosDetalles);
    };

    const actualizarDetalle = (index, campo, valor) => {
        const nuevosDetalles = [...formData.detalles];
        nuevosDetalles[index][campo] = valor;

        if (campo === 'cantidad' || campo === 'precio_compra') {
            nuevosDetalles[index].subtotal = nuevosDetalles[index].cantidad * nuevosDetalles[index].precio_compra;
        }

        setFormData(prev => ({
            ...prev,
            detalles: nuevosDetalles
        }));
        calcularTotal(nuevosDetalles);
    };

    const calcularTotal = (detalles = formData.detalles) => {
        const total = detalles.reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0);
        setFormData(prev => ({
            ...prev,
            total: total
        }));
    };

    // Actualizar el manejo de fecha cuando cambie formData.fecha
    const [value, setValue] = React.useState(dayjs());

    React.useEffect(() => {
        if (formData.fecha) {
            setValue(dayjs(formData.fecha));
        }
    }, [formData.fecha]);

    React.useEffect(() => {
        if (value) {
            const fechaFormateada = value.format('YYYY-MM-DD');
            if (fechaFormateada !== formData.fecha) {
                onChange({ target: { name: 'fecha', value: fechaFormateada } });
            }
        }
    }, [value]);

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>
                        {compraEditada ? 'Editar Compra' : 'Nueva Compra'}
                    </Typography>

                    <Grid container spacing={2}>
                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="proveedor_id" required>Proveedor</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={formData.proveedor_id}
                                    onChange={(e) => onChange({ target: { name: 'proveedor_id', value: e.target.value } })}
                                >
                                    {proveedores.map((proveedor) => (
                                        <MenuItem key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 6 }}>
                            <FormLabel htmlFor="fecha" required>Fecha</FormLabel>
                            <CustomDatePickerFecha value={value} setValue={setValue} />
                        </FormGrid>
                    </Grid>

                    <Box mt={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Detalles de Compra</Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={agregarDetalle}
                                sx={{
                                    backgroundColor: '#6b7280',
                                    '&:hover': { backgroundColor: '#4b5563' }
                                }}
                            >
                                Agregar Producto
                            </Button>
                        </Box>

                        {formData.detalles?.map((detalle, index) => (
                            <Box key={index} sx={{ border: '1px solid #e5e7eb', borderRadius: 1, p: 2, mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <FormGrid size={{ xs: 12, md: 4 }}>
                                        <FormLabel>Producto</FormLabel>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={detalle.producto_id}
                                                onChange={(e) => actualizarDetalle(index, 'producto_id', e.target.value)}
                                            >
                                                {productos.map((producto) => (
                                                    <MenuItem key={producto.id} value={producto.id}>
                                                        {producto.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </FormGrid>

                                    <FormGrid size={{ xs: 12, md: 2 }}>
                                        <FormLabel>Cantidad</FormLabel>
                                        <OutlinedInput
                                            type="number"
                                            size="small"
                                            value={detalle.cantidad}
                                            onChange={(e) => actualizarDetalle(index, 'cantidad', parseFloat(e.target.value) || 0)}
                                        />
                                    </FormGrid>

                                    <FormGrid size={{ xs: 12, md: 2 }}>
                                        <FormLabel>Precio</FormLabel>
                                        <OutlinedInput
                                            type="number"
                                            size="small"
                                            value={detalle.precio_compra}
                                            onChange={(e) => actualizarDetalle(index, 'precio_compra', parseFloat(e.target.value) || 0)}
                                        />
                                    </FormGrid>

                                    <FormGrid size={{ xs: 12, md: 2 }}>
                                        <FormLabel>Subtotal</FormLabel>
                                        <OutlinedInput
                                            size="small"
                                            value={`S/. ${detalle.subtotal?.toFixed(2) || '0.00'}`}
                                            disabled
                                        />
                                    </FormGrid>

                                    <FormGrid size={{ xs: 12, md: 2 }}>
                                        <IconButton
                                            color="error"
                                            onClick={() => eliminarDetalle(index)}
                                            sx={{ mt: 2 }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </FormGrid>
                                </Grid>
                            </Box>
                        ))}

                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Typography variant="h6">
                                Total: S/. {formData.total?.toFixed(2) || '0.00'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                        <Button
                            variant="contained"
                            onClick={() => onSave(formData)}
                            sx={{
                                backgroundColor: '#6b7280',
                                '&:hover': { backgroundColor: '#4b5563' }
                            }}
                        >
                            {compraEditada ? 'Actualizar' : 'Guardar'}
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
